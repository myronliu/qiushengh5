import Layout from '../components/layout';

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import TwoBtnAlert from '../components/twobtnalert';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig';
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';

export default class extends BasePage {
  state={
    recommending:[],
    recommended:[],
    articles: [],
    avarurl: '',
    expertname: '',
    detail: '',
    recState: 'NO',
    showAlert: false,
    status: '加关注'
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
          recommending: body.recommending || [],
          recommended: body.recommended || [],
          articles: body.articles || [],
          status: body.ifConcern ? '取消关注' : '加关注'
        });
        console.log('body',body);
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
          window.to('/recommendationdetail?id=' + this.state.payId);
        }else{
          if(body.msg === "已经买过该推荐了"){
            window.to('/recommendationdetail?id=' + this.state.payId);
          }else{
            Toast.show(body.msg, 'error')
          }
        }
        break;
      case UrlConfig.concernadd:
        this.setState({
          status: '取消关注'
        });
        Toast.show('关注成功', 'success');
        break;
      case UrlConfig.concerncancel:
        this.setState({
          status: '加关注'
        });

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
        alertTitle: "需支付" + fee  + CommonConfig.unit + "查看专家推荐<br />(1" + CommonConfig.unit + "=1元)",
        payId: id
      })
    }else{
      window.to('/recommendationdetail?id=' + id);
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
  handleApplyExpert(){
    window.to('/applyexpert');
  }


  focusUser(id){
    this.showLoading(true)
    if(this.state.status === "加关注"){
      ApiAction.post(UrlConfig.concernadd, {expertId: id, token: Cookie.getCookie("token") || ''});
    }else{
      ApiAction.post(UrlConfig.concerncancel, {expertId: id, token: Cookie.getCookie("token") || ''});
    }
  }

  gotoArticle(id){
    window.location.href = '/article?id=' + id;
  }

  renderRecommending(){
    return (
      <div>
        <p className="itemCategoryTitle recommending">未结束</p>
        { this.renderItems(this.state.recommending, false) }
      </div>
    );
  }

  renderRecommended(){
    return (
      <div>
        <p className="itemCategoryTitle recommended">历史推荐</p>
        { this.renderItems(this.state.recommended, true) }
      </div>
    );
  }

  renderArticles(){
    return (
      <div>
        <p className="itemCategoryTitle article">文章</p>
        { this.renderArticleItems(this.state.articles) }
      </div>
    );
  }

  renderArticleItems(articles){
    return articles.map(function(item, index){
      return (
        <TapAble className="article block" key={"s"+index} onTap={this.gotoArticle.bind(this, item.id)}>
          <div className='article-item'>
            <p className='article-title'>{item.title}</p>
            <p className='article-creator'>{item.creator === '' ? '球胜体育': item.creator}</p>
          </div>
        </TapAble>
      )
    }.bind(this));
  }

  renderItems(sourceList, free){
    return sourceList.map(function(item, index){
      return (
        <TapAble className="specialItem block" key={"s"+index} onTap={this.pay.bind(this, item.fee, item.id, free || item.ifBuy)}>
          <div className="leftPart">
            <div className="topInfo">
              <span className="liansai">{item.matchName}</span>
              <span className="add">{item.betsType}</span>
              <span className="time">{item.matchDate.substr(5,11)}</span>
            </div>
            <div className="bottomInfo">
              <span className="left">{item.homeTeam}</span>
              <span className="">VS</span>
              <span className="right">{item.awayTeam}</span>
            </div>
          </div>
          <div className="rightPart">
            {this.state.recState == "NO" ? (item.fee && item.fee > 0 ? (free || item.ifBuy ? "查看" : item.fee + CommonConfig.unit) : "免费") : "免费"}
          </div>
        </TapAble>
      )
    }.bind(this));
  }
  componentWillUpdate(){
    this.renderRecommended();
    this.renderRecommending();
    this.renderArticles();
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
        <div className="items">
          {this.renderRecommending()}
          {this.renderRecommended()}
          {this.renderArticles()}
        </div>
      </Layout>
    )
  }
}
