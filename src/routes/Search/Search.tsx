
import * as React from 'react'
import * as moment from 'moment'
import { throttle } from 'lodash'
import { RouteComponentProps } from 'react-router'
import { connect } from 'react-redux'
import shallowCompare from 'shallow-compare'

import Ticket from '@voiceofamerica/voa-shared/components/Ticket'
import TopNav, { CenterText } from '@voiceofamerica/voa-shared/components/TopNav'
import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import AppState from 'types/AppState'
import Category from 'types/Category'

import { SearchQuery, SearchQueryVariables } from 'helpers/graphql-types'
import analytics, { AnalyticsProps } from 'helpers/analytics'
import * as Query from './Search.graphql'

import SearchArea from './SearchArea'

import { searchScreen, row, ticketIcon, inputs, inputsPill, backButton, dropdownPill, dropdown, dropdownArrow, searchInputContainer, searchInput, emptyText } from './Search.scss'

interface StateProps {
  categories: Category[]
}

type OwnProps = RouteComponentProps<{ query: string, zoneId: string }>

type Props = OwnProps & StateProps & AnalyticsProps

interface State {
  keyboardHeight: number
  debouncedQuery: string
}

const THROTTLE_TIMEOUT = 1000

class SearchBase extends React.Component<Props, State> {
  state: State = {
    keyboardHeight: 0,
    debouncedQuery: '',
  }

  private inputHeight: number = 0
  private timeout: any

  private setDebouncedQuery = throttle(
      (debouncedQuery: string) => {
        this.setState({ debouncedQuery })
      },
      THROTTLE_TIMEOUT,
    )

  componentDidMount () {
    window.addEventListener('native.keyboardshow', this.onKeyboard)
    window.addEventListener('native.keyboardhide', this.onKeyboardHide)
  }

  componentWillUnmount () {
    window.removeEventListener('native.keyboardshow', this.onKeyboard)
    window.removeEventListener('native.keyboardhide', this.onKeyboardHide)
  }

  componentWillReceiveProps (nextProps: Props) {
    if (!shallowCompare(this, nextProps, this.state)) {
      return false
    }

    const { query } = nextProps.match.params
    this.setDebouncedQuery(query)

    return true
  }

  onKeyboard = ({ keyboardHeight }: any) => {
    this.setState({ keyboardHeight: keyboardHeight + this.inputHeight })
  }

  onKeyboardHide = () => {
    this.setState({ keyboardHeight: 0 })
  }

  enterImmersive = () => {
    const afsm = (window as any).AndroidFullScreen
    afsm && afsm.immersiveMode()
  }

  leaveImmersive = () => {
    const afsm = (window as any).AndroidFullScreen
    afsm && afsm.showSystemUI()
  }

  replace = (route: string) => {
    const { history } = this.props
    history.replace(route)
  }

  goTo = (route: string) => {
    const { history } = this.props
    history.push(route)
  }

  setQuery = (query: string) => {
    const { zoneId = '0' } = this.props.match.params
    this.replace(`/search/${zoneId}/${query}`)
  }

  setZoneId = (zoneId: number) => {
    const { query = '' } = this.props.match.params
    this.replace(`/search/${zoneId}/${query}`)
  }

  renderInputs () {
    const { history, categories } = this.props
    const { query = '', zoneId = '0' } = this.props.match.params

    return (
      <div ref={el => this.inputHeight = el && el.clientHeight || 0 } className={inputs} style={{ bottom: this.state.keyboardHeight }}>
        <div onClick={() => history.goBack()} className={backButton}>取消</div>
        <div className={inputsPill}>
          <div className={dropdownPill}>
            <select value={parseInt(zoneId, 10)} className={dropdown} onChange={ev => this.setZoneId(parseInt(ev.currentTarget.value, 10))}>
              <option value={0}>全部</option>
              {
                categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              }
            </select>
            <span className={dropdownArrow}><i className='mdi mdi-chevron-down' /></span>
          </div>
          <div className={searchInputContainer}>
            <input autoFocus className={searchInput} value={query} onChange={ev => this.setQuery(ev.currentTarget.value)} />
            { query.length === 0 ? <div className={emptyText}>搜索</div> : null }
          </div>
        </div>
      </div>
    )
  }

  render () {
    const { zoneId = '0' } = this.props.match.params
    const { keyboardHeight, debouncedQuery = '' } = this.state

    const marginBottom = this.inputHeight + keyboardHeight

    return (
      <div className={searchScreen} style={{ marginBottom }}>
        <TopNav>
          <CenterText>
            搜索结果
          </CenterText>
        </TopNav>
        <SearchArea goTo={this.goTo} query={debouncedQuery} zoneId={parseInt(zoneId, 10)} />
        {this.renderInputs()}
      </div>
    )
  }
}

const withAnalytics = analytics<Props>({
  state: 'Search Results',
  title: 'Search Results',
})

const mapStateToProps = ({ settings: { categories } }: AppState, ownProps: OwnProps): StateProps => ({
  categories,
})

const withRedux = connect(mapStateToProps)

export default withRedux(SearchBase)
