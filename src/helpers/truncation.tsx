
const MAX_LENGTH = 32

export function truncateTitleText (title: string, hasIcon: boolean) {
  if (title.length > MAX_LENGTH || (title.length === MAX_LENGTH && hasIcon)) {
    const truncateLength = hasIcon ? MAX_LENGTH - 2 : MAX_LENGTH - 1
    title = title.slice(0, truncateLength) + '…'
  }
  return title
}
