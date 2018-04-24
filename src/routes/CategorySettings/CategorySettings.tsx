
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
import { CategorySettingsQuery, CategorySettingsQueryVariables } from 'helpers/graphql-types'
import Loader from 'components/Loader'
import { graphqlAudience, categorySettingsLabels, homeLabels } from 'labels'

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
  unChosenCategories: Category[]
  chosenCategories: Category[]
}

function categoriesDiffer (first: Category[], second: Category[]) {
  return first !== second
}

class CategorySettingsBase extends React.Component<Props, LocalState> {
  state: LocalState = {
    draggingIndex: -1,
    unChosenCategories: [],
    chosenCategories: this.props.categories,
  }

  componentDidMount () {
    this.setState({ unChosenCategories: this.filterCategories(this.props.categories, this.props.data.zones) })
  }

  componentWillReceiveProps (nextProps: Props) {
    if (categoriesDiffer(this.props.data.zones, nextProps.data.zones)) {
      this.setState({ unChosenCategories: this.filterCategories(nextProps.categories, nextProps.data.zones) })
    }
    this.setState({ chosenCategories: nextProps.categories })
  }

  filterCategories (chosenCategories: Category[], allCategories: Category[] = []) {
    return allCategories
      .filter(zone => chosenCategories.findIndex(category => category.id === zone.id) < 0)
  }

  hoverOverChosen = (chosenItem: PillItem, at: PillItem) => {
    const { chosenCategories } = this.state
    if (chosenCategories.find(c => c.id === chosenItem.id)) {
      this.moveChosenCard(at, chosenItem)
    } else {
      this.insertChosenCard(at, chosenItem)
    }
  }

  hoverOverUnchosen = (chosenItem: PillItem, at: PillItem) => {
    const { chosenCategories } = this.state
    if (chosenCategories.find(c => c.id === chosenItem.id)) {
      this.removeChosenCard(at, chosenItem)
    }
    this.moveUnchosenCard(at, chosenItem)
  }

  moveChosenCard (at: PillItem, chosenItem: PillItem) {
    const { chosenCategories } = this.state
    const { data: { zones = [] }, changeOrder } = this.props

    const chosenCategory = zones.find(c => c.id === chosenItem.id)

    const removed = chosenCategories.filter(c => c.id !== chosenItem.id)

    const moved = [
      ...removed.slice(0, at.index),
      chosenCategory,
      ...removed.slice(at.index),
    ]

    changeOrder(moved)
  }

  insertChosenCard (at: PillItem, chosenItem: PillItem) {
    const { chosenCategories, unChosenCategories } = this.state
    const { data: { zones = [] }, changeOrder } = this.props

    const chosenCategory = zones.find(z => z.id === chosenItem.id)

    const inserted = [
      ...chosenCategories.slice(0, at.index),
      chosenCategory,
      ...chosenCategories.slice(at.index),
    ]

    this.setState({ unChosenCategories: unChosenCategories.filter(z => z.id !== chosenItem.id), chosenCategories: inserted })
    changeOrder(inserted)
  }

  removeChosenCard (at: PillItem, chosenItem: PillItem) {
    const { chosenCategories, unChosenCategories } = this.state
    const { data: { zones = [] }, changeOrder } = this.props

    const chosenCategory = zones.find(c => c.id === chosenItem.id)
    const removed = chosenCategories.filter(c => c.id !== chosenItem.id)

    const inserted = [
      ...unChosenCategories.slice(0, at.index),
      chosenCategory,
      ...unChosenCategories.slice(at.index),
    ]

    this.setState({ chosenCategories: removed, unChosenCategories: inserted })
    changeOrder(removed)
  }

  moveUnchosenCard (at: PillItem, chosenItem: PillItem) {
    const { chosenCategories } = this.state
    const { data: { zones = [] } } = this.props
    const { unChosenCategories } = this.state

    const chosenCategory = zones.find(c => c.id === chosenItem.id)

    const removed = unChosenCategories.filter(c => c.id !== chosenItem.id)
    const index = at.index - (chosenCategories.length + 1)

    const moved = [
      ...removed.slice(0, index),
      chosenCategory,
      ...removed.slice(index),
    ]

    this.setState({ unChosenCategories: moved })
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
    const { unChosenCategories, chosenCategories } = this.state
    const { data, history } = this.props

    const chosenCategoriesWithFlags = chosenCategories.map(c => ({ ...c, chosen: true, separator: false }))
    const unchosenCategoriesWithFlags = unChosenCategories.map(c => ({ ...c, chosen: false, separator: false }))

    const allCategoriesWithSeparator = chosenCategoriesWithFlags
      .concat([{ id: -1, name: '', chosen: false, separator: true }])
      .concat(unchosenCategoriesWithFlags)

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

const withQuery = graphql(
  Query,
  {
    options: {
      variables: {
        source: graphqlAudience,
      } as CategorySettingsQueryVariables,
    },
    props: ({ data }) => {
      let outputData = data as (typeof data) & CategorySettingsQuery
      if (!data.loading && !data.error) {
        outputData.zones = outputData.zones || []
      }

      return { data: outputData }
    },
  },
)

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withQuery,
  DragDropContext(TouchBackend({
    delayTouchStart: DRAG_DELAY,
  })),
)(CategorySettingsBase)
