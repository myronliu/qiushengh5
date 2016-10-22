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

export default class extends BasePage {
  state={
    list:[1,2,3,4]
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

  componentWillUnmount(){
    
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="specialItem" key={"s"+index}>
          <div className="leftPart">
            <div className="topInfo">
              <span className="liansai">世界杯预选赛</span>
              <span className="add">单关</span>
              <span className="time">10-10 02:45</span>
            </div>
            <div className="bottomInfo">
              <span className="left">马其顿</span>
              <span className="">VS</span>
              <span className="right">意大利</span>
            </div>
          </div>
          <div className="rightPart">
            {"58粒米"}
          </div>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'mine'} title={'我的'}>
        <div className="header">
          <div className="divImg">
            <img src="../images/photo.png" className="" />
          </div>
          <div className="name">
            {
              "一朵烟花"
            }
          </div>
          <div className="money">
            <span>米仓：</span>
            <span className="num">0</span>
            <span>粒米</span>
          </div>
        </div>
        <div className="tabs">
          <div className="unactive">未结束</div>
          <div className="active">已结束</div>
        </div>
        <div className="items">
          {this.renderItems()}
        </div>
      </Layout>
    )
  }
}
