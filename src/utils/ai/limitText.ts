export function limitText(text: string, max = 3000) {
  return text.length > max
    ? text.slice(0, max)
    : text;
}
