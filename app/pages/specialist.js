import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import Loading from '../helper/loading';
import NextButton from '../components/nextbutton';
import Input from '../components/Input';
import TitleInput from '../components/titleinput';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';

export default class extends BasePage {
  state={
    tabs:[
      {
        title:'推荐专家',
        key: 'TJZJ'
      },{
        title:'特邀大咖',
        key: 'TYDK'
      },{
        title:'彩店专家',
        key: 'CDSD'
      },{
        title:'美女推波',
        key: 'MNTB'
      },{
        title:'竞彩高手',
        key:'JCGS'
      }],
    currentTab: 0,
    list:[]
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.expertlist:
        if(body && body.length>0){
          if(body.length % 4 === 1){
            body.push({})
            body.push({})
            body.push({})
          }else if(body.length % 4 === 2){
            body.push({})
            body.push({})
          }else if(body.length % 4 === 3){
            body.push({})
          }
        }
        if(!body.length) {
          this.setState({
            list: []
          })
        }else{
          this.setState({
            list: body
          })
        }
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();
    // this.interval = setInterval(function(){
    //   ApiAction.post(UrlConfig.getUserRec,{username: this.props.username})
    // }.bind(this), 5000)
    this.showLoading(true);
    ApiAction.post(UrlConfig.expertlist, {expertType: "TJZJ", token: Cookie.getCookie("token")});
  }

  changeTab(index){
    this.showLoading(true);
    this.setState({
      currentTab: index
    })
    ApiAction.post(UrlConfig.expertlist, {expertType: this.state.tabs[index].key, token: Cookie.getCookie("token")});
  }

  gotoDetail(id){
    window.to('/specialinfo?id=' + id);
  }

  renderTabs(){
    return this.state.tabs.map(function(item, index){
      return (
        <span onTouchEnd={this.changeTab.bind(this, index)} className={"tabItem" + (this.state.currentTab === index ? " active" : '')} key={index}>
          {item.title}
        </span>
      )
    }.bind(this));
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="specialItem" key={"s"+index} onTouchEnd={this.gotoDetail.bind(this, item.id)}>
          <img src={item.avatar ? item.avatar : '../images/photo.png'} className="" />
          <div className="name">
            {item.name ? item.name : '虚位以待'}
          </div>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'specialist'} title={'专家列表'}>
        <Loading showLoading={this.state.showLoading} />
        <div className="tabs">
          {this.renderTabs()}
        </div>
        <div className="specialistInner">
          {this.renderItems()}
        </div>
      </Layout>
    )
  }
}
