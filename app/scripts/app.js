/** @jsx React.DOM */

var React = window.React = require('react'),
    VideoPlayer = require('./ui/VideoPlayer'),
    SoundcloudPlayer = require('./ui/SoundcloudPlayer'),
    mountNode = document.getElementById("app");

var JimmytubeApp = React.createClass({
  getInitialState: function() {
    return { ready: false,
             youtubeUrl: undefined,
             videoControl: undefined,
             soundcloudUrl: 'https://soundcloud.com/itsmeelan/cassie-me-and-u-elan-remix',
             soundcloudControl: undefined };
  },
  onYoutubeChange: function(e) {
    var youtubeUrl = e.target.value;
    if (youtubeUrl !== undefined) {
        this.setState({youtubeUrl: youtubeUrl});
    }
  },
  onSoundcloudChange: function(e) {
    var soundcloudUrl = e.target.value;
    if (soundcloudUrl !== undefined) {
        this.setState({soundcloudUrl: soundcloudUrl});
    }
  },
  togglePlay: function(e) {
    e.preventDefault();
    if (this.state.youtubeUrl && this.state.soundcloudUrl) {
        this.setState({
            ready: true
        });
    }
  },
  onVideoStateChange: function (newState) {
    console.log('[App] onVideoStateChange - ' + newState);
    if (newState === 'paused') {
        this.setState({ soundcloudControl: 'pause' });
        // this.props.soundcloudControl = 'pause';
    }
    if (newState === 'ended') {
        this.setState({ soundcloudControl: 'stop' });
        // this.props.soundcloudControl = 'stop';
    }
    if (newState === 'playing') {
        this.setState({ soundcloudControl: 'play' });
        // this.props.soundcloudControl = 'play';
    }
  },
  render: function() {
    var formStyle = {
        position: 'absolute',
        zIndex: 10,
        top: '10px',
        left: '10px'

    };
    var inputClass = 'form-control input-sm';
    var buttonClass = 'btn btn-default';
    var logoClass = 'logo';
    return (
      <div>
        <VideoPlayer onVideoStateChange={this.onVideoStateChange} url={this.state.youtubeUrl} iframeId="ytPlayer" ready={this.state.ready} control={this.state.videoControl} />
        <SoundcloudPlayer url={this.state.soundcloudUrl} iframeId="scPlayer" ready={this.state.ready} control={this.state.soundcloudControl} />
        <form onSubmit={this.togglePlay} style={formStyle}>
          <input className={inputClass} onChange={this.onYoutubeChange} value={this.state.youtubeUrl} placeholder="YouTube URL" />
          <br />
          <input className={inputClass} onChange={this.onSoundcloudChange} value={this.state.soundcloudUrl} placeholder="SoundCloud URL" />
          <br />
          <button className={buttonClass}>&#9654; Play Together</button>
        </form>
        <aside className={logoClass}><h1>jimmytube</h1></aside>
      </div>
    );
  }
});



React.render(<JimmytubeApp />, mountNode);

