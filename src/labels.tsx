
import * as React from 'react'
import { push } from 'react-router-redux'
import store from 'redux-store'

export const graphqlLanguage = 'zhcn'

export const momentLocale = 'zh-cn'

export const articleLabels = {
  updatedOn: (date: string) => `${date}更新`,
  relatedContent: '相关内容',
  shareMessage: '',
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
  headlinesFirst: '最新要闻列在首位',
}

export const circumventionDrawerLabels = {
  enabledContent: (
    <div>
      <p>
        安全访问已启动
      </p>
      <p>
        <a href='#' onClick={() => store.dispatch(push('/settings'))}>设置</a>
      </p>
    </div>
  ),
  disabledContent: (
    <div>
      <p>
        安全访问停止
      </p>
      <p>
        <a href='#' onClick={() => store.dispatch(push('/settings'))}>设置</a>
      </p>
    </div>
  ),
}

export const editorsChoiceLabels = {
  header: '编辑推荐',
}

export const errorBoundaryLabels = {
  error: '发生错误',
  retry: '重试',
}

export const favoritesSettingsLabels = {
  header: '收藏夹',
  removeAll: '删除所有',
}

export const homeLabels = {
  headlines: '要闻',
  search: '搜索',
  manage: '+',
}

export const introLabels = {
  heading: 'Welcome to VoA!',
  content: '您好',
  continue: '继续',
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
  loading: '加载视频',
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

export const programsScreenLabels = {
  videos: '视频',
  audio: '音频',
  all: '卫视',
  empty: '什么都没有',
}

export const pullToRefreshLabels = {
  pull: '释放刷新',
  release: '释放刷新',
}

export const searchLabels = {
  header: '搜索',
  back: '取消',
  all: '全部',
  query: '搜索',
  empty: '没有',
}

export const settingsLabels = {
  header: '我的设置',
  panic: '马上删除此程序',
  sendToFriends: '推荐给朋友',
  sendFeedback: '发送反馈',
  aboutVoa: '美国之音(VOA)向国际受众发送准确、平衡和全面的新闻与信息。美国之音创建于1942年，用电台向封闭和被战火蹂躏的地区播送新闻。目前美国之音已发展成为一个多媒体新闻部门，通过网络、移动设备和社交媒体，以40多种语言为人们服务。',
  feedbackEmail: 'zhapp@voanews.com',
  feedbackSubject: encodeURIComponent('美国之音'),
  feedbackBody: encodeURIComponent(''),
  shareMessage: '',
  psiphon: '禁用安全访问',
  psiphonOn: '打开',
  psiphonOff: '关掉',
}

export const textSettingsLabels = {
  header: '设置字体大小',
  normalSize: '1x',
  largeSize: '1.5x',
  hugeSize: '2x',
}
