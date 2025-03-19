export function formatName(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/\./g, ' ');
}
