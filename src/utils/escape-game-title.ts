export const escapeGameTitle = (title: string) => {
  return encodeURIComponent(title)
    .replace(/%[a-f0-9]{2}/gi, '_')
    .replace(/\+/g, '_')
    .replace(/_+/g, '_')
    .replace(/_$/, '');
};
