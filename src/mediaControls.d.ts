declare module MediaControls {
  interface MediaControls {
    /**
     * @description Creates the notification controls
     */
    create (options: CreateOptions, onSuccess: SuccessCallback, onError: ErrorCallback): void

    /**
     * @description Destroys the notification controls
     */
    destroy (onSuccess: SuccessCallback, onError: ErrorCallback)

    /**
     * @description Registers an event listener (only supports one listener). NOTE: this does *NOT* start listening for events!
     */
    subscribe (listener: (ev: string) => void): void

    /**
     * @description Starts listening for events on all subscribed listeners
     */
    listen (): void

    /**
     * @description Updates the controls to correctly display play/pause
     */
    updateIsPlaying (playing: boolean, onSuccess: SuccessCallback, onError: ErrorCallback): void

    /**
     * @description Updates whether or not the controls can be dismissed
     */
    updateDismissable (dismissable: boolean, onSuccess: SuccessCallback, onError: ErrorCallback): void
  }

  interface CreateOptions {
    /** @default: '' */
    track?: string
    /** @default: '' */
    artist?: string
    /** @default: '' */
    cover?: string
    /** @default: true */
    isPlaying?: boolean
    /** @default: false */
    dismissable?: boolean
    /** @default: true */
    hasPrev?: boolean
    /** @default: true */
    hasNext?: boolean
    /** @default: false */
    hasClose?: boolean
  }

  type SubscribeEvents =
    'music-controls-next' |
    'music-controls-previous' |
    'music-controls-pause' |
    'music-controls-play' |
    'music-controls-destroy' |
    /** iOS only */
    'music-controls-toggle-play-pause' |
    'music-controls-seek-to' |
    /** Android only */
    'music-controls-media-button' |
    'music-controls-headset-unplugged' |
    'music-controls-headset-plugged'

  interface SuccessCallback {
    (): void
  }

  interface ErrorCallback {
    (error: any): void
  }
}
declare module 'cordova-plugin-music-controls/www/MusicControls' {
  const controls: MediaControls.MediaControls
  export = controls
}
