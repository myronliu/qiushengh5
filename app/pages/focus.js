import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import TapAble from 'react-tappable';
import Loading from '../helper/loading';
import QsFooter from '../components/qsfooter';

export default class extends BasePage {
  state={
    focusList:[],
    newList: []
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.concern:
        this.setState({
          focusList: (body.has ? body.experts : []),
          newList: (!body.has ? body.experts : [])
        })
        break;
      case UrlConfig.concernadd:
        this.showLoading(true)
        ApiAction.post(UrlConfig.concern, {token: Cookie.getCookie("token") || 'af80808157fa19f70157fa1a74a30001'});
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();

    this.showLoading(true)
    ApiAction.post(UrlConfig.concern, {token: Cookie.getCookie("token") || ''});

  }

  gotoSpecial(id){
    window.to('/specialinfo?id=' + id);
  }

  gotoSpecials(){
    window.to('/specialist');
  }

  focusUser(id){
    this.showLoading(true)
    ApiAction.post(UrlConfig.concernadd, {expertId: id, token: Cookie.getCookie("token") || ''});
  }

  hideNew(){
    this.setState({
      newList:[]
    })
  }

  renderFocusList(){
    if(this.state.newList.length > 0){
      var arrs = this.state.newList.map(function(item, index){
        return(
          <div className="new" key={"fn" + index}>
            <img src={item.avatar ? item.avatar : "../images/photo.png"} />
            <div className="textInfo">
              <div className="tTitle">{item.name}</div>
              <div className="tDesc">{item.title}</div>
            </div>
            <div className="right">
              <TapAble className="guanzhu" onTap={this.focusUser.bind(this, item.id)}>{"+关注"}</TapAble>
            </div>
          </div>
        )
      }.bind(this));
      return(
        <div className="add">
          <div className="title">推荐专家</div>
          <div className="list">
            {arrs}
          </div>
          <div className="jump" onTouchEnd={this.hideNew.bind(this)}>跳过</div>
        </div>
      )
    }else{
      return this.state.focusList.map(function(item, index){
        return(
          <TapAble className="fitem" onTap={this.gotoSpecial.bind(this, item.id)} key={"fo" + index}>
            <img src={item.avatar ? item.avatar : "../images/photo.png"} />
            <div className="textInfo">
              <div className="tTitle">{item.name}</div>
              <div className="tDesc">{item.title}</div>
            </div>
            <div className="right">
              <div className="rightInfo">{">"}</div>
              <div className={ item.recommendings > 0 ? "numInfo" : 'hide'}>{item.recommendings}</div>
            </div>
          </TapAble>
        )
      }.bind(this));
    }
  }

  render() {
    let rightBtn={title:'新增',func:this.gotoSpecials.bind(this)};
    return (
      <Layout  hideBack={true} className={'focus'} title={'我的关注'} rightItems={[rightBtn]}>
        <Loading showLoading={this.state.showLoading} />
        {this.renderFocusList()}
        <div style={{height:'9rem'}}></div>
        <QsFooter page={"focus"}/>
      </Layout>
    )
  }
}
