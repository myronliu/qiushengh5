import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

export default class extends BasePage {
  state={
    list:[],
    pic:''
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.recommendDetail:
        body=body||{};
        if(body.success){
          body.data = body.data || {};
          body.data.detail = body.data.detail || {};
          body.data.matches = body.data.matches || [];
          this.setState({
            list: body.data.matches,
            pic: body.data.detail.picUrl || ''
          })
        }else{
          Toast.show(body.msg, 'error')
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
    ApiAction.post(UrlConfig.recommendDetail, {recommendId: this.props.id, token: Cookie.getCookie("token") || ''});
  }

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="item" key={"reco"+index}>
          <div className="line1">
            <span className="left">{item.matchName}</span>
            <span className="right">{item.matchDate}</span>
          </div>
          <div className="line2">
            <span className="left">{item.homeTeam}</span>
            <span className="vs">vs</span>
            <span className="right">{item.awayTeam}</span>
          </div>
          <div className="line3">
            <div className="left">
              <span className="num">{item.letBalls}</span>
            </div>
            <div className="right">
              <span className={"first" + (item.result & 1 ? " active" : "")}>{'主胜 ' + item.oddsS}</span>
              <span className={"middle" + (item.result & 2 ? " active" : "")}>{'平局 ' + item.oddsP}</span>
              <span className={"last" + (item.result & 4 ? " active" : "")}>{'客胜 ' + item.oddsF}</span>
            </div>
          </div>
        </div>
      )
    }.bind(this));
  }

  renderPics(){
    var pics = this.state.pic.split(',');
    return pics.map(function(item, index){
      return <img key={"recimg" + index} src={item} />
    }.bind(this))
  }

  render() {
    return (
      <Layout className={'recodetail'} title={'推荐详情'}>
        <Loading showLoading={this.state.showLoading} />
        {this.renderItems()}
        <div className="img">
          {this.renderPics()}
        </div>
      </Layout>
    )
  }
}
