
const pathRgx = /\/(.{36})((?:_tv)?)[^\.]*\.(.*)/
export function mapImageUrl (url: string, params: string = 'w300') {
  const parsedUrl = new URL(url)
  const pathParts = pathRgx.exec(parsedUrl.pathname)
  const guid = pathParts[1]
  const tv = pathParts[2]
  const ext = pathParts[3]
  parsedUrl.pathname = `${guid}${tv}_${params}.${ext}`
  return parsedUrl.toString()
}
