import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';
import TwoBtnAlert from '../components/twobtnalert';

export default class extends BasePage {
  state={
    recList:[],
    tabs:[],//['推荐专家','特邀大咖','彩店专家','明星专家'],
    currentTab: 0,
    homeTeam: '',
    awayTeam: '',
    matchName: '',
    matchDate: '',
    showAlert: false,
    homeTeamAvatar:'',
    awayTeamAvatar:''
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.matchDetail:
        this.setState({
          homeTeam: body.detail.homeTeam,
          awayTeam: body.detail.awayTeam,
          matchName: body.detail.matchName,
          matchDate: body.detail.matchDate,
          homeTeamAvatar: body.detail.homeTeamAvatar,
          awayTeamAvatar: body.detail.awayTeamAvatar,
          recList: body.recommends
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
    }
  }

  componentDidMount(){
    super.componentDidMount();

    this.showLoading(true)
    ApiAction.post(UrlConfig.matchDetail, {id: this.props.id, token: Cookie.getCookie("token") || ''});
  }

  pay(fee, id, ifBuy){
    if(!ifBuy && fee && fee != "0"){
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
    ApiAction.post(UrlConfig.recommendBuy, {recommendId: this.state.payId, token: Cookie.getCookie("token") || ''});
  }

  renderRecommondList(){
    return this.state.recList.map(function(item, index){
      return(
        <TapAble className="recItem block" key={"rec" + index} onTap={this.pay.bind(this, item.fee, item.id, item.ifBuy)}>
          <div className="specialInfo">
            <img src={item.avatar ? item.avatar : "../images/photo.png"} />
            <div className="textInfo">
              <div className="tTitle">{item.expertName}</div>
              <div className="tDesc">{item.expertTitle}</div>
            </div>
          </div>
          <div className="saishiItem" key={"s"+index}>
            <div className="leftPart">
              <div className="sTopInfo">
                <span className="add">{item.betsType}</span>
                <span className="time">{item.createTimeStr}</span>
              </div>
              
            </div>
            <div className="rightPart">
              {item.fee > 0 ? (item.ifBuy ? "查看" : (item.fee + "粒米")) : ("免费")}
            </div>
          </div>
        </TapAble>
      )
    }.bind(this))
  }

  changeTab(index){
    this.setState({
      currentTab: index
    })
  }

  renderTabs(){
    return this.state.tabs.map(function(item, index){
      return (
        <div onTouchEnd={this.changeTab.bind(this, index)} className={(this.state.tabs.length === index +1 ? "tabItemWithoutBorder" : "tabItem") + (this.state.currentTab === index ? " tabItemWithLine" : '') + (index === 0?" leftRadius" : '') + (index + 1 === this.state.tabs.length ? " rightRadius" : '')} key={index}>
          {item}
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'hotmatchdetail'} title={'赛事推荐列表'}>
        <Loading showLoading={this.state.showLoading} />
        <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"} secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)} secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
        <div className="top">
          <div className="saishi">
            <div className="saishiLeft">
              <img src={this.state.homeTeamAvatar ? this.state.homeTeamAvatar : "../images/photo.png"} />
              <span>{this.state.homeTeam}</span>
            </div>
            <div className="saishiMiddle">
              <div className="liansai"><span className="o">{this.state.matchName}</span><span className="oo">{"89'"}</span></div>
              <div className="g">VS</div>
              <div className="time">{this.state.matchDate}</div>
            </div>
            <div className="saishiRight">
              <img src={this.state.awayTeamAvatar ? this.state.awayTeamAvatar : "../images/photo.png"} />
              <span>{this.state.awayTeam}</span>
            </div>
          </div>
        </div>
        <div className="header hide">
          <span className="on">热门</span>
          <span className="end">专家</span>
        </div>
        <div className="tabs hide">
          {this.renderTabs()}
        </div>
        {this.renderRecommondList()}
      </Layout>
    )
  }
}
