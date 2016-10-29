import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import NextButton from '../components/nextbutton';
import Input from '../components/Input';
import TitleInput from '../components/titleinput';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TwoBtnAlert from '../components/twobtnalert';
import TapAble from 'react-tappable';
import QsFooter from '../components/qsfooter';

export default class extends BasePage {
  state={
    overlist: [],
    unoverlist: [],
    showAlert: false,
    status: 'unover'
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.order:
        this.setState({
          avatar: body.my.avatar,
          name: body.my.name,
          rices: body.my.rices,
          overlist: body.orders.over || [],
          unoverlist: body.orders.unOver || []
        })
        break;
      case UrlConfig.recommendBuy:
        this.setState({
          showAlert: false
        })
        window.to("/recodetail?id=" + this.state.payId);
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();
    this.showLoading(true);
    ApiAction.post(UrlConfig.order, {token: Cookie.getCookie("token") || ''});
  }

  handleUnover(){
    this.setState({
      status: 'unover'
    })
  }

  handleOver(){
    this.setState({
      status: 'over'
    })
  }

  pay(fee, id){
    window.to('/recodetail?id=' + id);
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

  gotoCharge(){
    window.location.href='http://localhost:8080/pay/test?token=' + Cookie.getCookie("token");
  }

  renderItems(){
    if(this.state.status == "unover" ){
      return this.state.unoverlist.map(function(item, index){
        return (
          <TapAble className="specialItem block" key={"s"+index} onTap={this.pay.bind(this, item.fee, item.id)}>
            <div className="leftPart">
              <div className="topInfo">
                <span className="liansai">{item.matchName}</span>
                <span className="add">{item.betsType}</span>
                <span className="time">{item.matchDate}</span>
              </div>
              <div className="bottomInfo">
                <span className="left">{item.homeTeam}</span>
                <span className="">VS</span>
                <span className="right">{item.awayTeam}</span>
              </div>
            </div>
            <div className="rightPart">
              {"查看"}
            </div>
          </TapAble>
        )
      }.bind(this));
    }else{
      return this.state.overlist.map(function(item, index){
        return (
          <TapAble className="specialItem block" key={"s"+index} onTap={this.pay.bind(this, item.fee, item.id)}>
            <div className="leftPart">
              <div className="topInfo">
                <span className="liansai">{item.matchName}</span>
                <span className="add">{item.betsType}</span>
                <span className="time">{item.matchDate}</span>
              </div>
              <div className="bottomInfo">
                <span className="left">{item.homeTeam}</span>
                <span className="">VS</span>
                <span className="right">{item.awayTeam}</span>
              </div>
            </div>
            <div className="rightPart">
              {"查看"}
            </div>
          </TapAble>
        )
      }.bind(this));
    }
  }

  render() {
    let rightBtn={title: '充值',func:this.gotoCharge.bind(this)};
    return (
      <Layout  hideBack={true} className={'mine'} title={'我的'}>
        <Loading showLoading={this.state.showLoading} />
        <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"} secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)} secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
        <div className="header">
          <div className="divImg">
            <img src={this.state.avatar ? this.state.avatar : "../images/photo.png"} className="" />
          </div>
          <div className="name">
            { this.state.name || '' }
          </div>
          <div className="money">
            <span>米仓：</span>
            <span className="num">{this.state.rices || '0'}</span>
            <span>粒米</span>
          </div>
        </div>
        <div className="tabs">
          <div className={this.state.status == 'unover' ? "active" : "unactive"} onTouchEnd={this.handleUnover.bind(this)}>未结束</div>
          <div className={this.state.status == 'over' ? "active" : "unactive"} onTouchEnd={this.handleOver.bind(this)}>已结束</div>
        </div>
        <div className="items">
          {this.renderItems()}
        </div>
        <QsFooter page={"mine"}/>
      </Layout>
    )
  }
}
