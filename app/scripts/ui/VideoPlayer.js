/** @jsx React.DOM */
var React = require('react');

var VideoPlayer = React.createClass({
  getInitialState: function() {
    return {
        player: undefined,
        youtubeId: undefined
    };
  },
  getDefaultProps: function() {
    return {
      url: '',
      control: 'stop'
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (this.props.url !== nextProps.url) {
      return true;
    }
    if (this.props.control !== nextProps.control || nextProps.control === 'play-fullscreen') {
      return true;
    }
    return false;
  },
  componentDidMount: function() {
    if (this.props.url && this.props.url !== '') {
      this.loadUrl(this.props.url);
      this.forceUpdate();
    }
  },
  play: function (useFullscreen) {

    if (useFullscreen) {
      var playerElement = document.getElementById(this.props.iframeId);
      var requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen;
      if (requestFullScreen) {
        requestFullScreen.bind(playerElement)();
        playerElement.focus();
      }
    }

    if (this.state.player) {
      this.state.player.playVideo();
      this.state.player.mute();
    }
  },
  pause: function () {
    if (this.state.player) {
      this.state.player.pauseVideo();
    }
  },
  stop: function () {
    if (this.state.player) {
      this.state.player.pauseVideo();
      this.state.player.seekTo(0);
    }
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.props.url != nextProps.url) {
      this.loadUrl(nextProps.url);
    }
  },
  loadUrl: function (url) {
    // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
    function parseYoutube(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            return match[7];
        }
        return undefined;
    }

    var youtubeId = parseYoutube(url);
    if (youtubeId !== undefined && youtubeId != this.state.youtubeId) {
        this.loadYouTubePlayer(youtubeId);
    }
  },
  componentWillUpdate: function (nextProps, nextState) {
    if (this.props.control != nextProps.control) {
      // console.log('[VideoPlayer] componentWillUpdate that change...');
      // console.log('Prev control = "' + this.props.control + '"');
      // console.log('Next control = "' + nextProps.control + '"');
      switch (nextProps.control) {
        case 'play-fullscreen':
          this.play(true);
          break;
        case 'play':
          this.play();
          break;
        case 'pause':
          this.pause();
          break;
        case 'stop':
          this.stop();
          break;
        default:
      }
    }
  },
  loadYouTubePlayer: function (youtubeId) {
    if (this.state.player === undefined || (this.state.player && this.state.player.videoId != youtubeId)) {
      var player = new YT.Player(this.props.iframeId, {
        videoId: youtubeId,
        controls: 0,
        enablejsapi: 1,
        playerapiid: this.props.iframeId,
        showinfo: 0,
        rel: 0,
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });

      this.setState({
        youtubeId: youtubeId,
        player: player
      });
    }

  },
  onPlayerReady: function () {
    console.log('[VideoPlayer] ready.');
  },
  onPlayerStateChange: function (event) {
    if (event.data == YT.PlayerState.PAUSED) {
      this.props.onVideoStateChange('paused');
    } else if (event.data == YT.PlayerState.PLAYING) {
      this.props.onVideoStateChange('playing');
    } else if (event.data == YT.PlayerState.ENDED) {
      this.props.onVideoStateChange('ended');
    }
  },
  render: function() {
    var wrapperClassName = 'video-wrapper widescreen';
    return (
      <div className={wrapperClassName}>
        <iframe id={this.props.iframeId} src={ 'https://www.youtube.com/embed/' + this.state.youtubeId + '?enablejsapi=1&version=3&playerapiid=' + this.props.iframeId + '&rel=0&showinfo=0&controls=0'} frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
      </div>
    );
  }
});


module.exports = VideoPlayer;
