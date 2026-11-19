import { Fragment } from 'react';

// Thai copy mixes in English terms. Wrap each Latin run in lang="en" so screen readers switch voice
// for "cyber-physical systems" and back to Thai for the rest (html lang="th").
const latinRun = /([A-Za-z][A-Za-z0-9&/+.,'’()\- ]*[A-Za-z0-9)])/;

export function LangText({ text }: Readonly<{ text: string }>) {
  const parts = text.split(latinRun);
  if (parts.length === 1) return <>{text}</>;
  return <>{parts.map((part, index) => (index % 2 === 1 ? <span lang="en" key={index}>{part}</span> : <Fragment key={index}>{part}</Fragment>))}</>;
}
