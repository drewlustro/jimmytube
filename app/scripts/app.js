/** @jsx React.DOM */

var SOUNDCLOUD_CLIENT_ID = "139b561ee195632ce8dc48df97e087a3";
var SOUNDCLOUD_SECRET = "52d05c352c5321cff73b781085c6613f";

var React = window.React = require('react'),
    Timer = require("./ui/Timer"),
    JimmyVid = require('./ui/JimmyVid'),
    SoundcloudPlayer = require('./ui/SoundcloudPlayer'),
    mountNode = document.getElementById("app");

var JimmyVidChrome = React.createClass({
  render: function() {
    var createItem = function(itemText) {
      return <li>{itemText}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});
var JimmyVidApp = React.createClass({
  getInitialState: function() {
    return { ready: false,
             youtubeUrl: undefined,
             youtubeId: undefined,
             soundcloudUrl: undefined };
  },
  onYoutubeChange: function(e) {
    var youtubeUrl = e.target.value;

    // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
    function parseYoutube(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[7].length == 11) {
            return match[7];
        }
        return null;
    }

    var videoId = parseYoutube(youtubeUrl);
    if (videoId !== undefined) {
        this.setState({youtubeId: videoId,
                       youtubeUrl: youtubeUrl});
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
    if (true || this.state.youtubeUrl && this.state.soundcloudUrl) {
        this.setState({
            ready: true
        });
    }
  },
  render: function() {
    var formStyle = {
        position: 'absolute',
        zIndex: 10,
        top: '10px',
        left: '10px'
    };
    return (
      <div>
        <JimmyVid source={this.state.youtubeId} ready={this.state.ready} />
        <SoundcloudPlayer url={this.state.soundcloudUrl} ready={this.state.ready} />
        <form onSubmit={this.togglePlay} style={formStyle}>
          <input onChange={this.onYoutubeChange} value={this.state.youtubeUrl} placeholder="YouTube URL" />
          <br />
          <input onChange={this.onSoundcloudChange} value={this.state.soundcloudUrl} placeholder="SoundCloud URL" />
          <br />
          <button>Play</button>
        </form>
        <Timer />
      </div>
    );
  }
});



React.renderComponent(<JimmyVidApp />, mountNode);

