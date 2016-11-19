/**
 * Created by sjzhang on 2016/11/3.
 */
import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import TwoBtnAlert from '../components/twobtnalert';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';
// import {Post} from '../http/http';

class MyRecommendation extends BasePage {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			avarurl: '',
			expertname: '',
			detail: '',
			recState: 'NO',
			showAlert: false,
			status: '关注专家'
		};
	}

	componentDidMount() {
		super.componentDidMount();
		this.showLoading(true);
		this.getRecommend({state: "NO"});
	}

	getUnEnd() {
		this.showLoading(true);
		this.setState({
			recState: "NO"
		});
		this.getRecommend({state: "NO"});
	}

	getRecommend(data) {
		this.showLoading(true);
		data = data || {};
		data.token = Cookie.getCookie("token") || '';
		// Post(UrlConfig.myRecommend, data).then((res)=> {
		// 	if (res && res.length > 0) {
		// 		this.setState({
		// 			list: res || [],
		// 		});
		// 	} else {
		// 		this.setState({
		// 			list: [],
		// 		});
		// 	}
		// });

    ApiAction.post(UrlConfig.myRecommend, data);
	}

	apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.myRecommend:
        body=body||[];
        if(body.length > 0){
          this.setState({
            list: body
          })
        }else{
        	this.setState({
        		list: []
        	})
        }
        break;
      case UrlConfig.recommendBuy:
        this.setState({
          showAlert: false
        })
        if(body.success){
          window.to('/recodetail?id=' + this.state.payId);
        }else{
          Toast.show(body.msg, 'error')
        }
        break;
    }
  }

	getEnd() {
		this.showLoading(true);
		this.setState({
			recState: "YES"
		});
		this.getRecommend({state: "YES"});
	}

	pay(fee, id, ifBuy) {
		window.to('/recodetail?id=' + id);
	}

	handleCancle() {
		this.setState({
			showAlert: false
		})
	}

	handleSure() {
		this.showLoading(true)
		ApiAction.post(UrlConfig.recommendBuy, {
			recommendId: this.state.payId,
			token: Cookie.getCookie("token") || ''
		});
	}

	gotoMoreRecommendation() {
		window.to('/lanchrecommendation');
	}

	renderItems() {
		return this.state.list.map(function (item, index) {
			return (
				<TapAble className="specialItem block" key={"s" + index}
				         onTap={this.pay.bind(this, item.fee, item.id, item.ifBuy)}>
					<div className="leftPart">
						<div className="topInfo">
							<span className="liansai">{item.matchName}</span>
							<span className="add">{item.betsType}</span>
							<span className="time">10-10 02:45</span>
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
			)
		}.bind(this));
	}

	render() {
		return (
			<Layout className={'specialinfo'} title={'我的推荐'}>
				<Loading showLoading={this.state.showLoading}/>
				<TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
				             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
				             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
				<div className="tabs">
					<div className={this.state.recState == "NO" ? "active" : "unactive"}
					     onTouchEnd={this.getUnEnd.bind(this)}>未结束
					</div>
					<div className={this.state.recState == "YES" ? "active" : "unactive"}
					     onTouchEnd={this.getEnd.bind(this)}>已结束
					</div>
				</div>
				<div className="items">
					{this.renderItems()}
				</div>
				<div className="deployBtnWap" onTouchEnd={this.gotoMoreRecommendation.bind(this, "mine")}>
					<div className="deployBtn">
						<div className="footer-item">
							<div>新增推荐</div>
						</div>
					</div>
				</div>
			</Layout>
		)
	}
}

export default MyRecommendation;
