var React = require('react');

module.exports = React.createClass({
  render: function(){
    return (
      <div className={this.props.show ? "totalDialog" : "display"} onTouchEnd={this.props.onTouchEnd}>
        <div className="total-boxMain">
          <img src="/images/win.png" />
          <span>100金币</span>
        </div>
        <div className="total-kuang">
          恭喜你完成所有关卡
        </div>
        
      </div>
    )
  }
});