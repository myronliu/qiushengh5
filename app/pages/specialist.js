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
    tabs:['推荐专家','特邀大咖','彩店专家','明星专家'],
    currentTab: 0,
    list:[1,2,3,4,5,6,7,8,9,10,11,12]
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

  changeTab(index){
    this.setState({
      currentTab: index
    })
  }

  renderTabs(){
    return this.state.tabs.map(function(item, index){
      return (
        <div onTouchEnd={this.changeTab.bind(this, index)} className={(this.state.tabs.length === index +1 ? "tabItemWithoutBorder" : "tabItem") + (this.state.currentTab === index ? " tabItemWithLine" : '')} key={index}>
          {item}
        </div>
      )
    }.bind(this));
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="specialItem" key={"s"+index}>
          <img src={item.url ? item.url : '../images/photo.png'} className="" />
          <div className="name">
            {item.name ? item.name : '专家'}
          </div>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'specialist'} title={'专家列表'}>
        <div className="tabs">
          {this.renderTabs()}
        </div>
        <div>
          {this.renderItems()}
        </div>
      </Layout>
    )
  }
}
