
import * as React from 'react'

import { psiphonIndicator } from './PsiphonIndicator.scss'

interface Props extends React.Props<HTMLImageElement> {
}

export default ({ ref }: Props) => {
  return (
    <img ref={ref} className={psiphonIndicator} src={require('./psiphon_on.png')} />
  )
}
