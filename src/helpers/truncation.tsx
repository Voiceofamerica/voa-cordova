export function truncateTitleText (title: string, hasIcon: boolean) {
  if (title.length > 16 || (title.length === 16 && hasIcon)) {
    const truncateLength = hasIcon ? 13 : 14
    title = title.slice(0, truncateLength) + '……'
  }
  return title
}
