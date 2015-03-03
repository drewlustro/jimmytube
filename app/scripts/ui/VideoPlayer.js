/** @jsx React.DOM */
var React = require('react');

var VideoPlayer = React.createClass({
  getInitialState: function() {
    return {
        player: null,
        youtubeId: null,
        youtubeUrl: null
    };
  },
  // tick: function() {
  //   this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  // },
  componentDidMount: function() {
    // force update on initial load
    this.componentWillReceiveProps(this.props);
  },
  componentWillUnmount: function() {
    // clearInterval(this.interval);
  },
  play: function (useFullscreen) {
    // this.loadYouTubePlayer(this.state.youtubeId);

    if (useFullscreen) {
      var playerElement = document.getElementById(this.props.iframeId);
      var requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen;
      if (requestFullScreen) {
        requestFullScreen.bind(playerElement)();
        playerElement.focus();
      }
    }

    if (this.player) {
      this.player.playVideo();
      this.player.mute();
    }
  },
  stop: function () {
    // var player = document.getElementById(this.state.iframeId);
    // player.stopVideo();
  },
  componentWillReceiveProps: function (nextProps) {
    console.log('[VIDEO] receiveProps');

    // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
    function parseYoutube(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            return match[7];
        }
        return null;
    }

    if (nextProps.url) {
        var videoId = parseYoutube(nextProps.url);
        if (videoId !== undefined) {
            this.setState({youtubeId: videoId,
                           youtubeUrl: nextProps.url});
        }
    }

    // if (nextProps.ready) {
    //   console.log('[VIDEO] try play');
    //   this.play();
    // }
  },
  componentWillUpdate: function (nextProps, nextState) {
    if (nextProps.iframeId !== undefined && nextState.youtubeId !== undefined) {
      this.loadYouTubePlayer(nextState.youtubeId);
    }
  },
  loadYouTubePlayer: function (youtubeId) {
    this.player = new YT.Player(this.props.iframeId, {
      videoId: youtubeId,
      events: {
        'onReady': this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange
      }
    });
    console.log(this.player);
    console.log('[loadYouTubePlayer] new YT.Player -- 1 "' + this.props.iframeId + '" -- id "' + youtubeId + '"');

  },
  onPlayerReady: function () {
    console.log('[onPlayerReady] fired and ready. Waiting for events... "' + this.props.iframeId + '"');
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
    // if (this.state.youtubeId !== null && this.props.iframeId !== null) {
      return (
        <div className={wrapperClassName}>
          <iframe id={this.props.iframeId} src={ 'https://www.youtube.com/embed/' + this.state.youtubeId + '?enablejsapi=1&version=3&playerapiid=' + this.props.iframeId + '&rel=0&showinfo=0'} frameborder="0" allowfullscreen="allowfullscreen"></iframe>
        </div>
      );
    // }
  }
});

// var player, iframeId;
// function onYouTubePlayerReady(playerid, iframe) {
//   iframeId = iframe;
//   player = new YT.Player(iframeId, {
//     videoId: playerid,
//     events: {
//       'onReady': onPlayerReady,
//       'onStateChange': onPlayerStateChange
//     }
//   });
//   console.log('[onYouTubePlayerReady] new YT.Player -- 1 "' + iframeId + '"');
//   console.log(player);

// }

// function onPlayerReady() {
//   console.log('[onPlayerReady] fired. trying playVideo() -- 2 "' + iframeId + '"');
//   player.playVideo();
//   player.mute();
//   var playerElement = document.getElementById(iframeId);
//   var requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen;
//   if (requestFullScreen) {
//     requestFullScreen.bind(playerElement)();
//   }
// }

// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PAUSED) {

//   }
// }


module.exports = VideoPlayer;
