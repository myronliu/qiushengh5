/**
 * Created by sjzhang on 2016/11/3.
 */
import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import _ from 'immutable';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import TwoBtnAlert from '../components/twobtnalert';
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

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
		if (selectedMatchArray.length === 0) {
			this.setState({
				showAlert: true,
				alertTitle: "请选择赛事！"
			});
			return;
		}
		let validFlag = true;
		selectedMatchArray.map(matchId=> {
			let matchIdObj = deployMatchInfo[matchId];
			if (undefined === matchIdObj) {
				validFlag = false;
			} else {
				let letBallKeys = Object.keys(matchIdObj);
				if (letBallKeys.length === 0) {
					validFlag = false;
				} else {
					let arrayNullFlag = false;
					letBallKeys.map(key=> {
						arrayNullFlag = arrayNullFlag || matchIdObj[key].length > 0;
					});
					validFlag = validFlag && arrayNullFlag;
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

		if (!this.arrayIncludes(selectedMatchArray, matchId)) {
			this.setState({
				showAlert: true,
				alertTitle: "请先选择赛事！"
			});
			return;
		}
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
		return (
			<div className="matchList">
				{
					list.map(function (item, index) {
						return (

							<div className="listItem" key={"select_match_" + index}>
								<div className="teamVsTeam">
									<div className="div1" onTouchEnd={this.selectHandler.bind(this, item.matchId)}>
										<div
											className={selectedMatchArray.join(",").indexOf(item.matchId) != -1 ? "matchSelect selected" : "matchSelect"}/>
									</div>
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
											<div
												className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][0] && this.arrayIncludes(deployMatchInfo[item.matchId][0], 1) ? "topLeft lvSelect" : "topLeft"}
												onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 1, 0)}>
												<span>胜</span>
												<span>{item.oddsS}</span>
											</div>
											<div
												className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][0] && this.arrayIncludes(deployMatchInfo[item.matchId][0], 2) ? "topMiddle lvSelect" : "topMiddle"}
												onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 2, 0)}>
												<span>平</span>
												<span>{item.oddsP}</span>
											</div>
											<div
												className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][0] && this.arrayIncludes(deployMatchInfo[item.matchId][0], 4) ? "topRight lvSelect" : "topRight"}
												onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 4, 0)}>
												<span>负</span>
												<span>{item.oddsF}</span>
											</div>
										</div>
										<div className="div3Bottom">
											<div
												className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][item.handicap] && this.arrayIncludes(deployMatchInfo[item.matchId][item.handicap], 1) ? "bottomLeft lvSelect" : "bottomLeft"}
												onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 1, item.handicap)}>
												<span>胜</span>
												<span>{item.oddsRs}</span>
											</div>
											<div
												className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][item.handicap] && this.arrayIncludes(deployMatchInfo[item.matchId][item.handicap], 2) ? "bottomMiddle lvSelect" : "bottomMiddle"}
												onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 2, item.handicap)}>
												<span>平</span>
												<span>{item.oddsRp}</span>
											</div>
											<div
												className={deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId][item.handicap] && this.arrayIncludes(deployMatchInfo[item.matchId][item.handicap], 4) ? "bottomRight lvSelect" : "bottomRight"}
												onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 4, item.handicap)}>
												<span>负</span>
												<span>{item.oddsRf}</span>
											</div>
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
						)
					}.bind(this))
				}
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

				<div className="matchDesc">
					<span className="dateTime">2016-11-15</span>
					<span className="week">周五</span>
					<span className="desc">11场可投注</span>
				</div>
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
