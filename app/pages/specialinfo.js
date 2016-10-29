import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import TwoBtnAlert from '../components/twobtnalert';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';

export default class extends BasePage {
  state={
    list:[],
    avarurl: '',
    expertname: '',
    detail: '',
    recState: 'NO',
    showAlert: false,
    status: '关注专家'
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
          list: body.recommending || [],
          status: body.ifConcern ? '取消关注' : '关注专家'
        })
        break;
      case UrlConfig.expertRecommend:
        this.setState({
          list: body || []
        })
        break;
      case UrlConfig.recommendBuy:
        this.setState({
          showAlert: false
        })
        if(body.success){
          window.to('/recodetail?id=' + this.state.payId);
        }else{
          Toast.show(body.msg)
        }
        break;
      case UrlConfig.concernadd:
        this.setState({
          status: '取消关注'
        })
        break;
      case UrlConfig.concerncancel:
        this.setState({
          status: '关注专家'
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
    ApiAction.post(UrlConfig.expertDetail, {id: this.props.id, token: Cookie.getCookie("token") || ''});
  }

  getUnEnd(){
    this.showLoading(true);
    this.setState({
      recState: "NO"
    })
    ApiAction.post(UrlConfig.expertRecommend, {id: this.props.id, state: "NO", token: Cookie.getCookie("token") || 'dds'});
  }

  getEnd(){
    this.showLoading(true);
    this.setState({
      recState: "YES"
    })
    ApiAction.post(UrlConfig.expertRecommend, {id: this.props.id, state: "YES", token: Cookie.getCookie("token") || 'dds'});
  }

  pay(fee, id, ifBuy){
    if(this.state.recState == "NO" && !ifBuy && fee && fee != "0"){
      this.setState({
        showAlert: true,
        alertTitle: "需支付" + fee + "粒米查看专家推荐<br />(1粒米=1元)",
        payId: id
      })
    }else{
      window.to('/recodetail?id=' + id);
    }
  }

  handleCancle(){
    this.setState({
      showAlert: false
    })
  }

  handleSure(){
    this.showLoading(true)
    ApiAction.post(UrlConfig.recommendBuy, {recommendId: this.state.payId, token: Cookie.getCookie("token") || 'dds'});
  }

  focusUser(id){
    this.showLoading(true)
    if(this.state.status === "关注专家"){
      ApiAction.post(UrlConfig.concernadd, {expertId: id, token: Cookie.getCookie("token") || ''});
    }else{
      ApiAction.post(UrlConfig.concerncancel, {expertId: id, token: Cookie.getCookie("token") || ''});
    }
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <TapAble className="specialItem block" key={"s"+index} onTap={this.pay.bind(this, item.fee, item.id, item.ifBuy)}>
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
            {this.state.recState == "NO" ? (item.fee && item.fee > 0 ? (item.ifBuy ? "查看" : item.fee+"粒米") : "免费") : "免费"}
          </div>
        </TapAble>
      )
    }.bind(this));
  }

  render() {
    let rightBtn={title: this.state.status,func:this.focusUser.bind(this,this.props.id)};
    return (
      <Layout className={'specialinfo'} title={'专家详情'} rightItems={[rightBtn]}>
        <Loading showLoading={this.state.showLoading} />
        <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"} secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)} secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
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
          <div className={this.state.recState == "NO" ? "active" : "unactive"} onTouchEnd={this.getUnEnd.bind(this)}>未结束</div>
          <div className={this.state.recState == "YES" ? "active" : "unactive"} onTouchEnd={this.getEnd.bind(this)}>已结束</div>
        </div>
        <div className="items">
          {this.renderItems()}
        </div>
      </Layout>
    )
  }
}
