/* globals window */
export default (
  // eslint-disable-next-line no-empty-pattern
  {
    //     Vue, // the version of Vue being used in the VuePress app
    //     options, // the options for the root Vue instance
    //     router, // the router instance for the app
    //     siteData, // site metadata
  }
) => {
  if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
    window.process = new Proxy(
      {
        env: {},
        cwd: () => undefined
      },
      {
        get(target, name) {
          // For debug
          // console.log(name)
          return target[name]
        }
      }
    )
  }
}
