/**
 * Created by sjzhang on 2016/11/3.
 */
import Layout from '../components/layout'
import TapAble from 'react-tappable';
import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import _ from 'immutable';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import TwoBtnAlert from '../components/twobtnalert';
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

const weekMap = {
	1: "周一",
	2: "周二",
	3: "周三",
	4: "周四",
	5: "周五",
	6: "周六",
	0: "周日"
};
class SelectMatch extends BasePage {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			showAlert: false,
			alertTitle: "",
			selectedMatchArray: [],
			deployMatchInfo: {}

		};
	}

	componentDidMount() {
		super.componentDidMount();
		this.showLoading(true);
		let token = Cookie.getCookie("token") || "";
		let data = {
			status: 1,
			matchTypes: '',
			token: token
		};
		ApiAction.post(UrlConfig.matchList, data);
	}


	getRecommend(data) {
		this.showLoading(true);
		data = data || {};
		data.token = Cookie.getCookie("token") || '';

		ApiAction.post(UrlConfig.myRecommend, data);
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
					});
					Toast.show(body.msg)
				}
				break;
		}
	}


	gotoLanchRecommendation() {
		let {selectedMatchArray, deployMatchInfo}=this.state;
		// if (selectedMatchArray.length === 0) {
		// 	this.setState({
		// 		showAlert: true,
		// 		alertTitle: "请选择赛事！"
		// 	});
		// 	return;
		// }
		// let validFlag = true;
		// selectedMatchArray.map(matchId=> {
		// 	let matchIdObj = deployMatchInfo[matchId];
		// 	if (undefined === matchIdObj) {
		// 		validFlag = false;
		// 	} else {
		// 		let letBallKeys = Object.keys(matchIdObj);
		// 		if (letBallKeys.length === 0) {
		// 			validFlag = false;
		// 		} else {
		// 			let arrayNullFlag = false;
		// 			letBallKeys.map(key=> {
		// 				arrayNullFlag = arrayNullFlag || matchIdObj[key].length > 0;
		// 			});
		// 			validFlag = validFlag && arrayNullFlag;
		// 		}
		// 	}
		// });

		let matchIdKeys = Object.keys(deployMatchInfo);
		if (matchIdKeys.length === 0) {
			this.setState({
				showAlert: true,
				alertTitle: "请选择胜率！"
			});
			return;
		}
		// console.log(matchIdKeys.length)
		let validFlag = false;
		matchIdKeys.map(matchId=> {
			let matchIdObj = deployMatchInfo[matchId];
			// console.log("matchIdObj", matchIdObj)
			if (undefined === matchIdObj) {
				// validFlag = false;
				// console.log("undefined === matchIdObj", undefined === matchIdObj)
			} else {
				let letBallKeys = Object.keys(matchIdObj);
				// console.log("letBallKeys", letBallKeys)
				if (letBallKeys.length === 0) {
					// validFlag = false;
					// console.log("letBallKeys.length", letBallKeys.length)
				} else {
					letBallKeys.map(key=> {
						validFlag = validFlag || matchIdObj[key].length > 0;
					});
				}
			}
		});

		if (!validFlag) {
			this.setState({
				showAlert: true,
				alertTitle: "请选择胜率！"
			});
			return;
		}
		// console.log("deployMatchInfo",deployMatchInfo)
		window.sessionStorage.setItem("selectedMatchData", JSON.stringify({selectedMatchArray, deployMatchInfo}));
		window.to('/lanchrecommendation');
	}

	selectHandler(matchId) {
		let preState = _.fromJS(this.state).toJS();
		let {selectedMatchArray} = preState;

		if (this.arrayIncludes(selectedMatchArray, matchId)) {
			selectedMatchArray = selectedMatchArray.filter(id=>id !== matchId);
		} else {
			selectedMatchArray.push(matchId);
		}
		preState.selectedMatchArray = selectedMatchArray;
		this.setState(preState);
	}

	selectTypeHandler(matchId, type, letBall) {
		let preState = _.fromJS(this.state).toJS();
		let {selectedMatchArray, deployMatchInfo} = preState;

		// if (!this.arrayIncludes(selectedMatchArray, matchId)) {
		// 	this.setState({
		// 		showAlert: true,
		// 		alertTitle: "请先选择赛事！"
		// 	});
		// 	return;
		// }
		deployMatchInfo[matchId] = deployMatchInfo[matchId] || {};
		deployMatchInfo[matchId][letBall] = deployMatchInfo[matchId][letBall] || [];
		if (this.arrayIncludes(deployMatchInfo[matchId][letBall], type)) {
			deployMatchInfo[matchId][letBall] = deployMatchInfo[matchId][letBall].filter(letBall=>letBall !== type);
		} else {
			deployMatchInfo[matchId][letBall].push(type);
		}
		if (deployMatchInfo[matchId][letBall].length > 2) {
			deployMatchInfo[matchId][letBall].shift();
		}
		preState.deployMatchInfo = deployMatchInfo;
		console.log(preState.deployMatchInfo);
		this.setState(preState);
	}

	renderItems() {
		let {list, selectedMatchArray, deployMatchInfo} = this.state;
		if (!list[0]) {
			return;
		}

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
			return <div className="matchList" key={"matchList_" + index1}>
				<div className="matchDesc">
					<span className="dateTime">{date}</span>
					<span className="week">{weekMap[new Date(date).getDay()]}</span>
					<span className="desc">{object[date].length + "场可投注"}</span>
				</div>
				{
					object[date].map((item, index)=> {
						return this.renderDetailItems(item, index, deployMatchInfo, selectedMatchArray);
					})
				}
			</div>
		});
	}

	renderDetailItems(item, index, deployMatchInfo, selectedMatchArray) {
		return (

			<div className="listItem" key={"select_match_" + index}>
				<div className="teamVsTeam">
					{/*<div className="div1" onTouchEnd={this.selectHandler.bind(this, item.matchId)}>
					 <div
					 className={selectedMatchArray.join(",").indexOf(item.matchId) != -1 ? "matchSelect selected" : "matchSelect"}/>
					 </div>*/}
					<div className="div2">
					</div>
					<div className="div3">
						<div className="topLeft">
							<span>{item.homeTeam}</span>
						</div>
						<div className="topMiddle">
							<span>vs</span>
						</div>
						<div className="topRight">
							<span>{item.awayTeam}</span>
						</div>
					</div>
					<div className="div4">
					</div>
				</div>
				<div className="itemDetail">
					<div className="div1">
						<div className="div1Top">{item.matchName}</div>
						<div className="div2middle">{item.bh}</div>
						<div className="div3Bottom">00:00截止</div>
					</div>
					<div className="div2">
						<div className="div2Top">0</div>
						<div
							className={item.handicap == -1 ? "div2Bottom lessOne" : "div2Bottom addOne"}>{item.handicap}</div>
					</div>
					<div className="div3">
						<div className="div3Top">
							<TapAble
								className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][0] && this.arrayIncludes(deployMatchInfo[item.matchId][0], 1) ? "touchDiv topLeft lvSelect" : "touchDiv topLeft"}
								onTap={this.selectTypeHandler.bind(this, item.matchId, 1, 0)}>
								<span>胜</span>
								<span>{item.oddsS}</span>
							</TapAble>
							<TapAble
								className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][0] && this.arrayIncludes(deployMatchInfo[item.matchId][0], 2) ? "touchDiv topMiddle lvSelect" : "touchDiv topMiddle"}
								onTap={this.selectTypeHandler.bind(this, item.matchId, 2, 0)}>
								<span>平</span>
								<span>{item.oddsP}</span>
							</TapAble>
							<TapAble
								className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][0] && this.arrayIncludes(deployMatchInfo[item.matchId][0], 4) ? "touchDiv topRight lvSelect" : "touchDiv topRight"}
								onTap={this.selectTypeHandler.bind(this, item.matchId, 4, 0)}>
								<span>负</span>
								<span>{item.oddsF}</span>
							</TapAble>
						</div>
						<div className="div3Bottom">
							<TapAble
								className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][item.handicap] && this.arrayIncludes(deployMatchInfo[item.matchId][item.handicap], 1) ? "touchDiv bottomLeft lvSelect" : "touchDiv bottomLeft"}
								onTap={this.selectTypeHandler.bind(this, item.matchId, 1, item.handicap)}>
								<span>胜</span>
								<span>{item.oddsRs}</span>
							</TapAble>
							<TapAble
								className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][item.handicap] && this.arrayIncludes(deployMatchInfo[item.matchId][item.handicap], 2) ? "touchDiv bottomMiddle lvSelect" : "touchDiv bottomMiddle"}
								onTap={this.selectTypeHandler.bind(this, item.matchId, 2, item.handicap)}>
								<span>平</span>
								<span>{item.oddsRp}</span>
							</TapAble>
							<TapAble
								className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][item.handicap] && this.arrayIncludes(deployMatchInfo[item.matchId][item.handicap], 4) ? "touchDiv bottomRight lvSelect" : "touchDiv bottomRight"}
								onTap={this.selectTypeHandler.bind(this, item.matchId, 4, item.handicap)}>
								<span>负</span>
								<span>{item.oddsRf}</span>
							</TapAble>
						</div>
					</div>
					<div className="div4">
						{/*<div className="div4Wap">
						 <div>展开</div>
						 <div>全部</div>
						 </div>*/}
					</div>
				</div>

			</div>
		);
	}

	render() {
		let rightBtn = {title: '确定', func: this.gotoLanchRecommendation.bind(this)};
		return (
			<Layout className={'selectmatch'} title={'选择赛事'} rightItems={[rightBtn]}>
				<Loading showLoading={this.state.showLoading}/>
				<TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
				             secondBtnTitle={"确定"}
				             firstBtnOnTouchEnd={()=>this.setState({showAlert: false})}
				             secondBtnOnTouchEnd={()=>this.setState({showAlert: false})}>
				</TwoBtnAlert>


				{
					this.renderItems()
				}

			</Layout>
		)
	}

	arrayIncludes(array, str) {
		return array.join(",").indexOf(str) != -1;
	}
}

export default SelectMatch;
