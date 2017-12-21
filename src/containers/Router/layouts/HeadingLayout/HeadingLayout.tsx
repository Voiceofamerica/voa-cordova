
import * as React from 'react'
import { Route, RouteProps, RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { CenterText } from '@voiceofamerica/voa-shared/components/TopNav'

import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import DefaultBottomNav from 'containers/DefaultBottomNav'

import AppState from 'types/AppState'
import Category from 'types/Category'

import { WithHeading } from './types'
import { centerIcon, iconText } from './HeadingLayout.scss'

interface OwnProps extends RouteProps {
  heading: string
}

interface StateProps {
}

interface DispatchProps {
  toggleMediaPlayer: () => void
}

type Props = StateProps & OwnProps & DispatchProps

function MainLayout ({ component: Component, heading, toggleMediaPlayer, ...rest }: Props) {
  return (
    <Route {...rest} render={props => {
      function replace (route: string) {
        props.history.replace(route)
      }

      function goTo (route: string) {
        props.history.push(route)
      }

      const { category: categoryIdStr } = props.match.params
      const isHeadlines = categoryIdStr === null || categoryIdStr === undefined
      const categoryId = isHeadlines ? 1 : parseInt(categoryIdStr, 10)

      const liveStreamActive = props.history.location.pathname.indexOf('liveStream') >= 0
      const homeActive = !liveStreamActive

      return (
        <div>
          <TopNav>
            <CenterText>
              {heading}
            </CenterText>
          </TopNav>

          <Component {...props as any} />

          <DefaultBottomNav history={props.history} />
        </div>
      )
    }} />
  )
}

const mapStateToProps = ({ settings: { categories } }: AppState, ownProps: OwnProps): StateProps => ({
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  toggleMediaPlayer: () => dispatch(toggleMediaDrawer({})),
})

const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default withRedux(MainLayout)
