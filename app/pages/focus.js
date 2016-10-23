import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import TapAble from 'react-tappable';
import Loading from '../helper/loading';

export default class extends BasePage {
  state={
    focusList:[],
    newList: [1,2,3,4,5,6,7,8]
  };

  apiSuccess(url,body){
    // this.showLoading(false);
    // switch(url){
    //   case UrlConfig.getUserRec:
    //     this.setState({
    //       data: body
    //     })
    //     break;
    // }
  }

  componentDidMount(){
    super.componentDidMount();
    // this.interval = setInterval(function(){
    //   ApiAction.post(UrlConfig.getUserRec,{username: this.props.username})
    // }.bind(this), 5000)
  }

  gotoSpecial(id){
    window.to('/specialinfo?id=' + id)
  }

  renderFocusList(){
    if(this.state.focusList.length > 0){
      return this.state.focusList.map(function(item, index){
        return(
          <TapAble className="item" onTab={this.gotoSpecial.bind(this)} key={"fo" + index}>
            <img src={item.expert && item.expert.avatar ? item.expert.avatar : "../images/photo.png"} />
            <div className="textInfo">
              <div className="tTitle">{"Hua"}</div>
              <div className="tDesc">{"李博操盘手"}</div>
            </div>
            <div className="right">
              <div className="rightInfo">{">"}</div>
              <div className="numInfo">{2}</div>
            </div>
          </TapAble>
        )
      }.bind(this));
    }else{
      var arrs = this.state.newList.map(function(item, index){
        return(
          <TapAble className="new" onTab={this.gotoSpecial.bind(this)} key={"fn" + index}>
            <img src={item.expert && item.expert.avatar ? item.expert.avatar : "../images/photo.png"} />
            <div className="textInfo">
              <div className="tTitle">{"Hua"}</div>
              <div className="tDesc">{"李博操盘手"}</div>
            </div>
            <div className="right">
              <span className="guanzhu">{"+关注"}</span>
            </div>
          </TapAble>
        )
      }.bind(this));
      return(
        <div className="add">
          <div className="title">推荐专家</div>
          <div className="list">
            {arrs}
          </div>
          <div className="jump">跳过</div>
        </div>
      )
    }
  }

  render() {
    return (
      <Layout className={'focus'} title={'我的关注'}>
        <Loading showLoading={this.state.showLoading} />
        {this.renderFocusList()}
      </Layout>
    )
  }
}
