/** @jsx React.DOM */
var React = require('react');

var JimmyVid = React.createClass({
  getInitialState: function() {
    return { youtubeId: null};
  },
  // tick: function() {
  //   this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  // },
  componentDidMount: function() {
    // this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    // clearInterval(this.interval);
  },
  play: function () {
    var player = document.getElementById('ytp');
    console.log('[VIDEO] playVideo');
    // player.playVideo();
    onYouTubePlayerReady(this.props.source);
  },
  stop: function () {
    var player = document.getElementById('ytp');
    player.stopVideo();
  },
  componentWillReceiveProps: function (nextProps) {
    console.log('[VIDEO] receiveProps');
    if (nextProps.ready) {
      console.log('[VIDEO] try play');
      this.play();
    }
  },
  render: function() {
    var wrapperClassName = 'video-wrapper widescreen'
    if (true || this.state.youtubeId !== null ) {
      return (
        <div className={wrapperClassName}>
          <iframe id="ytp" src={ 'https://www.youtube.com/embed/' + this.props.source + '?enablejsapi=1&version=3&playerapiid=ytp&rel=0&showinfo=0'} frameborder="0" allowfullscreen></iframe>
        </div>
      );
    } else {
      return (
        <div>
          <h1>No Video Loaded</h1>
        </div>
      );
    }

  }
});

var player;
function onYouTubePlayerReady(playerid) {
  // var player = document.getElementById('ytp');
  player = new YT.Player('ytp', {
    videoId: playerid,
    events: {
      'onReady': onPlayerReady
    }
  });
  console.log('[onYouTubePlayerReady] new YT.Player -- 1');
  console.log(player);

}

function onPlayerReady() {
  console.log('[onPlayerReady] fired. trying playVideo() -- 2');
  player.playVideo();
  player.mute();
  var playerElement = document.getElementById('ytp');
  var requestFullScreen = playerElement.requestFullScreen || playerElement.mozRequestFullScreen || playerElement.webkitRequestFullScreen;
  if (requestFullScreen) {
    requestFullScreen.bind(playerElement)();
  }
}

// function onPlayerStateChange(event) {
//   if (event.data == YT.PlayerState.PAUSED) {

//   }
// }


module.exports = JimmyVid;
