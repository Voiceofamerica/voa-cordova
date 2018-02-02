
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { connect, Dispatch } from 'react-redux'

import BottomNav, { IconItem } from '@voiceofamerica/voa-shared/components/BottomNav'

import setTextSize from 'redux-store/actions/setTextSize'
import AppState from 'types/AppState'
import { textSettingsLabels } from 'labels'

import { textSettings, buttons, settingsButton, items, item, active } from './TextSettings.scss'

const data = {
  speed: [
    {
      description: textSettingsLabels.normalSize,
      value: 1,
    },
    {
      description: textSettingsLabels.largeSize,
      value: 1.5,
    },
    {
      description: textSettingsLabels.hugeSize,
      value: 2,
    },
  ],
}

interface StateProps {
  textSize: number
}

interface DispatchProps {
  setTextSize: (size: number) => void
}

type OwnProps = RouteComponentProps<void>

type Props = OwnProps & StateProps & DispatchProps

class TextSettingsBase extends React.Component<Props> {
  render () {
    const { history, textSize, setTextSize } = this.props

    return (
      <div className={textSettings}>
        <div className={buttons}>
          <div className={settingsButton}>
            {textSettingsLabels.chooseSize}
            <div className={items}>
              {
                data.speed.map(size => (
                  <div
                    key={size.value}
                    className={`${item} ${size.value === textSize ? active : ''}`}
                    onClick={() => setTextSize(size.value)}
                  >{size.description}</div>
                ))
              }
            </div>
          </div>
        </div>
        <BottomNav>
          <IconItem onClick={() => history.goBack()}>
            <i className={`mdi mdi-arrow-left`} />
          </IconItem>
        </BottomNav>
      </div>
    )
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  textSize: state.settings.textSize,
})

const mapDispatchToProps = (dispatch: Dispatch<AppState>): DispatchProps => ({
  setTextSize: (textSize: number) =>
    dispatch(setTextSize({ textSize })),
})

export default connect(mapStateToProps, mapDispatchToProps)(TextSettingsBase)
