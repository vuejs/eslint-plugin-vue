// @ts-nocheck
export const sep = '/'
export function basename(path, ext) {
  const b = (/[^\/]*$/u.exec(path) || [''])[0]
  return ext && b.endsWith(ext) ? b.slice(0, -ext.length) : b
}
export function extname(path) {
  return (/[^.\/]*$/u.exec(path) || [''])[0]
}
export function isAbsolute() {
  return false
}
export function join(...args) {
  return args.length > 0 ? normalize(args.join('/')) : '.'
}

function normalize(path) {
  const result = []
  for (const part of path.replace(/\/+/gu, '/').split('/')) {
    if (part === '..') {
      if (result[0] && result[0] !== '..' && result[0] !== '.') result.shift()
    } else if (part === '.' && result.length > 0) {
      // noop
    } else {
      result.unshift(part)
    }
  }
  return result.reverse().join('/')
}
const posix = {
  sep,
  basename,
  extname,
  isAbsolute,
  join
}
posix.posix = posix
export default posix
