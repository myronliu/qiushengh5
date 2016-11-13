import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import NextButton from '../components/nextbutton';
import Input from '../components/Input';
import TitleInput from '../components/titleinput';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage';
import ReactSwipe from '../components/swiper/react-swipe';
import HomeBanner from '../components/HomeBanner';
import Loading from '../helper/loading';
import TwoBtnAlert from '../components/twobtnalert';
import TapAble from 'react-tappable';
import QsFooter from '../components/qsfooter';

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
    banners:[],
    specialist:[],
    recList: [],
    showAlert: false
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
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
    if(this.props.token){
      Cookie.setCookie("token", this.props.token, 7);
    }
    $("#scrollDiv").Scroll({line:1,speed:500,timer:3000,up:"but_up",down:"but_down"});
  }

  componentWillMount(){
    // console.log(this.props.data)
    if(this.props.data && this.props.data.expert && this.props.data.expert.length>0){
      if(this.props.data.expert.length % 4 === 1){
        this.props.data.expert.push({})
        this.props.data.expert.push({})
        this.props.data.expert.push({})
      }else if(this.props.data.expert.length % 4 === 2){
        this.props.data.expert.push({})
        this.props.data.expert.push({})
      }else if(this.props.data.expert.length % 4 === 3){
        this.props.data.expert.push({})
      }
    }
    this.setState({
      banners: this.props.data.banner || [],
      specialist: this.props.data.expert || [],
      recList: this.props.data.recommend || []
    })

  }

  pay(fee, id, ifBuy){
    if(!ifBuy && fee && fee != "0"){
      this.setState({
        showAlert: true,
        alertTitle: "需支付" + fee  + CommonConfig.unit + "查看专家推荐<br />(1" + CommonConfig.unit + "=1元)",
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

  gotoSpecial(id){
    if(id !== null){
      window.to('/specialinfo?id=' + id)
    }
  }

  gotoSpecialist(){
    window.to('/specialist')
  }

  gotoHotmatch(){
    window.to('/hotmatch')
  }

  gotoHots(){
    window.to('/userrank')
  }

  renderBanner(){
    var count=this.state.banners.length;
    if(!process.browser&&count>0){
      var item=this.state.banners[0];
      return <HomeBanner data={item} count={count}/>
    }else{
      return this.state.banners.map(function(item,i){
        item.image = item.url;
        return <HomeBanner key={i} data={item} count={count}/>
      }.bind(this));
    }
  }

  rendScrolBanner(){
      return <ReactSwipe continuous={true} speed={400} auto={2000}>
          {this.renderBanner()}</ReactSwipe>
  }

  renderItems(){
    if(this.state.list instanceof Array){
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
  }

  renderSpecialist(){
    if(this.state.specialist instanceof Array){
      return this.state.specialist.map(function(item, index){
        return(
            <TapAble className="specialItem" key={"s"+index} onTap={this.gotoSpecial.bind(this, item.id)}>
              <img src={item.avatar ? item.avatar : '../images/photo.png'} className="" />
              <div className="name">
                {item.name ? item.name : '虚位以待'}
              </div>
            </TapAble>
        )
      }.bind(this));
    }
  }

  renderRecommondList(){
    if(this.state.recList instanceof Array){
      return this.state.recList.map(function(item, index){
        return(
          <div className="recItem" key={"rec" + index}>
            <TapAble className="specialInfo" onTap={this.gotoSpecial.bind(this, item.expert.id)}>
              <img src={item.expert.avatar ? item.expert.avatar : "../images/photo.png"} />
              <div className="textInfo">
                <div className="tTitle">{item.expert.name}</div>
                <div className="tDesc">{item.expert.title}</div>
              </div>
            </TapAble>
            <div className="saishiItem" key={"s"+index} >
              <TapAble onTap={this.pay.bind(this, item.recommend.fee, item.recommend.id, item.recommend.ifBuy)}>
                <div className="leftPart">
                  <div className="sTopInfo">
                    <span className="liansai">{item.recommend.matchName}</span>
                    <span className="add">{item.recommend.betsType}</span>
                    <span className="time">{item.recommend.matchDate}</span>
                  </div>
                  <div className="bottomInfo">
                    <span className="left">{item.recommend.homeTeam}</span>
                    <span className="">VS</span>
                    <span className="right">{item.recommend.awayTeam}</span>
                  </div>
                </div>
                <div className="rightPart">
                  {item.recommend.fee > 0 ? (item.recommend.ifBuy ? "查看" : (item.recommend.fee  + CommonConfig.unit)) : ("免费")}
                </div>
              </TapAble>
            </div>
          </div>
        )
      }.bind(this))
    }
  }

  renderHots(){
    return this.props.data.hots.map(function(item, index){
      return(
        <li key={"li"+index}>
          <span className="leftInfo">竞彩红人榜</span>
          <span className="middleInfo">{item.name}</span>
          <span className="rightInfo">{">"}</span>
          <span className="numInfo">{item.hits}</span>
        </li>
      )
    })
  }

  render() {
    return (
      <Layout hideBack={true} className={'qiusheng'} title={'首页'}>
        <Loading showLoading={this.state.showLoading} />
        <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"} secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)} secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
        {this.rendScrolBanner()}
        <div>
          <div className="topInfo">
            <span className="title">{"足球赛事"}</span>
            <span className="link" onTouchEnd={this.gotoHotmatch.bind(this)}>{"全部赛事>"}</span>
          </div>
          <div className="saishi">
            <div className="saishiLeft">
              <img src={this.props.data.match.homeTeamAvatar ? this.props.data.match.homeTeamAvatar : "../images/photo.png"} />
              <span>{this.props.data.match.homeTeam}</span>
            </div>
            <div className="saishiMiddle">
              <div className="o">{this.props.data.match.matchName}</div>
              <div className="g">{this.props.data.match.finalScore ? this.props.data.match.finalScore : 'vs'}</div>
              <div className="">{(this.props.data.match.experts || '0') + '位专家'}</div>
            </div>
            <div className="saishiLeft">
              <span>{this.props.data.match.awayTeam}</span>
              <img src={this.props.data.match.awayTeamAvatar ? this.props.data.match.awayTeamAvatar : "../images/photo.png"} />
            </div>
          </div>
        </div>
        <TapAble className="hongrenbang block" onTap={this.gotoHots.bind(this)}>
          <div id="scrollDiv" className="scrolldivs">
            <ul className="scrollul">
              {this.renderHots()}
            </ul>
          </div>
        </TapAble>
        
        <div className="recList marginTop07rem">
          <div className="topInfo">
            <span className="title">{"最新推荐"}</span>
            <span className="link">{"推荐有风险 投注请谨慎"}</span>
          </div>
          {this.renderRecommondList()}
        </div>
        <div className="specialistHome marginTop07rem">
          <div className="topInfo">
            <span className="title">{"竞彩专家"}</span>
            <span className="link" onTouchEnd={this.gotoSpecialist.bind(this)}>{"更多>"}</span>
          </div>
          {this.renderSpecialist()}
        </div>
        <div style={{height:'9rem'}}></div>
        <QsFooter page={"home"}/>
      </Layout>
    )
  }
}
