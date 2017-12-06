
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, compose } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

import { ready } from '@voiceofamerica/voa-shared/helpers/startup'
import Card from '@voiceofamerica/voa-shared/components/Card'
import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import BottomNav, { IconItem, RoundItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import setCategoryOrder from 'redux-store/actions/setCategoryOrder'
import AppState from 'types/AppState'
import Category from 'types/Category'

import * as Query from './CategorySettings.graphql'
import { CategorySettingsQuery } from 'helpers/graphql-types'

import { categorySettings, pillContainer } from './CategorySettings.scss'

import CategoryPill from './CategoryPill'

type OwnProps = RouteComponentProps<void>

interface StateProps {
  categories: Category[]
}

interface DispatchProps {
  changeOrder: (categories: Category[]) => void
}

type Props = ChildProps<OwnProps & StateProps & DispatchProps, CategorySettingsQuery>

interface LocalState {
  draggingIndex: number
}

interface SortableUpdate<T> {
  draggingIndex: number
  items?: T[]
}

class CategorySettingsBase extends React.Component<Props> {
  render () {
    const { data, categories } = this.props
    const { zones = [] } = data

    const unchosenCategories = zones
      .filter(zone => categories.findIndex(category => category.id === zone.id) < 0)
      .sort((z1, z2) => z1.name > z2.name ? 1 : z1.name === z2.name ? 0 : -1)

    return (
      <div className={categorySettings}>
        <div className={pillContainer}>
          {
            unchosenCategories.map(({ id, name }, index) => (
              <CategoryPill itemId={id} key={id} index={index} cardType={'CATEGORY'} draggedOver={() => null}>
                {name}
              </CategoryPill>
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  categories: state.settings.categories,
})

const mapDispatchToProps = (dispatch: Dispatch<any>, own): DispatchProps => ({
  changeOrder: (categories: Category[]) => dispatch(setCategoryOrder({ categories })),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(Query),
  DragDropContext(TouchBackend({
    delayTouchStart: 300,
  })),
)(CategorySettingsBase)
