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

const weekMap = {
	1: "周一",
	2: "周二",
	3: "周三",
	4: "周四",
	5: "周五",
	6: "周六",
	0: "周日"
};
class LiveScore extends BasePage {
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

	getUnEnd() {
		this.showLoading(true);
		this.setState({
			recState: "NO"
		});
		this.getMatchList({status: "2"});
		this.intervalId = setInterval(()=> {
			this.getMatchList({status: "2"});
		}, 5000);
	}

	getMatchList(data) {
		let params = {
			...data,
			matchTypes: '',
			token: Cookie.getCookie("token") || ""
		};
		ApiAction.post(UrlConfig.matchList, params);
	}

	apiSuccess(url, body) {
		this.showLoading(false);
		switch (url) {
			case UrlConfig.matchList:
				body = body || [];
				if (body.length > 0) {
					this.setState({
						list: body
					})
				} else {
					this.setState({
						list: []
					})
					Toast.show(body.msg)
				}
				break;
			case UrlConfig.recommendBuy:
				this.setState({
					showAlert: false
				})
				if (body.success) {
					window.to('/recodetail?id=' + this.state.payId);
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

	getEnd() {
		this.showLoading(true);
		this.setState({
			recState: "YES"
		});
		this.getMatchList({status: "5"});
		clearInterval(this.intervalId);
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
		let {list, recState}  = this.state;
		if (recState === "NO") {
			return <div className="liveScoreItems">
				{
					list.map((item, index)=> {
						return this.renderDetailItems(item, index, recState)
					})
				}
			</div>
		} else {
			let lastDate = list[0].matchDate.substring(0, 10);
			let object = {[lastDate]: []};
			list.map(itemInfo=> {
				let date = itemInfo.matchDate.substring(0, 10);
				if (date !== lastDate) {
					object[date] = [];
					lastDate = date;
				}
				object[date].push(itemInfo);
			});
			return Object.keys(object).map((date, index1)=> {
				return <div className="liveScoreItems" key={"liveScoreItems_" + index1}>
					<div className="dateDesc">{date + " " + weekMap[new Date(date).getDay()]}</div>
					{
						object[date].map((item, index)=> {
							return this.renderDetailItems(item, index, recState);
						})
					}
				</div>
			});
		}
	}

	renderDetailItems(item, index, recState) {
		return (
			<div className="matchItem" key={"matchItem_" + index}>
				<div className="matchTitle">
					<span className="week">{item.weekday}</span>
					<span className="bh">{item.bh}</span>
					<span className="desc">{item.matchName}</span>
					<span className="time">{item.matchDate}</span>
				</div>
				<div className="matchBody">
					<div className="bodyLeft">{recState === "NO" ? "未" : "完"}</div>
					<div className="bodyRight">
						<div className="score" style={{color: recState === "NO" ? "#7f8691" : "red"}}>
							<div
								className="scoreTop">{recState === "NO" ? "-" : item.finalScore.split(":")[0]}</div>
							<div
								className="scoreBottom">{recState === "NO" ? "-" : item.finalScore.split(":")[1]}</div>
						</div>
						<div className="team">
							<div className="teamTop">{item.homeTeam}</div>
							<div className="teamBottom">{item.awayTeam}</div>
						</div>
						<div className="result">
							<div className="resultTop">{item.oddsS}</div>
							<div className="resultMiddle">{item.oddsP}</div>
							<div className="resultBottom">{item.oddsF}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<Layout className={'livescore'} title={'比分直播'}>
				<Loading showLoading={this.state.showLoading}/>
				<TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
				             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
				             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>

				<div className="header">
                    <span className={this.state.recState === "NO" ? "active left" : "left"}
                          onTouchEnd={this.getUnEnd.bind(this)}>即时</span>
					<span className={this.state.recState === "YES" ? "active right" : "right"}
					      onTouchEnd={this.getEnd.bind(this)}>完场</span>
				</div>
				{this.renderItems()}
			</Layout>
		)
	}

	componentDidMount() {
		super.componentDidMount();
		this.showLoading(true);
		this.getMatchList({status: "2"});
		this.intervalId = setInterval(()=> {
			this.getMatchList({status: "2"});
		}, 5000);
	}
}

export default LiveScore;
