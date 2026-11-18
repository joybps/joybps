/** Builds the enquiry email sent to the team: a plain-text version and a clean, table-based HTML version that works in Gmail, Outlook and Zoho. */

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

export interface EnquiryEmail {
  brand: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
  receivedAt: Date;
}

export function enquiryEmail(e: EnquiryEmail) {
  const when = e.receivedAt.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }) + ' IST';

  const rows: [string, string, string?][] = [
    ['Name', e.name],
    ['Email', e.email, `mailto:${e.email}`],
    ['Company', e.company],
    ['Phone', e.phone, e.phone ? `tel:${e.phone.replace(/[^\d+]/g, '')}` : undefined],
    ['Interested in', e.interest],
  ];
  const shown = rows.filter(([, v]) => v);

  const text = [`New enquiry from ${e.name} (${e.brand} website)`, `Received: ${when}`, '', ...shown.map(([k, v]) => `${k}: ${v}`), '', 'Message:', e.message, '', `Reply to this email to answer ${e.name} directly.`].join('\n');

  const row = ([k, v, href]: [string, string, string?]) =>
    `<tr>
      <td style="padding:12px 0;width:128px;vertical-align:top;font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;border-bottom:1px solid #e8eff7">${esc(k)}</td>
      <td style="padding:12px 0;vertical-align:top;font-size:15px;line-height:1.5;color:#0f172a;border-bottom:1px solid #e8eff7">${href ? `<a href="${esc(href)}" style="color:#0369a1;text-decoration:none">${esc(v)}</a>` : esc(v)}</td>
    </tr>`;

  const first = esc(e.name.split(' ')[0] || e.name);
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light only"><title>New enquiry</title></head>
<body style="margin:0;padding:0;background:#f4f8fc;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#f4f8fc">${esc(e.name)} sent an enquiry through the ${esc(e.brand)} website.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8fc;padding:32px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
        <tr><td style="padding:0 6px 16px;font-size:22px;font-weight:800;letter-spacing:-.03em;color:#0f172a">${esc(e.brand)}</td></tr>
        <tr><td style="background:#ffffff;border:1px solid #d7e6f5;border-radius:16px;overflow:hidden;box-shadow:0 8px 28px rgba(14,165,233,.08)">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="height:4px;line-height:4px;font-size:0;background:#0ea5e9">&nbsp;</td></tr>
            <tr><td style="background:#f0f9ff;padding:24px 30px;border-bottom:1px solid #dbeafe">
              <div style="font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#0369a1">New website enquiry</div>
              <div style="margin-top:8px;font-size:22px;line-height:1.3;font-weight:700;color:#0f172a">${esc(e.name)}${e.company ? ` <span style="font-weight:500;color:#475569">from ${esc(e.company)}</span>` : ''}</div>
              <div style="margin-top:6px;font-size:13px;color:#64748b">Received ${esc(when)}</div>
            </td></tr>
            <tr><td style="padding:10px 30px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${shown.map(row).join('')}</table>
            </td></tr>
            <tr><td style="padding:22px 30px 0">
              <div style="font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;margin-bottom:10px">Message</div>
              <div style="background:#f8fbff;border:1px solid #dbeafe;border-left:4px solid #0ea5e9;border-radius:10px;padding:16px 18px;font-size:15px;line-height:1.7;color:#1e293b;white-space:pre-wrap">${esc(e.message)}</div>
            </td></tr>
            <tr><td style="padding:26px 30px 30px">
              <a href="mailto:${esc(e.email)}?subject=${encodeURIComponent('Re: your enquiry to ' + e.brand)}" style="display:inline-block;background:#0284c7;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:13px 24px;border-radius:10px">Reply to ${first}</a>
              <div style="margin-top:14px;font-size:12.5px;line-height:1.5;color:#64748b">You can also reply to this email. Your answer goes straight to <a href="mailto:${esc(e.email)}" style="color:#0369a1;text-decoration:none">${esc(e.email)}</a>.</div>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:18px 6px 0;font-size:12px;line-height:1.6;color:#94a3b8;text-align:center">This message was sent from the contact form on the ${esc(e.brand)} website.<br>Please do not share it outside your team.</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { text, html };
}
