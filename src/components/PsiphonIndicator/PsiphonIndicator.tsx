
import * as React from 'react'
import { QueryProps } from 'react-apollo'

import { psiphonIndicator } from './PsiphonIndicator.scss'

interface Props extends React.Props<HTMLDivElement> {
}

export default (props: Props) => {
  return (
    <img className={psiphonIndicator} src={require('./psiphon_on.png')} />
  )
}
