
import * as React from 'react'
import { QueryProps } from 'react-apollo'

import Spinner from '@voiceofamerica/voa-shared/components/Spinner'
import ResilientImage from '@voiceofamerica/voa-shared/components/ResilientImage'

import { loader, spinner, backdrop, fader, reloadButton } from './Loader.scss'

interface Props extends React.Props<HTMLDivElement> {
  data: QueryProps
  hasContent?: boolean
  className?: string
  style?: React.CSSProperties
}

export default ({ data, children, className = '', style, hasContent = false }: Props) => {
  const { loading, error, refetch } = data

  const fullClassName = `${loader} ${className}`

  if (error && !hasContent) {
    return (
      <div className={fullClassName} style={style}>
        发生错误
        <button className={reloadButton} onClick={() => data.refetch()}>刷新</button>
      </div>
    )
  } else if (loading && !hasContent) {
    return (
      <div className={fullClassName} style={style}>
        <ResilientImage className={backdrop} src={require('res/images/Default.png')}>
          <div className={fader} />
        </ResilientImage>
        <Spinner style={{ height: '20vw', width: '20vw' }} />
      </div>
    )
  } else {
    return children as JSX.Element
  }
}
