
import * as React from 'react'
import { QueryProps } from 'react-apollo'
import Refresher from 'react-refresher'

import Spinner from '@voiceofamerica/voa-shared/components/Spinner'

import { pullIcon, upsideDown } from './PullToRefresh.scss'

interface Props {
  data: QueryProps
}

export default class PullToRefresh extends React.Component<Props> {
  render () {
    const { data, children } = this.props

    return (
      <Refresher
        onRefresh={data.refetch}
        spinner={<Spinner style={{ height: 30 }} />}
        refreshColor='#0162B1'
        downArrow={<div><i className={`mdi mdi-arrow-down ${pullIcon}`} /> Pull</div>}
        upArrow={<div><i className={`mdi mdi-arrow-down ${pullIcon} ${upsideDown}`} /> Pull</div>}
        successIcon={<i className='mdi mdi-check' />}
        errorIcon={<i className='mdi mdi-close' />}
      >
        {children}
      </Refresher>
    )
  }
}
