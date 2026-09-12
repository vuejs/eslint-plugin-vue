export function fileURLToPath(url) {
  return new URL(url).pathname
}

export default { fileURLToPath }
