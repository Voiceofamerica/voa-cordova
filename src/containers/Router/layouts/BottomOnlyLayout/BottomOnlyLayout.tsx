
import * as React from 'react'
import { Route, RouteProps } from 'react-router'

import ErrorBoundary from 'components/ErrorBoundary'
import DefaultBottomNav from 'containers/DefaultBottomNav'

type Props = RouteProps

function BottomOnlyLayout ({ component: Component, ...rest }: Props) {
  return (
    <Route {...rest} render={props => {
      return (
        <div>
          <ErrorBoundary>
            <Component {...props as any} />
          </ErrorBoundary>

          <DefaultBottomNav history={props.history} />
        </div>
      )
    }} />
  )
}

export default BottomOnlyLayout
