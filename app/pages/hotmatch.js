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

  render() {
    return (
      <Layout className={'hotmatch'} title={'热门赛事'}>
        <Loading showLoading={this.state.showLoading} />
        <div className="header">
          <span className="on">竞彩</span>
          <span className="end">已结束</span>
        </div>
        <div className="saishi">
          <div className="saishiLeft">
            <img src="../images/photo.png" />
            <span>乌克兰</span>
          </div>
          <div className="saishiMiddle">
            <div><span className="o">世界杯</span><span className="oo">{"89'"}</span></div>
            <div className="g">1:0</div>
            <div className="">12位专家</div>
          </div>
          <div className="saishiRight">
            <span>科索沃</span>
            <img src="../images/photo.png" />
          </div>
        </div>
        <div className="saishi">
          <div className="saishiLeft">
            <img src="../images/photo.png" />
            <span>乌克兰</span>
          </div>
          <div className="saishiMiddle">
            <div><span className="o">世界杯</span><span className="oo">10-16 21:00</span></div>
            <div className="g">1:0</div>
            <div className="">12位专家</div>
          </div>
          <div className="saishiRight">
            <span>科索沃</span>
            <img src="../images/photo.png" />
          </div>
        </div>
      </Layout>
    )
  }
}
