export function getRainbowColor(ratio: number) {
  const H = 360 * ratio;
  return `hsl(${H}, 100%, 65%)`;
}
