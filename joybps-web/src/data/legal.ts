export interface LegalSection {
  h: string;
  p?: string[];
  ul?: string[];
}

/** Sample legal text for review by a lawyer before publishing. Company: JBPSI India Private Limited (brand: Joybps). */
export const PRIVACY: LegalSection[] = [
  { h: 'Who we are', p: ['This website is operated by JBPSI India Private Limited, trading as Joybps ("Joybps", "we", "us"). This policy explains what personal information we collect through www.joybps.com, how we use it and the choices you have.'] },
  { h: 'Information we collect', p: ['We collect information you give us directly and information collected automatically when you use the site.'], ul: ['Contact details you submit through our forms, such as name, email address, company, phone number and your message', 'Technical data such as IP address, browser type, device and pages visited, collected through cookies and similar tools', 'Anything else you choose to send us by email'] },
  { h: 'How we use your information', ul: ['To respond to your enquiries and provide quotes, demos and support', 'To operate, secure and improve our website and services', 'To send updates you have asked for, and you can unsubscribe at any time', 'To meet legal and accounting obligations'] },
  { h: 'Spam protection', p: ['Our contact form uses Google reCAPTCHA to protect against spam and abuse. reCAPTCHA collects hardware and software information and sends it to Google, which is subject to Google\'s own privacy policy and terms.'] },
  { h: 'Sharing your information', p: ['We do not sell your personal information. We share it only with service providers who help us run the website and our business (for example hosting, email and analytics), under confidentiality obligations, or when the law requires it.'] },
  { h: 'Data retention', p: ['We keep enquiry information only as long as needed to respond to you and for a reasonable period afterwards for business records, unless the law requires us to keep it longer.'] },
  { h: 'Your rights', p: ['Depending on where you live, you may have the right to access, correct or delete your personal information, or to object to certain uses. To exercise these rights, email us at the address below.'] },
  { h: 'Security', p: ['We use reasonable technical and organisational measures to protect your information. No method of transmission over the internet is completely secure, so we cannot guarantee absolute security.'] },
  { h: 'Changes to this policy', p: ['We may update this policy from time to time. The latest version is always on this page, with the date it was last updated.'] },
  { h: 'Contact us', p: ['For any privacy question, write to admin@joybps.com or to JBPSI India Private Limited, Chennai, India.'] },
];

export const TERMS: LegalSection[] = [
  { h: 'Agreement to these terms', p: ['By using www.joybps.com you agree to these terms and conditions. The website is operated by JBPSI India Private Limited, trading as Joybps. If you do not agree, please do not use the website.'] },
  { h: 'Use of the website', ul: ['You may use the site for lawful purposes only', 'You must not attempt to disrupt, scrape at scale or gain unauthorised access to the site or its systems', 'You must provide accurate information when you contact us'] },
  { h: 'Our services and products', p: ['Information on this site about our services and products (Affina, Iris, Hestia, Joybooks and Athena) is for general information. Specific work is governed by a separate written agreement, proposal or order form between you and Joybps.'] },
  { h: 'Intellectual property', p: ['The content, design, logos and code of this website belong to Joybps or its licensors and are protected by law. You may not copy or reuse them without our written permission. Client names and logos are shown with permission.'] },
  { h: 'Third-party links', p: ['The site may link to third-party websites, including our product websites. We are not responsible for the content or practices of sites we do not control.'] },
  { h: 'Disclaimer', p: ['The website is provided "as is" without warranties of any kind. We try to keep information accurate and current but do not guarantee that it is complete or error-free.'] },
  { h: 'Limitation of liability', p: ['To the maximum extent permitted by law, Joybps is not liable for any indirect or consequential loss arising from your use of this website.'] },
  { h: 'Governing law', p: ['These terms are governed by the laws of India. Courts in Chennai, India have exclusive jurisdiction over any dispute, unless the law requires otherwise.'] },
  { h: 'Changes and contact', p: ['We may update these terms at any time. Questions can be sent to admin@joybps.com.'] },
];

export const COOKIES: LegalSection[] = [
  { h: 'What are cookies', p: ['Cookies are small text files stored on your device when you visit a website. They help the site work, remember preferences and understand how it is used.'] },
  { h: 'Cookies we use', ul: ['Essential cookies and storage needed for the site and contact form to work and stay secure', 'Security cookies set by Google reCAPTCHA to tell humans from bots', 'Analytics cookies (Google Analytics), set only if you choose Accept all in the cookie bar, to understand which pages are useful','Your cookie choice itself, stored for 12 months so we do not ask you again'] },
  { h: 'Managing cookies', p: ['You can change your choice at any time with the Cookie settings link in the footer, or block or delete cookies in your browser settings. Blocking essential cookies may stop parts of the site, such as the contact form, from working.'] },
  { h: 'Contact', p: ['Questions about this policy can be sent to admin@joybps.com.'] },
];
