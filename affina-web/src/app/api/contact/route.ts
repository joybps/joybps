import nodemailer from 'nodemailer';
import { validateContact, LIMITS } from '../../../lib/contact-validation';
import { enquiryEmail } from '../../../lib/contact-email';

export const runtime = 'nodejs';

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
/** Removes line breaks so user input can never inject mail headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim();

/** Best-effort throttle per IP (per server instance): 5 messages every 10 minutes. */
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

/** Checks the reCAPTCHA token with Google. */
async function verifyRecaptcha(token: string, ip: string | null) {
  const secret = process.env.SECRET_KEY;
  if (!secret) throw new Error('SECRET_KEY is not set');
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body, signal: AbortSignal.timeout(8000) });
  const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
  if (data.success !== true) console.warn('reCAPTCHA rejected:', (data['error-codes'] ?? []).join(', '));
  return data.success === true;
}

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // honeypot: real visitors never fill this field
  if (clip(data.website, 200)) return Response.json({ ok: true });

  const fields = {
    name: clip(data.name, LIMITS.name + 1),
    email: clip(data.email, LIMITS.email + 1),
    company: clip(data.company, LIMITS.company + 1),
    phone: clip(data.phone, LIMITS.phone + 1),
    interest: clip(data.interest, LIMITS.interest),
    message: clip(data.message, LIMITS.message + 1),
  };
  const errors = validateContact(fields);
  if (Object.keys(errors).length) {
    return Response.json({ error: Object.values(errors)[0], fields: errors }, { status: 400 });
  }
  const { name, email, company, phone, interest, message } = fields;

  const token = clip(data.token, 4000);
  if (!token) return Response.json({ error: 'Please confirm you are not a robot.' }, { status: 400 });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null;
  if (ip && limited(ip)) return Response.json({ error: 'Too many messages. Please try again in a few minutes.' }, { status: 429 });

  let human = false;
  try {
    human = await verifyRecaptcha(token, ip);
  } catch (err) {
    console.error('reCAPTCHA verification error:', err instanceof Error ? err.message : err);
    return Response.json({ error: 'Could not verify reCAPTCHA. Please try again.' }, { status: 502 });
  }
  if (!human) return Response.json({ error: 'reCAPTCHA check failed. Please try again.' }, { status: 400 });

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error('Contact email is not configured: set SMTP_USER and SMTP_PASS.');
    return Response.json({ error: 'Email is not configured on the server.' }, { status: 500 });
  }

  const product = process.env.PRODUCT_NAME || 'Website';
  const to = process.env.CONTACT_TO || user;
  const cc = process.env.CONTACT_CC || undefined;

  const { text, html } = enquiryEmail({ brand: product, name, email, company, phone, interest, message, receivedAt: new Date() });

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.in',
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // port 587 starts plain and upgrades with STARTTLS
      requireTLS: true,
      auth: { user, pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
    const safeName = oneLine(name).replace(/["<>]/g, '');
    await transporter.sendMail({
      from: `"${product} website" <${user}>`, // Zoho only sends as the signed-in mailbox
      to,
      cc,
      replyTo: `"${safeName}" <${email}>`,
      subject: `[${product}] New enquiry from ${oneLine(name)}${company ? ` (${oneLine(company)})` : ''}`,
      text,
      html,
    });
  } catch (err) {
    console.error('Contact email failed:', err instanceof Error ? err.message : err);
    return Response.json({ error: 'We could not send your message. Please try again, or email us directly.' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
