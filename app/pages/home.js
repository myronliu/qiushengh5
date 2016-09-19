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
    disabled: false,
    showLoading: false,
    srcc: "/images/xiu.png",
    data: this.props.data
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case this.state.loginurl:
        if(Cookie.getCookie("name")!=this.refs.name.value){
          Cookie.setCookie("name", this.refs.name.value, 1);
          Cookie.setCookie("signed", "", 1);
          Cookie.setCookie("guard1", "", 1);
          Cookie.setCookie("guard2", "", 1);
          Cookie.setCookie("guard3", "", 1);
          Cookie.setCookie("guard4", "", 1);
        }
        Cookie.setCookie("token", body.data, 1);
        window.to('/guanka');
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();
    var socket = io();
    socket.on('message', function(msg){
      // this.setState({
      //   srcc: msg
      // })
      // console.log(msg)
      this.setState({
        data: JSON.parse(msg)
      })
      console.log(JSON.parse(msg))
    }.bind(this));
  }

  renderItems(t, i){
    return this.state.data.content.contentList.map(function(item, index){
      if(index>3) return
      return (
        <div key={index} className="item"  style={{height:i, lineHeight:i}}><span>{(new Date(item.contentinfo[0].date).getMonth() + 1) + '月' + new Date(item.contentinfo[0].date).getDate() + '号'}</span><span className="infoC">{item.match.hostname + '让(－1)' + item.match.guestname + '胜'}</span><span>{item.match.matchstatus == "0" ? "中" : "失"}</span></div>
      )
    }.bind(this))
  }

  // render(){
  //   return null
  // }

            // <div className="item"  style={{height:i, lineHeight:i}}><span>8月12号</span><span>001让(－1)001胜</span><span>中</span></div>
            // <div className="item"  style={{height:i, lineHeight:i}}><span>8月13号</span><span>001让(－1)001胜</span><span>中</span></div>
            // <div className="item"  style={{height:i, lineHeight:i}}><span>8月14号</span><span>001让(－1)001胜</span><span>中</span></div>

  render() {
    var t = '';
    var i = '';
    var h = '';
    if(process.browser){
      t = document.body.clientHeight * 0.35 / 5 * 1.5 + 'px';
      i = document.body.clientHeight * 0.35 / 5 * 0.8 + 'px';
      h = document.body.clientHeight - 20 * (document.body.clientHeight / 640)
    }
    return (
      <div className="home">
        <div className="top">{'当前时间' + this.state.data.time}</div>
        <div className="sss" style={{height: h}}>
          <div className="lefttop">
            <div className="content">
              <div className="title" style={{height:t,lineHeight:t}}>今日推荐</div>
              <div className="item"  style={{height:i,lineHeight:i}}><span>001让(－1)001胜</span><span>中</span></div>
              <div className="item"  style={{height:i,lineHeight:i}}><span>002让(－1)002胜</span><span>中</span></div>
              <div className="item"  style={{height:i,lineHeight:i}}><span>003让(－1)003胜</span><span>中</span></div>
            </div>
          </div>
          <div className="righttop">
            <div className="content">
              <div className="title" style={{height:t, lineHeight:t}}>数据分析</div>
              <div className="item"  style={{height:i, lineHeight:i}}><span style={{backgroundColor: '#00ac00'}}>日本乙级联赛</span><span>8月11号</span><span>001让(－1)001胜</span><span>中</span></div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>欧罗巴联赛</span><span>8月11号</span><span>001让(－1)001胜</span><span>中</span></div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>欧罗巴联赛</span><span>8月11号</span><span>001让(－1)001胜</span><span>中</span></div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>欧罗巴联赛</span><span>8月11号</span><span>001让(－1)001胜</span><span>中</span></div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>欧罗巴联赛</span><span>8月11号</span><span>001让(－1)001胜</span><span>中</span></div>
            </div>
          </div>
          <div className="leftbottom">
            <div className="content">
              <div className="title" style={{height:t, lineHeight:t}}>历史推荐</div>
              {
                this.renderItems(t,i)
              }
            </div>
          </div>
          <div className="rightbottom">
            <div className="content">
              <div className="title" style={{height:t*0.8, lineHeight:t*0.8}}>极限追踪</div>
              <div className="info">连平  →</div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>8月11号</span><span>001让(－1)001胜</span><span>中</span></div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>8月12号</span><span>001让(－1)001胜</span><span>中</span></div>
              <div className="info">连负  →</div>
              <div className="item"  style={{height:i, lineHeight:i}}><span>8月14号</span><span>001让(－1)001胜</span><span>中</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}