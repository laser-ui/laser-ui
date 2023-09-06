export function isPrintableCharacter(c: string) {
  return c.length === 1 && c.match(/\S| /);
}
