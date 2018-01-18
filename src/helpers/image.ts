
const pathRgx = /\/(.{36})((?:_tv)?)((?:_[^\._]+)*)\.(.*)/
export function mapImageUrl (url: string, params: string = 'w300') {
  const parsedUrl = new URL(url)
  const pathParts = pathRgx.exec(parsedUrl.pathname)
  const guid = pathParts[1]
  const tv = pathParts[2]
  const mods = pathParts[3]
  const ext = pathParts[4]
  parsedUrl.pathname = `${guid}${tv}_${params}${mods}.${ext}`
  return parsedUrl.toString()
}
