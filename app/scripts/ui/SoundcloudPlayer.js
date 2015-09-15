'use strict';
var React = require('react');

var SoundcloudPlayer = React.createClass({
  getInitialState: function() {
    return {
      ready: false,
      widget: undefined
    };
  },
  getDefaultProps: function() {
    return {
      url: '',
      control: 'stop'
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (this.props.url != nextProps.url) {
      return true;
    }
    if (this.props.control != nextProps.control || nextProps.control === 'restart-play') {
      return true;
    }
    return false;
  },
  componentDidMount: function() {
    if (this.props.url && this.props.url !== '') {
      this.loadUrl(this.props.url);
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (nextProps.url !== undefined && nextProps.url !== this.props.url) {
      this.loadUrl(nextProps.url);
    }
  },
  loadUrl: function (url) {
    var iframe = document.getElementById(this.props.iframeId);
    var widget = SC.Widget(iframe);
    var that = this;

    if (url) {
      this.setState({
        widget: widget
      });
      widget.load(url, {
        auto_play: false
      });
      widget.bind(SC.Widget.Events.READY, function (progress) {
        console.log('[SoundcloudWidget] ready.');
        that.setState({ ready: true });
      });
      // widget.bind(SC.Widget.Events.PLAY, function (progress) {
      //   that.props.onSoundStateChange('playing');
      // });
      // widget.bind(SC.Widget.Events.PAUSE, function (progress) {
      //   that.props.onSoundStateChange('paused');
      // });
    }
  },
  componentDidUpdate: function (prevProps, prevState) {
    if (this.props.control != prevProps.control) {

      switch (this.props.control) {
          case 'play':
              this.play();
              break;
          case 'restart-play':
              this.stop();
              this.play();
              break;
          case 'stop':
              this.stop();
              break;
          case 'ended':
              this.stop();
              break;
          case 'pause':
              this.pause();
              break;
          default:
              // console.log('Unrecognized soundcloud control command "' + nextProps.control + '"');
      }
    }
  },
  play: function () {
    if (this.state.widget && this.state.ready) {
      this.state.widget.play();
    }
  },
  pause: function () {
    if (this.state.widget && this.state.ready) {
      this.state.widget.pause();
    }
  },
  stop: function () {
    if (this.widget && this.state.ready) {
      this.state.widget.pause();
      this.state.widget.seekTo(0);
    }
  },
  toggle: function () {
    if (this.state.widget && this.state.ready) {
      this.state.widget.toggle();
    }
  },
  render: function() {
    var wrapperClassName = 'soundcloud-wrapper';
    return (
      <div className={wrapperClassName}>
        <iframe id={this.props.iframeId} src="https://w.soundcloud.com/player/?" width="100%" height="465" scrolling="no" frameBorder="no"></iframe>
      </div>
    );
  }
});


module.exports = SoundcloudPlayer;
