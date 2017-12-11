
import * as React from 'react'
import { Route, RouteProps } from 'react-router'
import { connect } from 'react-redux'

import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import AppState from 'types/AppState'
import Category from 'types/Category'

interface StateProps {
  categories: Category[]
}

type Props = StateProps & RouteProps

function MainLayout ({ component: Component, categories, ...rest }: Props) {
  return (
    <Route {...rest} render={props => {
      return (
        <div>
          <TopNav>
            <TopNavItem selected>
              要闻
            </TopNavItem>
            {
              categories.map((category, index) => (
                <TopNavItem key={category.id}>
                  { category.name }
                </TopNavItem>
              ))
            }
          </TopNav>

          <Component {...props as any} />

          <BottomNav>
            <IconItem active>
              <i className='mdi mdi-home-outline' />
            </IconItem>
            <IconItem>
              <i className='mdi mdi-flash-outline' />
            </IconItem>
            <RoundItem>
              <i className='mdi mdi-play-circle-outline' />
            </RoundItem>
            <IconItem>
              <i className='mdi mdi-radio-tower' />
            </IconItem>
            <IconItem onClick={() => this.goToSettings()}>
              <i className='mdi mdi-account-outline' />
            </IconItem>
          </BottomNav>
        </div>
      )
    }} />
  )
}

const mapStateToProps = ({ settings: { categories } }: AppState, ownProps: RouteProps): StateProps => ({
  categories,
})

const withRedux = connect(
  mapStateToProps,
)

export default withRedux(MainLayout)
