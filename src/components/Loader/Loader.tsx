
import * as React from 'react'
import { QueryProps } from 'react-apollo'
import Spinner from '@voiceofamerica/voa-shared/components/Spinner'

import { loader, spinner } from './Loader.scss'

interface Props extends React.Props<HTMLDivElement> {
  data: QueryProps
  className?: string
  style?: React.CSSProperties
}

export default ({ data, children, className = '', style }: Props) => {
  const { loading, error, refetch } = data

  const fullClassName = `${loader} ${className}`

  if (error) {
    return (
      <div className={fullClassName} style={style}>
        发生错误
      </div>
    )
  } else if (loading) {
    return (
      <div className={fullClassName} style={style}>
        <Spinner style={{ height: '20vw', width: '20vw' }} />
      </div>
    )
  } else {
    return children as JSX.Element
  }
}
