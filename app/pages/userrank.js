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
import Loading from '../helper/loading';

export default class extends BasePage {
  state={
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

  renderItems(){
    return this.state.list.map(function(item, index){
      return (
        <div className="item" key={"i"+index}>
          <span className="ser">{index + 1}</span>
          <img src={item.url ? item.url : '../images/photo.png'} className="photo" />
          <span className="info">
            <span className="name">IT数据</span>
            <span className="desc">金融玩家</span>
          </span>
          <span className="right">
            <img src={item.url ? item.url : '../images/metal.png'} className="metal" />
            <span className="num">3</span>
            <span className="text">场连红</span>
            <img src={item.url ? item.url : '../images/right.png'} className="rightIcon" />
          </span>
        </div>
      )
    }.bind(this));
  }

  render() {
    return (
      <Layout className={'userrank'} title={'红人馆'}>
        <Loading showLoading={this.state.showLoading} />
        {this.renderItems()}
      </Layout>
    )
  }
}
