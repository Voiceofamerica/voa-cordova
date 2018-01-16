
import * as React from 'react'
import { Route, RouteProps } from 'react-router'

import TopNav, { CenterText } from '@voiceofamerica/voa-shared/components/TopNav'

import { headingOnlyLayout, content } from './HeadingOnlyLayout.scss'

interface Props extends RouteProps {
  heading: string
}

function MainLayout ({ component: Component, heading, ...rest }: Props) {
  return (
    <Route {...rest} render={props => {
      return (
        <div className={headingOnlyLayout}>
          <TopNav>
            <CenterText>
              {heading}
            </CenterText>
          </TopNav>

          <div className={content}>
            <Component {...props as any} />
          </div>
        </div>
      )
    }} />
  )
}

export default MainLayout
