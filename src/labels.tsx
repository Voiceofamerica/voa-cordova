
import * as React from 'react'

export const graphqlLanguage = 'zhcn'

export const momentLocale = 'zh-cn'

export const articleLabels = {
  updatedOn: (date: string) => `${date}更新`,
  relatedContent: '相关内容',
}

export const bottomNavLabels = {
  home: '首页',
  breakingNews: '突发新闻',
  media: '多媒体',
  liveStream: '直播',
  settings: '我',
}

export const breakingNewsLabels = {
  header: '突发新闻',
  noNews: '目前没有重突发新闻',
}

export const categorySettingsLabels = {
  header: '新闻分类排序',
  myCategories: '我的分类',
  allCategories: '所有分类',
  dragAndDrop: '长按拖动调整分类',
}

export const errorBoundaryLabels = {
  error: '发生错误',
  retry: '重试',
}

export const favoritesSettingsLabels = {
  header: 'Favorites',
}

export const homeLabels = {
  headlines: '要闻',
  search: '搜索',
}

export const liveStreamLabels = {
  header: '直播时间表',
  notifyMe: 'Notify Me',
}

const hilight: React.CSSProperties = {
  color: '#0162B1',
}

export const mediaPlayerLabels = {
  empty: (
    <div>
      <p>
        这是美国之音的<span style={hilight}>多媒体</span>播放器。 当您选择一个伴随音频或视频的故事时，它在这里播放。
      </p>
      <p>
        您可以随时查看原始故事或查找新故事，而无需通过在此页面上向下滑动来停止音频或视频。
      </p>
      <p>
        通过从屏幕底部的圆形蓝色<span style={hilight}>多媒体</span>按钮向上滑动来再次打开此屏幕。
      </p>
      <p>
        通过点击<span style={hilight}>多媒体</span>按钮启动和停止音频或视频。
      </p>
    </div>
  ),
}

export const mediaSettingsLabels = {
  header: '视频设置',
  normalSpeed: '常速',
  halfAgainSpeed: '1.5倍速',
  doubleSpeed: '2倍速',
  chooseSpeed: '播放速度',
}

export const notificationSettingsLabels = {
  header: '通知',
  dailyToggle: '每日提醒',
}

export const pullToRefreshLabels = {
  pull: 'Pull',
  release: 'Refresh',
}

export const searchLabels = {
  header: '搜索结果',
  back: '取消',
  all: '全部',
  query: '搜索',
  empty: '没有',
}

export const settingsLabels = {
  header: '我的设置',
  panic: '马上删除此程序',
}
