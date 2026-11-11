import React from 'react';

/** Renders JSON-LD structured data. Server component, so it is in the HTML search engines first see. */
export const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
);
