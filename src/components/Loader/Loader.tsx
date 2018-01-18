
import * as React from 'react'
import { QueryProps } from 'react-apollo'

import Loader from '@voiceofamerica/voa-shared/components/Loader'

import { errorBoundaryLabels } from 'labels'

interface Props extends React.Props<HTMLDivElement> {
  data: QueryProps
  hasContent?: boolean
  className?: string
  style?: React.CSSProperties
}

export default ({ data, children, className, style, hasContent }: Props) => {
  const { loading, error, refetch } = data
  return (
    <Loader
      loading={loading}
      error={error}
      refetch={refetch}
      className={className}
      style={style}
      hasContent={hasContent}
      errorText={errorBoundaryLabels.error}
      retryText={errorBoundaryLabels.retry}
      backgroundImage={require('res/images/Default.png')}
    >
      {children}
    </Loader>
  )
}
