/** Contact form rules, shared by the form (client) and the API route (server) so both always agree. */
export interface ContactFields {
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
}
export type ContactErrors = Partial<Record<'name' | 'email' | 'phone' | 'company' | 'message', string>>;

export const LIMITS = { name: 120, email: 160, company: 160, phone: 30, interest: 160, message: 4000 } as const;

const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
const PHONE_RE = /^[+()\d][\d\s().-]{5,}$/;

export function validateContact(v: Partial<ContactFields>): ContactErrors {
  const e: ContactErrors = {};
  const name = (v.name ?? '').trim();
  const email = (v.email ?? '').trim();
  const phone = (v.phone ?? '').trim();
  const company = (v.company ?? '').trim();
  const message = (v.message ?? '').trim();

  if (name.length < 2) e.name = 'Please enter your name.';
  else if (name.length > LIMITS.name) e.name = `Name must be ${LIMITS.name} characters or fewer.`;

  if (!email) e.email = 'Please enter your email address.';
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) e.email = 'Please enter a valid email address.';

  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (!PHONE_RE.test(phone) || digits.length < 7 || digits.length > 15) e.phone = 'Please enter a valid phone number.';
  }

  if (company.length > LIMITS.company) e.company = `Company must be ${LIMITS.company} characters or fewer.`;

  if (message.length < 10) e.message = 'Please tell us a little more (at least 10 characters).';
  else if (message.length > LIMITS.message) e.message = `Message must be ${LIMITS.message} characters or fewer.`;

  return e;
}
