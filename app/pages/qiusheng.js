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
import ReactSwipe from '../components/swiper/react-swipe.js';
import HomeBanner from '../components/HomeBanner.js';

export default class extends BasePage {
  state={
    data:{
      topBanners:[
        {
          image: 'http://7xlnmo.com1.z0.glb.clouddn.com/145396576168090468692267313600',
          type: 0,
        },
        {
          image: 'http://7xlnmo.com1.z0.glb.clouddn.com/145396645627348451797384768730',
          type: 0,
        }
      ],
    },
    specialist:[1,2,3,4,5,6,7,8,9,10,11,12],
    recList: [1,2,3,4,5,6]
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

  renderBanner(){
    if(this.state.data&&this.state.data.topBanners){
      var count=this.state.data.topBanners.length;
      if(!process.browser&&count>0){
        var item=this.state.data.topBanners[0];
        return <HomeBanner data={item} count={count}/>
      }else{
        return this.state.data.topBanners.map(function(item,i){
          return <HomeBanner key={i} data={item} count={count}/>
        }.bind(this));
      }
    }
  }

  rendScrolBanner(){
    if(this.state.data&&this.state.data.topBanners){
      return <ReactSwipe continuous={true} speed={400} auto={2000}>
          {this.renderBanner()}</ReactSwipe>
    }
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="specialItem" key={"s"+index}>
          <div className="img">
            <img src={item.url} className="" />
          </div>
          <div className="name">
            {item.name}
          </div>
        </div>
      )
    }.bind(this));
  }

  renderSpecialist(){
    return this.state.specialist.map(function(item, index){
      return(
        <div className="specialItem" key={"s"+index}>
          <img src={item.url ? item.url : '../images/photo.png'} className="" />
          <div className="name">
            {item.name ? item.name : '专家'}
          </div>
        </div>
      )
    }.bind(this));
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
        </div>
      )
    }.bind(this))
  }

  render() {
    return (
      <Layout hideBack={true} className={'qiusheng'} title={'首页'}>
        {this.rendScrolBanner()}
        <div>
          <div className="topInfo">
            <span className="title">{"足球赛事"}</span>
            <span className="link">{"全部赛事>"}</span>
          </div>
          <div className="saishi">
            <div className="saishiLeft">
              <img src="../images/photo.png" />
              <span>乌克兰</span>
            </div>
            <div className="saishiMiddle">
              <div className="o">世界杯</div>
              <div className="g">1:0</div>
              <div className="">12位专家</div>
            </div>
            <div className="saishiLeft">
              <span>科索沃</span>
              <img src="../images/photo.png" />
            </div>
          </div>
        </div>
        <div className="hongrenbang">
          <span className="leftInfo">竞彩红人榜</span>
          <span className="middleInfo"></span>
          <span className="rightInfo">{">"}</span>
        </div>
        <div className="specialist marginTop07rem">
          <div className="topInfo">
            <span className="title">{"竞彩专家"}</span>
            <span className="link">{"更多>"}</span>
          </div>
          {this.renderSpecialist()}
        </div>
        <div className="recList marginTop07rem">
          <div className="topInfo">
            <span className="title">{"最新推荐"}</span>
            <span className="link">{"推荐有风险 投注请谨慎"}</span>
          </div>
          {this.renderRecommondList()}
        </div>
      </Layout>
    )
  }
}
