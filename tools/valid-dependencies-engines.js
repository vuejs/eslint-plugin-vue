/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const cp = require('child_process')
const semver = require('semver')
const pkg = require('../package.json')
const nodeVer = pkg.engines.node
const deps = { ...pkg.dependencies, ...pkg.peerDependencies }

for (const [name, ver] of Object.entries(deps)) {
  // eslint-disable-next-line no-console
  // console.log(`call npm view "${name}@${ver}" --json`)
  const json = cp.execSync(`npm view "${name}@${ver}" --json`, {
    maxBuffer: 1024 * 1024 * 100
  })
  const meta = JSON.parse(json)
  const v = meta.engines && meta.engines.node
  if (v && !semver.subset(nodeVer, v)) {
    // eslint-disable-next-line no-console
    console.error(
      `"${name}@${ver}" is not compatible with "node@${nodeVer}".\nAllowed is:${v}`
    )
    process.exit(1)
  }
}
