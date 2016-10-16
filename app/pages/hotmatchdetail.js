import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';

export default class extends BasePage {
  state={
    recList:[1,2,3],
    tabs:['推荐专家','特邀大咖','彩店专家','明星专家'],
    currentTab: 0
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

  renderRecommondList(){
    return this.state.recList.map(function(item, index){
      return(
        <div className="recItem" key={"rec" + index}>
          <div className="specialInfo">
            <img src="../images/photo.png" />
            <div className="textInfo">
              <div className="tTitle">一个专家</div>
              <div className="tDesc">彩店店长</div>
            </div>
          </div>
          <div className="saishiItem" key={"s"+index}>
            <div className="leftPart">
              <div className="sTopInfo">
                <span className="add">单关</span>
                <span className="time">10-10 02:45</span>
              </div>
              
            </div>
            <div className="rightPart">
              {"58粒米"}
            </div>
          </div>
        </div>
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
        <div className="top">
          <div className="saishi">
            <div className="saishiLeft">
              <img src="../images/photo.png" />
              <span>乌克兰</span>
            </div>
            <div className="saishiMiddle">
              <div className="liansai"><span className="o">世界杯</span><span className="oo">{"89'"}</span></div>
              <div className="g">VS</div>
              <div className="time">10-16 15:00</div>
            </div>
            <div className="saishiRight">
              <img src="../images/photo.png" />
              <span>科索沃</span>
            </div>
          </div>
        </div>
        <div className="header">
          <span className="on">热门</span>
          <span className="end">专家</span>
        </div>
        <div className="tabs">
          {this.renderTabs()}
        </div>
        {this.renderRecommondList()}
      </Layout>
    )
  }
}
