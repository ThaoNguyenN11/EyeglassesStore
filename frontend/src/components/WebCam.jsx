import * as React from "react";

// polyfill based on https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
(function polyfillGetUserMedia() {
  if (typeof window === 'undefined') {
    return;
  }

  // Older browsers might not implement mediaDevices at all, so we set an empty object first
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }

  // Some browsers partially implement mediaDevices. We can't just assign an object
  // with getUserMedia as it would overwrite existing properties.
  // Here, we will just add the getUserMedia property if it's missing.
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      // First get ahold of the legacy getUserMedia, if present
      const getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

      // Some browsers just don't implement it - return a rejected promise with an error
      // to keep a consistent interface
      if (!getUserMedia) {
        return Promise.reject(
          new Error("getUserMedia is not implemented in this browser")
        );
      }

      // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    };
  }
})();

function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

export default class Webcam extends React.Component {
  static defaultProps = {
    audio: false,
    disablePictureInPicture: false,
    forceScreenshotSourceSize: false,
    imageSmoothing: true,
    mirrored: false,
    onUserMedia: () => undefined,
    onUserMediaError: () => undefined,
    screenshotFormat: "image/webp",
    screenshotQuality: 0.92,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasUserMedia: false
    };
    
    this.canvas = null;
    this.ctx = null;
    this.requestUserMediaId = 0;
    this.unmounted = false;
    this.stream = null;
    this.video = null;
  }

  componentDidMount() {
    const { state, props } = this;
    this.unmounted = false;

    if (!hasGetUserMedia()) {
      props.onUserMediaError("getUserMedia not supported");
      return;
    }

    if (!state.hasUserMedia) {
      this.requestUserMedia();
    }

    if (props.children && typeof props.children != 'function') {
      console.warn("children must be a function");
    }
  }

  componentDidUpdate(nextProps) {
    const { props } = this;

    if (!hasGetUserMedia()) {
      props.onUserMediaError("getUserMedia not supported");
      return;
    }

    const audioConstraintsChanged =
      JSON.stringify(nextProps.audioConstraints) !==
      JSON.stringify(props.audioConstraints);
    const videoConstraintsChanged =
      JSON.stringify(nextProps.videoConstraints) !==
      JSON.stringify(props.videoConstraints);
    const minScreenshotWidthChanged =
      nextProps.minScreenshotWidth !== props.minScreenshotWidth;
    const minScreenshotHeightChanged =
      nextProps.minScreenshotHeight !== props.minScreenshotHeight;
    if (
      videoConstraintsChanged ||
      minScreenshotWidthChanged ||
      minScreenshotHeightChanged
    ) {
      this.canvas = null;
      this.ctx = null;
    }
    if (audioConstraintsChanged || videoConstraintsChanged) {
      this.stopAndCleanup();
      this.requestUserMedia();
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.stopAndCleanup();
  }

  static stopMediaStream(stream) {
    if (stream) {
      if (stream.getVideoTracks && stream.getAudioTracks) {
        stream.getVideoTracks().map(track => {
          stream.removeTrack(track);
          track.stop();
        });
        stream.getAudioTracks().map(track => {
          stream.removeTrack(track);
          track.stop()
        });
      } else {
        stream.stop();
      }
    }
  }

  stopAndCleanup() {
    const { state } = this;

    if (state.hasUserMedia) {
      Webcam.stopMediaStream(this.stream);

      if (state.src) {
        window.URL.revokeObjectURL(state.src);
      }
    }
  }

  getScreenshot(screenshotDimensions) {
    const { state, props } = this;

    if (!state.hasUserMedia) return null;

    const canvas = this.getCanvas(screenshotDimensions);
    return (
      canvas &&
      canvas.toDataURL(props.screenshotFormat, props.screenshotQuality)
    );
  }

  getCanvas(screenshotDimensions) {
    const { state, props } = this;

    if (!this.video) {
      return null;
    }

    if (!state.hasUserMedia || !this.video.videoHeight) return null;

    if (!this.ctx) {
      let canvasWidth = this.video.videoWidth;
      let canvasHeight = this.video.videoHeight;
      if (!this.props.forceScreenshotSourceSize) {
        const aspectRatio = canvasWidth / canvasHeight;

        canvasWidth = props.minScreenshotWidth || this.video.clientWidth;
        canvasHeight = canvasWidth / aspectRatio;

        if (
          props.minScreenshotHeight &&
          canvasHeight < props.minScreenshotHeight
        ) {
          canvasHeight = props.minScreenshotHeight;
          canvasWidth = canvasHeight * aspectRatio;
        }
      }

      this.canvas = document.createElement("canvas");
      this.canvas.width = screenshotDimensions?.width || canvasWidth;
      this.canvas.height = screenshotDimensions?.height || canvasHeight;
      this.ctx = this.canvas.getContext("2d");
    }

    const { ctx, canvas } = this;

    if (ctx && canvas) {
      // adjust the height and width of the canvas to the given dimensions
      canvas.width = screenshotDimensions?.width || canvas.width;
      canvas.height = screenshotDimensions?.height || canvas.height;

      // mirror the screenshot
      if (props.mirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.imageSmoothingEnabled = props.imageSmoothing;
      ctx.drawImage(this.video, 0, 0, screenshotDimensions?.width || canvas.width, screenshotDimensions?.height || canvas.height);

      // invert mirroring
      if (props.mirrored) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
      }
    }

    return canvas;
  }

  requestUserMedia() {
    const { props } = this;

    const sourceSelected = (
      audioConstraints,
      videoConstraints
    ) => {
      const constraints = {
        video: typeof videoConstraints !== "undefined" ? videoConstraints : true
      };

      if (props.audio) {
        constraints.audio =
          typeof audioConstraints !== "undefined" ? audioConstraints : true;
      }

      this.requestUserMediaId++;
      const myRequestUserMediaId = this.requestUserMediaId;

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          if (this.unmounted || myRequestUserMediaId !== this.requestUserMediaId) {
            Webcam.stopMediaStream(stream);
          } else {
            this.handleUserMedia(null, stream);
          }
        })
        .catch(e => {
          this.handleUserMedia(e);
        });
    };

    if ("mediaDevices" in navigator) {
      sourceSelected(props.audioConstraints, props.videoConstraints);
    } else {
      const optionalSource = (id) => ({ optional: [{ sourceId: id }] });

      const constraintToSourceId = (constraint) => {
        if (!constraint) return null;
        
        const { deviceId } = constraint;

        if (typeof deviceId === "string") {
          return deviceId;
        }

        if (Array.isArray(deviceId) && deviceId.length > 0) {
          return deviceId[0];
        }

        if (typeof deviceId === "object" && deviceId.ideal) {
          return deviceId.ideal;
        }

        return null;
      };

      // MediaStreamTrack.getSources is deprecated
      MediaStreamTrack.getSources(sources => {
        let audioSource = null;
        let videoSource = null;

        sources.forEach((source) => {
          if (source.kind === "audio") {
            audioSource = source.id;
          } else if (source.kind === "video") {
            videoSource = source.id;
          }
        });

        const audioSourceId = constraintToSourceId(props.audioConstraints);
        if (audioSourceId) {
          audioSource = audioSourceId;
        }

        const videoSourceId = constraintToSourceId(props.videoConstraints);
        if (videoSourceId) {
          videoSource = videoSourceId;
        }

        sourceSelected(
          optionalSource(audioSource),
          optionalSource(videoSource)
        );
      });
    }
  }

  handleUserMedia(err, stream) {
    const { props } = this;

    if (err || !stream) {
      this.setState({ hasUserMedia: false });
      props.onUserMediaError(err);
      return;
    }

    this.stream = stream;

    try {
      if (this.video) {
        this.video.srcObject = stream;
      }
      this.setState({ hasUserMedia: true });
    } catch (error) {
      this.setState({
        hasUserMedia: true,
        src: window.URL.createObjectURL(stream)
      });
    }

    props.onUserMedia(stream);
  }

  render() {
    const { state, props } = this;

    const {
      audio,
      forceScreenshotSourceSize,
      disablePictureInPicture,
      onUserMedia,
      onUserMediaError,
      screenshotFormat,
      screenshotQuality,
      minScreenshotWidth,
      minScreenshotHeight,
      audioConstraints,
      videoConstraints,
      imageSmoothing,
      mirrored,
      style = {},
      children,
      ...rest
    } = props;

    const videoStyle = mirrored ? { ...style, transform: `${style.transform || ""} scaleX(-1)` } : style;

    const childrenProps = {
      getScreenshot: this.getScreenshot.bind(this),
    };

    return (
      <>
        <video
          autoPlay
          disablePictureInPicture={disablePictureInPicture}
          src={state.src}
          muted={!audio}
          playsInline
          ref={ref => {
            this.video = ref;
          }}
          style={videoStyle}
          {...rest}
        />
        {children && children(childrenProps)}
      </>
    );
  }
}