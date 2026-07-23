export default {
  httpGet
}
async function httpGet(url) {
  const res = await fetch(url)
  return res.text()
}
