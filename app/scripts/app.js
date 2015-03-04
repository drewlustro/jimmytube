/** @jsx React.DOM */

var React = window.React = require('react'),
    VideoPlayer = require('./ui/VideoPlayer'),
    SoundcloudPlayer = require('./ui/SoundcloudPlayer'),
    mountNode = document.getElementById("app");

// var BASE_URL = 'http://localhost:9000/';
var BASE_URL = 'http://jimmytube.maxrelax.co/';

// Quick & dirty GET dictionary for preloaded video/soundcloud
// http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/21152762#21152762
var GET_DICT = {};
location.search.substr(1).split("&").forEach(function(item) {
    var k = item.split("=")[0],
        v = decodeURIComponent(item.split("=")[1]);
    GET_DICT[k] = v;
});

console.log(GET_DICT);

var defaults = {
    videoUrl: (GET_DICT.v ? GET_DICT.v : 'https://www.youtube.com/watch?v=SfZWFDs0LxA'),
    soundcloudUrl: (GET_DICT.s ? GET_DICT.s : 'https://soundcloud.com/itsmeelan/cassie-me-and-u-elan-remix')
};

var ShareLink = React.createClass({
    getInitialState: function () {
        return {
          shareUrl: ''
        };
    },
    getDefaultProps: function () {
        return {
            videoUrl: defaults.videoUrl,
            soundcloudUrl: defaults.soundcloudUrl
        };
    },
    componentDidMount: function () {
      if (this.props.videoUrl !== '' && this.props.soundcloudUrl !== '') {
        this.setState({
          shareUrl: this.generateShareUrl(this.props.videoUrl, this.props.soundcloudUrl)
        });
      }
    },
    componentWillReceiveProps: function (nextProps) {
      this.setState({
        shareUrl: this.generateShareUrl(nextProps.videoUrl, nextProps.soundcloudUrl)
      });
    },
    shouldComponentUpdate: function (nextProps, nextState) {
      if (this.state.shareUrl !== nextState.shareUrl) {
        return true;
      }
      return false;
    },
    handleClick: function (e) {
      // e.preventDefault();
      // e.stopPropogation();
      e.target.select();
    },
    generateShareUrl: function (videoUrl, soundcloudUrl) {
      var shareUrl = BASE_URL + '?v=' + encodeURIComponent(videoUrl) +
                        '&s=' + encodeURIComponent(soundcloudUrl);
      return shareUrl;
    },
    render: function () {
      var inputClass = 'form-control input-sm';
      return (
          <div>
            <input className={inputClass} type="text" readOnly="readonly" onClick={this.handleClick} value={this.state.shareUrl} />
          </div>
      )
    }
});

var JimmytubeApp = React.createClass({
  getInitialState: function() {
    return {
      videoUrl: defaults.videoUrl,
      videoControl: undefined,
      soundcloudUrl: defaults.soundcloudUrl,
      soundcloudControl: undefined
    };
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    if (this.state.videoUrl !== nextState.videoUrl) {
      console.log('Jimmytube should update. New video URL! ' + nextState.videoUrl);
      return true;
    }

    if (this.state.videoControl !== nextState.videoControl) {
      console.log('Jimmytube should update. New video control! ' + nextState.videoControl);
      return true;
    }

    if (this.state.soundcloudUrl !== nextState.soundcloudUrl) {
      console.log('Jimmytube should update. New soundcloud URL! ' + nextState.soundcloudUrl);
      return true;
    }

    if (this.state.soundcloudControl !== nextState.soundcloudControl) {
      console.log('Jimmytube should update. New soundcloud control! ' + nextState.soundcloudControl);
      return true;
    }

    console.log('Jimmytube NOT updating.');
    return false;
  },
  onYoutubeChange: function(e) {
    var videoUrl = e.target.value;
    if (videoUrl !== undefined && videoUrl != this.state.videoUrl) {
      this.setState({videoUrl: videoUrl});
    }
  },
  onSoundcloudChange: function(e) {
    var soundcloudUrl = e.target.value;
    if (soundcloudUrl !== undefined && soundcloudUrl != this.state.soundcloudUrl) {
        this.setState({soundcloudUrl: soundcloudUrl});
    }
  },
  playFullscreen: function(e) {
    e.preventDefault();
    if (this.state.videoUrl && this.state.soundcloudUrl) {
      this.setState({
        soundcloudControl: 'restart-play',
        videoControl: 'play-fullscreen'
      });
    }
  },
  onVideoStateChange: function (newState) {
    console.log('[App] onVideoStateChange - ' + newState);
    switch (newState) {
        case 'playing':
            this.setState({ soundcloudControl: 'play' });
            break;
        case 'paused':
            this.setState({ soundcloudControl: 'pause' });
            break;
        case 'ended':
            this.setState({ soundcloudControl: 'stop' });
            break;
        default:
    }
  },
  onSoundStateChange: function (newState) {
    console.log('[App] onSoundStateChange - ' + newState);
    switch (newState) {
        case 'playing':
            this.setState({ videoControl: 'play' });
            break;
        case 'paused':
            this.setState({ videoControl: 'pause' });
            break;
        case 'ended':
            this.setState({ videoControl: 'stop' });
            break;
        default:
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
        <VideoPlayer onVideoStateChange={this.onVideoStateChange} url={this.state.videoUrl} iframeId="ytPlayer" control={this.state.videoControl} />
        <SoundcloudPlayer onSoundStateChange={this.onSoundStateChange} url={this.state.soundcloudUrl} iframeId="scPlayer" control={this.state.soundcloudControl} />
        <form onSubmit={this.playFullscreen} style={formStyle}>
          <strong>YouTube URL:</strong>
          <input className={inputClass} onChange={this.onYoutubeChange} value={this.state.videoUrl} placeholder="YouTube URL" />
          <br />

          <strong>Soundcloud URL:</strong>
          <input className={inputClass} onChange={this.onSoundcloudChange} value={this.state.soundcloudUrl} placeholder="SoundCloud URL" />
          <br />
          <button className={buttonClass}>&#9654; Play Together</button>
          <br /><br /><br />
          <strong>Share Link:</strong>
          <ShareLink videoUrl={this.state.videoUrl} soundcloudUrl={this.state.soundcloudUrl} />
        </form>
        <aside className={logoClass}><h1>jimmytube</h1></aside>
      </div>
    );
  }
});


React.render(<JimmytubeApp />, mountNode);


