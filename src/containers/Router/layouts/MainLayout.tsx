
import * as React from 'react'
import { Route, RouteProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import TopNav, { TopNavItem } from '@voiceofamerica/voa-shared/components/TopNav'

import toggleMediaDrawer from 'redux-store/actions/toggleMediaDrawer'

import AppState from 'types/AppState'
import Category from 'types/Category'

import { centerIcon, iconText } from './MainLayout.scss'

interface StateProps {
  categories: Category[]
}

interface DispatchProps {
  toggleMediaPlayer: () => void
}

type Props = StateProps & RouteProps & DispatchProps

function MainLayout ({ component: Component, categories, toggleMediaPlayer, ...rest }: Props) {
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

      return (
        <div>
          <TopNav>
            <TopNavItem selected={isHeadlines} onClick={() => replace('/')}>
              要闻
            </TopNavItem>
            {
              categories.map((category, index) => (
                <TopNavItem key={category.id} selected={categoryId === category.id} onClick={() => replace(`/articles/${category.id}`)}>
                  { category.name }
                </TopNavItem>
              ))
            }
          </TopNav>

          <Component {...props as any} />

          <BottomNav>
            <IconItem active>
              <i className='mdi mdi-home-outline' />
              <div className={iconText}>首页</div>
            </IconItem>
            <IconItem>
              <i className='mdi mdi-flash-outline' />
              <div className={iconText}>突发新闻</div>
            </IconItem>
            <RoundItem onClick={() => toggleMediaPlayer()}>
              <i className={`mdi mdi-play-circle-outline ${centerIcon}`} />
              <div className={iconText}>多媒体</div>
            </RoundItem>
            <IconItem>
              <i className='mdi mdi-radio-tower' />
              <div className={iconText}>直播</div>
            </IconItem>
            <IconItem onClick={() => goTo('/settings')}>
              <i className='mdi mdi-account-outline' />
              <div className={iconText}>我的</div>
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

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  toggleMediaPlayer: () => dispatch(toggleMediaDrawer({})),
})

const withRedux = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default withRedux(MainLayout)
