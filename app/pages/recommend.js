// 申请专家
import Layout from '../components/layout';
import Cookie from '../helper/cookie';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig';
import Toast from '../helper/toast';
import TwoBtnAlert from '../components/twobtnalert';

export default class extends BasePage {
  constructor(props) {
		super(props);
		this.state = {
			freeList: [],
      caidianList: [],
      recState: 'NO',
      showAlert: false
		};
	}

 //  pay(fee, id, ifBuy) {
	// 	window.to('/recodetail?id=' + id);
	// }

  handleCancle() {
    this.setState({
      showAlert: false
    })
  }

  handleSure() {
    this.showLoading(true);
    ApiAction.post(UrlConfig.recommendBuy, {recommendId: this.state.payId, token: Cookie.getCookie("token") || ''});
  }


  pay(fee, id, ifBuy) {
    if (!ifBuy && fee && fee != "0") {
      this.setState({
        showAlert: true,
        alertTitle: "需支付" + fee + CommonConfig.unit + "查看专家推荐<br />(1" + CommonConfig.unit + "=1元)",
        payId: id
      })
    } else {
      window.to('/recommendationdetail?id=' + id);
    }
  }


  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.freeRecommendList:
        if(body && body.success){
          this.setState({
            freeList: body.data
          });
        }else{
          this.setState({
            freeList: []
          });
          Toast.show(body.msg, 'error');
        }
        break;
      case UrlConfig.recommendList:
        if(body && body.success){
          this.setState({
            caidianList: body.data
          });
        }else{
          this.setState({
            caidianList: []
          });
          Toast.show(body.msg, 'error');
        }
        break;
      case UrlConfig.recommendBuy:
        this.setState({
          showAlert: false
        })
        if (body.success) {
          window.to('/recommendationdetail?id=' + this.state.payId);
        } else{
          if(body.msg === "已经买过该推荐了"){
            window.to('/recommendationdetail?id=' + this.state.payId);
          }else{
            Toast.show(body.msg, 'error')
          }
        }
        break;
    }
  }

  getRecommend(type){
    this.showLoading(true);
		var token = Cookie.getCookie("token") || '';
		if(type === 'free'){
      ApiAction.post(UrlConfig.freeRecommendList, {
        token: token,
        state: 'NO'
      });
    }else if(type === 'caidian'){
      ApiAction.post(UrlConfig.recommendList, {
        token: token,
        recommendWay: 'REAL',
        ifOver: 'NO'
      });
    }
  }

  componentDidMount() {
		super.componentDidMount();
		this.showLoading(true);
		this.getRecommend(this.props.type);
	}

  render(){
    var type = this.props.type;
    var titleName = type === 'free' ? '免费推荐' : '彩店实单';

    return (
        <Layout hideBack={false} className={'recommend'} title={titleName}>
          <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
                             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
                             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
          {
            (type === 'free' ? this.state.freeList : this.state.caidianList).map(function(item, index){
              return (
                <TapAble className="specialItem block" key={"s" + index}
      				         onTap={this.pay.bind(this, item.fee, item.id, item.ifBuy)}>
        					<div className="leftPart">
        						<div className="topInfo">
        							<span className="liansai">{item.matchName}</span>
        							<span className="add">{item.betsType}</span>
        							<span className="time">{item.matchDate.substr(5,11)}</span>
        						</div>
        						<div className="bottomInfo">
        							<span className="left">{item.homeTeam}</span>
        							<span className="">VS</span>
        							<span className="right">{item.awayTeam}</span>
        						</div>
        					</div>
        					<div className="rightPart">
        						{this.state.recState == "NO" ? (item.fee && item.fee > 0 ? (item.ifBuy ? "查看" : item.fee + CommonConfig.unit) : "免费") : "免费"}
        					</div>
      				  </TapAble>
              );
            }.bind(this))
          }
        </Layout>
    )
  }
}
