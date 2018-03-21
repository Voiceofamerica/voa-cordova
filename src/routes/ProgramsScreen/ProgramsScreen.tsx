
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import analytics, { AnalyticsProps } from 'helpers/analytics'
import ErrorBoundary from 'components/ErrorBoundary'
import Category from 'types/Category'
import { programsScreenLabels } from 'labels'

import Params from './Params'
import ClipPrograms from './ClipPrograms'
import VideoPrograms from './VideoPrograms'
import { programsScreen, programTypeNav, typeItem, active } from './ProgramsScreen.scss'

type ProgramType = 'clip' | 'gallery' | 'video'

const CLIP: ProgramType = 'clip'
// const GALLERY: ProgramType = 'gallery'
const VIDEO: ProgramType = 'video'

const PROGRAM_ZONES: Category[] = [
  {
    id: 0,
    name: programsScreenLabels.all,
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
    if (type === CLIP) {
      return <ClipPrograms history={history} />
    } else if (type === VIDEO) {
      return <VideoPrograms history={history} match={match} />
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
        {
        // <div className={type === CLIP ? `${typeItem} ${active}` : typeItem} onClick={() => this.setProgramType(CLIP)}>
        //   {programsScreenLabels.audio}
        // </div>
        }
      </div>
    )
  }

  renderTopNav () {
    const { zone } = this.props.match.params

    return (
      <TopNav>
        {
          PROGRAM_ZONES.map(({ id, name }, idx) => {
            const selected = zone ? parseInt(zone, 10) === id : idx === 0

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
    )
  }

  render () {
    return (
      <div className={programsScreen}>
        {this.renderTopNav()}
        <ErrorBoundary>
          {this.renderPrograms()}
        </ErrorBoundary>
      </div>
    )
  }
}

const withAnalytics = analytics<Props>({
  state: 'Programs',
  title: 'Programs',
})

export default withAnalytics(ProgramsScreen)
