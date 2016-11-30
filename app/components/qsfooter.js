import React from 'react';
export default class Footer extends React.Component{
  gotoPage(page){
    if(process.browser){
      if(page === "home" && this.props.page !== "home"){
        window.to("/qiusheng");
      }else if(page === "saishi" && this.props.page !== "saishi"){
        window.to("/hotmatch");
      }else if(page === "specialist" && this.props.page !== "specialist"){
        window.to("/specialist");
      }else if(page === "mine" && this.props.page !== "mine"){
        window.to("/mine");
      }
    }
  }
  render(){
    return (
      <div className="qsfooter">
        <div onTouchEnd={this.gotoPage.bind(this, "home")} className={this.props.page == "home" ? "footer-item active" : "footer-item"}> <img src={this.props.page == "home" ? "./images/home_1.png" : "./images/home.png"} /><div>首页</div></div>
        <div onTouchEnd={this.gotoPage.bind(this, "saishi")} className={this.props.page == "saishi" ? "footer-item active" : "footer-item"}><img src={this.props.page == "saishi" ? "./images/football_1.png" : "./images/football.png"} /><div>赛事</div></div>
        <div onTouchEnd={this.gotoPage.bind(this, "specialist")} className={this.props.page == "specialist" ? "footer-item active" : "footer-item"}><img src={this.props.page == "specialist" ? "./images/focus_1.png" : "./images/focus.png"} /><div>专家</div></div>
        <div onTouchEnd={this.gotoPage.bind(this, "mine")} className={this.props.page == "mine" ? "footer-item active" : "footer-item"}><img src={this.props.page == "mine" ? "./images/mine_1.png" : "./images/mine.png"} /><div>我的</div></div>
      </div>
    );
  }
}