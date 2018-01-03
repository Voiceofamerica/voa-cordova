
import * as React from 'react'
import { Route, RouteProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import TopNav, { CenterText } from '@voiceofamerica/voa-shared/components/TopNav'

import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'
import DefaultBottomNav from 'containers/DefaultBottomNav'

import AppState from 'types/AppState'

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
