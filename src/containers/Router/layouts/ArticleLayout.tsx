
import * as React from 'react'
import { Route, RouteProps } from 'react-router'

export default function MainLayout<T> ({ component: Component, ...rest }: RouteProps) {
  return (
    <Route {...rest} render={props => {
      return (
        <div>
          <Component {...props as any} />
        </div>
      )
    }} />
  )
}
