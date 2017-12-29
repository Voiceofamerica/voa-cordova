
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, compose } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import setCategoryOrder from 'redux-store/actions/setCategoryOrder'
import AppState from 'types/AppState'
import Category from 'types/Category'

import * as Query from './CategorySettings.graphql'
import { CategorySettingsQuery } from 'helpers/graphql-types'
import Loader from 'components/Loader'

import { categorySettings, pillContainer, topNav } from './CategorySettings.scss'

import CategoryPill, { PillItem } from './CategoryPill'

const CATEGORY = 'CATEGORY'

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

class CategorySettingsBase extends React.Component<Props, LocalState> {
  hoverOverChosen = (at: PillItem, chosenItem: PillItem) => {
    const { categories } = this.props
    if (categories.find(c => c.id === chosenItem.id)) {
      this.moveCard(at, chosenItem)
    } else {
      this.insertCard(at, chosenItem)
    }
  }

  hoverOverUnchosen = (at: PillItem, chosenItem: PillItem) => {
    const { categories } = this.props
    if (categories.find(c => c.id === chosenItem.id)) {
      this.removeCard(at, chosenItem)
    }
  }

  moveCard (at: PillItem, chosenItem: PillItem) {
    const { categories, changeOrder } = this.props

    const chosenCategory = categories.find(c => c.id === chosenItem.id)

    const removed = categories.filter(c => c.id !== chosenItem.id)

    const moved = [
      ...removed.slice(0, at.index),
      chosenCategory,
      ...removed.slice(at.index),
    ]

    changeOrder(moved)
  }

  removeCard (at: PillItem, chosenItem: PillItem) {
    const { categories, changeOrder } = this.props

    const removed = categories.filter(c => c.id !== chosenItem.id)

    changeOrder(removed)
  }

  insertCard (at: PillItem, chosenItem: PillItem) {
    const { data: { zones = [] }, categories, changeOrder } = this.props

    const chosenCategory = zones.find(z => z.id === chosenItem.id)

    const inserted = [
      ...categories.slice(0, at.index),
      chosenCategory,
      ...categories.slice(at.index),
    ]

    changeOrder(inserted)
  }

  renderCategory = ({ id, name, chosen, separator }: Category & { chosen: boolean, separator: boolean }, index: number) => {
    if (separator) {
      return (
        <div key={'separator'} style={{ gridColumnStart: 1, gridColumnEnd: 3, fontWeight: 'bold', fontSize: '1.5em', marginLeft: 5, marginRight: 5 }}>
          所有分类
          <span style={{ float: 'right', fontSize: '0.8em', fontWeight: 'normal' }}>长按拖动调整分类</span>
        </div>
      )
    } else {
      const dragHandler = chosen ? this.hoverOverChosen : this.hoverOverUnchosen

      return (
        <CategoryPill itemId={id} key={id} index={index} cardType={CATEGORY} draggedOver={dragHandler}>
          {name}
        </CategoryPill>
      )
    }
  }

  render () {
    const { data, categories, history } = this.props
    const { zones = [] } = data

    const unchosenCategories = zones
      .filter(zone => categories.findIndex(category => category.id === zone.id) < 0)
      .sort((z1, z2) => z1.name > z2.name ? 1 : z1.name === z2.name ? 0 : -1)

    const chosenCategoriesWithChosen = categories.map(c => ({ ...c, chosen: true, separator: false }))
    const unchosenCategoriesWithChosen = unchosenCategories.map(c => ({ ...c, chosen: false, separator: false }))

    const allCategoriesWithSeparator = chosenCategoriesWithChosen
      .concat([{ id: -1, name: '', chosen: false, separator: true }])
      .concat(unchosenCategoriesWithChosen)

    return (
      <div className={categorySettings}>
        <div className={topNav}>新闻分类排序</div>
        <Loader data={data}>
          <div className={pillContainer}>
            <div style={{ fontWeight: 'bold', gridColumnStart: 1, gridColumnEnd: 3, fontSize: '1.5em', marginLeft: 5, marginRight: 5 }}>
              我的分类
            </div>
            {
              allCategoriesWithSeparator.map(this.renderCategory)
            }
          </div>
        </Loader>
        <BottomNav>
          <IconItem onClick={() => history.goBack()}>
            <i className={`mdi mdi-arrow-left`} />
          </IconItem>
        </BottomNav>
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
    delayTouchStart: 250,
  })),
)(CategorySettingsBase)
