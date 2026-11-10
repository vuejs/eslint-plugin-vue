export const process = {
  env: {},
  cwd: () => '/',
  stdout: {}
}
// @ts-expect-error -- Browser
if (typeof window !== 'undefined') {
  // @ts-expect-error -- Browser
  window.process = process
}
