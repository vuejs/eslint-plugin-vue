/* globals window */
// @ts-nocheck
export const process = {
  env: {},
  cwd: () => '',
  stdout: {}
}
if (typeof window !== 'undefined') {
  window.process = process
}
