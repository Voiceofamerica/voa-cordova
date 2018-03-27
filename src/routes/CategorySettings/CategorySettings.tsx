
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { graphql, ChildProps, compose } from 'react-apollo'
import { connect, Dispatch } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import TouchBackend from 'react-dnd-touch-backend'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'
import SvgIcon from '@voiceofamerica/voa-shared/components/SvgIcon'

import setCategoryOrder from 'redux-store/actions/setCategoryOrder'
import AppState from 'types/AppState'
import Category from 'types/Category'

import * as Query from './CategorySettings.graphql'
import { CategorySettingsQuery } from 'helpers/graphql-types'
import Loader from 'components/Loader'
import { categorySettingsLabels, homeLabels } from 'labels'

import { categorySettings, pill, pillOuter, pillContainer, bottomNav, icon, headlinesSubtitle, sectionHeader, sectionName, sectionSubtitle } from './CategorySettings.scss'

import CategoryPill, { PillItem , DRAG_DELAY } from './CategoryPill'

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
  hoverOverChosen = (chosenItem: PillItem, at: PillItem) => {
    const { categories } = this.props
    if (categories.find(c => c.id === chosenItem.id)) {
      this.moveCard(at, chosenItem)
    } else {
      this.insertCard(at, chosenItem)
    }
  }

  hoverOverUnchosen = (chosenItem: PillItem) => {
    const { categories } = this.props
    if (categories.find(c => c.id === chosenItem.id)) {
      this.removeCard(chosenItem)
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

  removeCard (chosenItem: PillItem) {
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
        <div key={'separator'} className={sectionHeader}>
          <div className={sectionName}>{categorySettingsLabels.allCategories}</div>
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
        <Loader data={data}>
          <div className={pillContainer}>
            <div className={pillOuter}>
              <div className={pill}>{homeLabels.headlines}</div>
            </div>
            <div className={headlinesSubtitle}>
              <div>{categorySettingsLabels.headlinesFirst}</div>
            </div>
            <div className={sectionHeader}>
              <div className={sectionName}>{categorySettingsLabels.myCategories}</div>
              <div className={sectionSubtitle}>{categorySettingsLabels.dragAndDrop}</div>
            </div>
            {
              allCategoriesWithSeparator.map(this.renderCategory)
            }
          </div>
        </Loader>
        <BottomNav className={bottomNav}>
          <IconItem onClick={() => history.goBack()}>
            <SvgIcon src={require('svg/back.svg')} className={icon} />
          </IconItem>
        </BottomNav>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  categories: state.settings.categories,
})

const mapDispatchToProps = (dispatch: Dispatch<any>): DispatchProps => ({
  changeOrder: (categories: Category[]) => dispatch(setCategoryOrder({ categories })),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(Query),
  DragDropContext(TouchBackend({
    delayTouchStart: DRAG_DELAY,
  })),
)(CategorySettingsBase)
