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
    onYouTubePlayerReady();
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

function onYouTubePlayerReady(playerid){
  var player = document.getElementById('ytp');
  console.log('[onYouTubePlayerReady] playVideo');
  console.log(player);
  player.playVideo();
}


module.exports = JimmyVid;
