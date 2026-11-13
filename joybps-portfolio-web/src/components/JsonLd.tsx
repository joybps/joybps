import React from 'react';

/** Renders one or more JSON-LD structured data objects. Server component, so it is in the HTML Google first sees. */
export const JsonLd: React.FC<{ data: object | object[] }> = ({ data }) => (
  <script
    type="application/ld+json"
    // JSON.stringify output with "<" escaped so content can never close the script tag.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
  />
);
