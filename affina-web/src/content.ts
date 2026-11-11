export const CONTACT = {
  emails: ['admin@joybps.com', 'admin@joyrts.com'],
  phone: '+91 99622 11935',
  phoneHref: 'tel:+919962211935',
  office: 'Chennai, India',
};

// Shared demo account for the "Try Affina" section.
export const DEMO_APP = {
  url: 'https://affina-web.vercel.app/login',
  email: 'admin@joybps.com',
  password: 'Admin@123',
  // The demo app currently sends `X-Frame-Options: DENY`, so browsers refuse to embed it.
  // Set this to true after the app allows framing from this site (CSP frame-ancestors).
  embed: false,
};
