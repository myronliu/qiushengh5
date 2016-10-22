import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import TwoBtnAlert from '../components/twobtnalert';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

export default class extends BasePage {
  state={
    list:[],
    avarurl: '',
    expertname: '',
    detail: '',
    recState: 'NOEND',
    showAlert: false
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.expertDetail:
        body = body || {};
        body.expert = body.expert || {};
        this.setState({
          avarurl: body.expert.avatar,
          expertname: body.expert.name,
          detail: body.expert.detail,
          list: body.recommending
        })
        break;
      case UrlConfig.expertRecommend:
        this.setState({
          list: body
        })
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();
    // this.interval = setInterval(function(){
    //   ApiAction.post(UrlConfig.getUserRec,{username: this.props.username})
    // }.bind(this), 5000)
    this.showLoading(true);
    ApiAction.post(UrlConfig.expertDetail, {id: this.props.id, token: Cookie.getCookie("token") || 'dds'});
  }

  getUnEnd(){
    this.showLoading(true);
    this.setState({
      recState: "NOEND"
    })
    ApiAction.post(UrlConfig.expertRecommend, {id: this.props.id, state: "NO", token: Cookie.getCookie("token") || 'dds'});
  }

  getEnd(){
    this.showLoading(true);
    this.setState({
      recState: "END"
    })
    ApiAction.post(UrlConfig.expertRecommend, {id: this.props.id, state: "YES", token: Cookie.getCookie("token") || 'dds'});
  }

  pay(fee){
    if(fee && fee != "0"){
      this.setState({
        showAlert: true
      })
    }
    this.setState({
        showAlert: true
      })
  }

  handleCancle(){
    this.setState({
      showAlert: false
    })
  }

  handleSure(){
    this.setState({
      showAlert: false
    })
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="specialItem" key={"s"+index} onTouchEnd={this.pay.bind(this, item.fee)}>
          <div className="leftPart">
            <div className="topInfo">
              <span className="liansai">{item.matchName}</span>
              <span className="add">{item.betsType}</span>
              <span className="time">10-10 02:45</span>
            </div>
            <div className="bottomInfo">
              <span className="left">{item.homeTeam}</span>
              <span className="">VS</span>
              <span className="right">{item.awayTeam}</span>
            </div>
          </div>
          <div className="rightPart">
            {item.fee && item.fee != "0" ? item.fee+"粒米" : "免费"}
          </div>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'specialinfo'} title={'专家详情'}>
        <Loading showLoading={this.state.showLoading} />
        <TwoBtnAlert show={this.state.showAlert} title={"需支付" + "**" + "粒米查看专家推荐\n(1粒米=1元)"} firstBtnTitle={"取消"} secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)} secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
        <div className="header">
          <div className="divImg">
            <img src={this.state.avarurl ? this.state.avarurl : "../images/photo.png"} className="" />
          </div>
          <div className="name">
            {
              this.state.expertname
            }
          </div>
          <div className="desc">
            {
              this.state.detail
            }
          </div>
        </div>
        <div className="tabs">
          <div className={this.state.recState == "NOEND" ? "active" : "unactive"} onTouchEnd={this.getUnEnd.bind(this)}>未结束</div>
          <div className={this.state.recState == "END" ? "active" : "unactive"} onTouchEnd={this.getEnd.bind(this)}>已结束</div>
        </div>
        <div className="items">
          {this.renderItems()}
        </div>
      </Layout>
    )
  }
}
