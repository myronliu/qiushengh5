import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';

export default class extends BasePage {
  state={
    list:[1,2]
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
        <div className="item" key={"reco"+index}>
          <div className="line1">
            <span className="left">徳乙</span>
            <span className="right">10-22 00:30</span>
          </div>
          <div className="line2">
            <span className="left">斯图加特</span>
            <span className="vs">vs</span>
            <span className="right">慕尼黑1860</span>
          </div>
          <div className="line3">
            <div className="left">
              <span className="num">-1</span>
            </div>
            <div className="right">
              <span className="first active">主胜 3.50</span>
              <span className="middle">平局 3.95</span>
              <span className="last">客胜 1.70</span>
            </div>
          </div>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'recodetail'} title={'推荐详情'}>
        {this.renderItems()}
        <div className="img">
          <img src="http://d.5857.com/qingchumein_150817/002.jpg" />
        </div>
      </Layout>
    )
  }
}
