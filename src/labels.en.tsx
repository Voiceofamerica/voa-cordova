
import * as React from 'react'

export const graphqlLanguage = 'en'

export const momentLocale = 'en-us'

export const articleLabels = {
  updatedOn: (date: string) => `Updated on ${date}`,
  relatedContent: 'Related',
}

export const bottomNavLabels = {
  home: 'Home',
  breakingNews: 'Breaking',
  media: 'Media',
  liveStream: 'Stream',
  settings: 'Me',
}

export const breakingNewsLabels = {
  header: 'Breaking News',
  noNews: 'There is no breaking news right now',
}

export const categorySettingsLabels = {
  header: 'Prioritize Categories',
  myCategories: 'My Categories',
  allCategories: 'All Categories',
  dragAndDrop: 'Drag and drop to rearrange',
}

export const errorBoundaryLabels = {
  error: 'Something went wrong',
  retry: 'Retry',
}

export const favoritesSettingsLabels = {
  header: 'Favorites',
}

export const homeLabels = {
  headlines: 'Headlines',
  search: 'Search',
}

export const liveStreamLabels = {
  header: 'Live Stream',
  notifyMe: 'Notify Me',
}

const hilight: React.CSSProperties = {
  color: '#0162B1',
}

export const mediaPlayerLabels = {
  empty: (
    <div>
      This is where <span style={hilight}>media</span> will be played
    </div>
  ),
}

export const mediaSettingsLabels = {
  header: 'Media Settings',
  normalSpeed: 'Normal',
  halfAgainSpeed: '1.5x',
  doubleSpeed: '2x',
  chooseSpeed: 'Playback Speed',
}

export const notificationSettingsLabels = {
  header: 'Notifications',
  dailyToggle: 'Daily Reminder',
}

export const pullToRefreshLabels = {
  pull: 'Pull',
  release: 'Refresh',
}

export const searchLabels = {
  header: 'Search',
  back: 'Back',
  all: 'All',
  query: 'Search',
  empty: 'No results',
}

export const settingsLabels = {
  header: 'Settings',
  panic: 'Clear everything!',
}
