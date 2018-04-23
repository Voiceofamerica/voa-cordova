
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import TopNav, { TopNavItem, StaticItem } from '@voiceofamerica/voa-shared/components/TopNav'
import ThemeProvider from '@voiceofamerica/voa-shared/components/ThemeProvider'

import analytics, { AnalyticsProps } from '@voiceofamerica/voa-shared/helpers/analyticsHelper'
import ErrorBoundary from 'components/ErrorBoundary'
import Category from 'types/Category'
import { programsScreenLabels } from 'labels'

import TopNavTheme from './TopNavTheme'
import Params from './Params'
import AudioPrograms from './AudioPrograms'
import VideoPrograms from './VideoPrograms'
import { programsScreen, programTypeNav, typeItem, active } from './ProgramsScreen.scss'

type ProgramType = 'audio' | 'video'

const AUDIO: ProgramType = 'audio'
const VIDEO: ProgramType = 'video'

const PROGRAM_ZONES: Category[] = [
  {
    id: 1927,
    name: '每日视频新闻',
  },
  {
    id: 1737,
    name: '学英语',
  },
  {
    id: 2542,
    name: 'VOA卫视完整版',
  },
  {
    id: 4982,
    name: '美国观察',
  },
  {
    id: 1904,
    name: '时事大家谈',
  },
  {
    id: 1905,
    name: '焦点对话',
  },
  {
    id: 5327,
    name: '周末专辑',
  },
  {
    id: 1906,
    name: '海峡论谈',
  },
  {
    id: 1903,
    name: 'VOA连线',
  },
  {
    id: 3690,
    name: '媒体观察',
  },
  {
    id: 2422,
    name: '时事看台',
  },
  {
    id: 5257,
    name: '专家视点',
  },
  {
    id: 1907,
    name: '美国万花筒',
  },
  {
    id: 2421,
    name: '走进美国',
  },
  {
    id: 5256,
    name: '鹰与盾：美国军事透视',
  },
  {
    id: 4495,
    name: '您的孩子在美国',
  },
  {
    id: 5295,
    name: '对话名校招生官',
  },
]

interface Props extends RouteComponentProps<Params>, AnalyticsProps {
}

class ProgramsScreen extends React.Component<Props> {
  setProgramType = (programType: ProgramType) => {
    const { history, match } = this.props
    const { zone } = match.params

    if (zone) {
      history.replace(`/programs/${programType}/${zone}`)
    } else {
      history.replace(`/programs/${programType}`)
    }
  }

  setZoneId = (zoneId: number) => {
    const { history, match } = this.props
    const { type = VIDEO } = match.params
    history.replace(`/programs/${type}/${zoneId}`)
  }

  renderPrograms () {
    const { history, match } = this.props
    const { type = VIDEO } = match.params
    const zoneId = this.getZoneId()

    if (type === AUDIO) {
      return <AudioPrograms history={history} zoneId={zoneId} />
    } else if (type === VIDEO) {
      return <VideoPrograms history={history} zoneId={zoneId} />
    } else {
      throw new Error(`Invalid programType ${type}`)
    }
  }

  renderProgramTypes () {
    const { type = VIDEO } = this.props.match.params

    return (
      <div className={programTypeNav}>
        <div className={type === VIDEO ? `${typeItem} ${active}` : typeItem} onClick={() => this.setProgramType(VIDEO)}>
          {programsScreenLabels.videos}
        </div>
        <div className={type === AUDIO ? `${typeItem} ${active}` : typeItem} onClick={() => this.setProgramType(AUDIO)}>
          {programsScreenLabels.audio}
        </div>
      </div>
    )
  }

  renderTopNav () {
    const selectedId = this.getZoneId()
    return (
      <ThemeProvider value={TopNavTheme}>
        <TopNav>
          <StaticItem />
          {
            PROGRAM_ZONES.map(({ id, name }, idx) => {
              const selected = selectedId === id

              return (
                <TopNavItem
                  key={id}
                  selected={selected}
                  onClick={() => this.setZoneId(id)}
                >
                  {name}
                </TopNavItem>
              )
            })
          }
          <TopNavItem />
        </TopNav>
      </ThemeProvider>
    )
  }

  render () {
    return (
      <div className={programsScreen}>
        {this.renderTopNav()}
        <ErrorBoundary>
          {this.renderPrograms()}
        </ErrorBoundary>
        {this.renderProgramTypes()}
      </div>
    )
  }

  private getZoneId = () => {
    const { zone = PROGRAM_ZONES[0].id } = this.props.match.params
    return typeof zone === 'number' ? zone : parseInt(zone, 10)
  }
}

const withAnalytics = analytics<Props>({
  state: 'Programs',
  title: 'Programs',
})

export default withAnalytics(ProgramsScreen)
