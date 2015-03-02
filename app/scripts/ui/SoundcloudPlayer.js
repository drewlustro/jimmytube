/** @jsx React.DOM */
var React = require('react');

var SoundcloudPlayer = React.createClass({
  getInitialState: function() {
    return { url: undefined,
              ready: false };
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
  componentWillReceiveProps: function (nextProps) {

    console.log("nextProps");
    console.log(nextProps);
    if (nextProps.url !== undefined && nextProps.url !== this.state.url) {
      var iframe = document.querySelector('#scp');
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

    if (nextProps.ready) {
      this.play();
    }

  },
  play: function () {
    var iframe = document.querySelector('#scp');
    var widget = SC.Widget(iframe);
    widget.play();
  },
  toggle: function () {
    var iframe = document.querySelector('#scp');
    var widget = SC.Widget(iframe);
    widget.toggle();
  },
  render: function() {
    var wrapperClassName = 'soundcloud-wrapper'

    return (
      <div className={wrapperClassName}>

        <iframe id="scp" src="https://w.soundcloud.com/player/?" width="100%" height="465" scrolling="no" frameborder="no"></iframe>
      </div>
    );
  }
});


module.exports = SoundcloudPlayer;
