var React = require('react');

module.exports = React.createClass({
  render: function(){
    return (
      <div className={this.props.show ? "bidlcjDialog" : "display"}>
        <div className="boxMain">
          <img src="/images/baoxiang.png" />
        </div>
        <div className="kuang">
          <div className="kuang-title">恭喜</div>
          <div className="jinbi">
            <img src="/images/unit.png" />
            <span>+{this.props.num || "20"}</span>
          </div>
        </div>
        <div className="reward-ok">
          <img onTouchEnd={this.props.onTouchEnd} src="/images/ok.png" />
        </div>
      </div>
    )
  }
});