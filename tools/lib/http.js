module.exports = {
  httpGet
}
function httpGet(url) {
  return fetch(url).then((res) => res.text())
}
