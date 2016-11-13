import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';
import QsFooter from '../components/qsfooter';

export default class extends BasePage {
  state={
    list: [],
    status:"on",
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.matchList:
        this.setState({
          list: body
        })
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();

    this.showLoading(true)
    ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
  }

  selectOn(){
    this.showLoading(true);
    this.setState({
      status: 'on'
    })
    ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
  }

  selectEnd(){
    this.showLoading(true);
    this.setState({
      status: 'end'
    })
    ApiAction.post(UrlConfig.matchList, {status:5, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
  }

  gotoDetail(id){
    window.to('/hotmatchdetail?id=' + id);
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return(
        <TapAble className="saishi block" key={"hot" + index} onTap={this.gotoDetail.bind(this, item.id)}>
          <div className="bh">{item.bh}</div>
          <div className="saishiLeft">
            <img src={item.homeTeamAvatar ? item.homeTeamAvatar : "../images/photo.png"} />
            <span>{item.homeTeam}</span>
          </div>
          <div className="saishiMiddle">
            <div><span className="o">{item.matchName.length > 3 ? item.matchName.substring(0,3) + '..' : item.matchName}</span><span className="oo">{item.matchDate.length>5?item.matchDate.substring(5):''}</span></div>
            <div className="g">{item.finalScore || 'vs'}</div>
            <div className="">{(item.experts || '0') + '位专家'}</div>
          </div>
          <div className="saishiRight">
            <span>{item.awayTeam}</span>
            <img src={item.awayTeamAvatar ? item.awayTeamAvatar : "../images/photo.png"} />
          </div>
        </TapAble>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout hideBack={true} className={'hotmatch'} title={'热门赛事'}>
        <Loading showLoading={this.state.showLoading} />
        <div className="header">
          <span className={this.state.status === "on" ? "on left" : "end left"} onTouchEnd={this.selectOn.bind(this)}>竞彩</span>
          <span className={this.state.status === "end" ? "on right" : "end right"} onTouchEnd={this.selectEnd.bind(this)}>已结束</span>
        </div>
        {this.renderItems()}
        <div style={{height:'9rem'}}></div>
        <QsFooter page={"saishi"}/>
      </Layout>
    )
  }
}
