/** @jsx React.DOM */
var React = require('react');

var SoundcloudPlayer = React.createClass({
  getInitialState: function() {
    return {
        url: undefined,
        ready: false
    };
  },
  componentDidMount: function() {
    // force update on initial load
    this.componentWillReceiveProps(this.props);
  },
  componentWillReceiveProps: function (nextProps) {

    console.log("[SoundCloud] nextProps");
    console.log(nextProps);
    if (nextProps.url !== undefined && nextProps.url !== this.state.url) {
      var iframe = document.getElementById(this.props.iframeId);
      var widget = SC.Widget(iframe);
      var url = nextProps.url;
      var that = this;

      this.setState({
        url: nextProps.url,
        ready: nextProps.ready
      });

      if ( null !== url ) {
        console.log('trying to load ' + url);
        widget.load(url, {
          auto_play: false
        });
        widget.bind(SC.Widget.Events.READY, function (p) {
          console.log("[Widget] Ready - " + url);

        });
      }
    }

    switch (nextProps.control) {
        case 'play':
            this.play();
            break;
        case 'ended':
            this.stop();
            break;
        case 'pause':
            this.pause();
            break;
        default:
            console.log('Unrecognized soundcloud control command "' + nextProps.control + '"');
    }
  },
  getWidget: function () {
    var iframe = document.getElementById(this.props.iframeId);
    var widget = SC.Widget(iframe);
    if (widget) return widget;
    return undefined;
  },
  play: function () {
    this.getWidget().play();
  },
  pause: function () {
    this.getWidget().pause();
  },
  stop: function () {
    var widget = this.getWidget();
    widget.pause();
    widget.seekTo(0);
  },
  toggle: function () {
    this.getWidget().toggle();
  },
  render: function() {
    var wrapperClassName = 'soundcloud-wrapper';
    return (
      <div className={wrapperClassName}>
        <iframe id={this.props.iframeId} src="https://w.soundcloud.com/player/?" width="100%" height="465" scrolling="no" frameborder="no"></iframe>
      </div>
    );
  }
});


module.exports = SoundcloudPlayer;
