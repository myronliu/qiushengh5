/**
 * Created by sjzhang on 2016/11/3.
 */
import Layout from '../components/layout'

import TwoBtnAlert from '../components/twobtnalert';
import _ from 'immutable';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';
import ApiAction from '../actions/apiaction';
import Cookie from '../helper/cookie';
import {Post} from '../http/http';

class MoreRecommendation extends BasePage {
	constructor(props) {
		super(props);
		this.state = {
			list: [],
			showAlert: false,
			alertTitle: "",
			showWarnAlert: false,
			alertWarnTitle: "",
			selectedMatchArray: [],
			sureSelectedArray: [],
			deployMatchInfo: {},
			fee: -1,
			content: ""
		};
	}


	getMatchList(data) {
		this.showLoading(false);
		Post("/api/" + UrlConfig.matchList, data).then((res)=> {
			this.setState({
				list: res || [],
			});
		})
		
    // data.token = Cookie.getCookie("token") || "";
    // ApiAction.post(UrlConfig.matchList, data);
	}

	apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.matchList:
        body=body||[];
        if(body.length > 0){
          this.setState({
            list: body
          })
        }else{
          this.setState({
            list: []
          })
          Toast.show(body.msg)
        }
        break;
      case UrlConfig.deployRecommendation:
      	if (body.success) {
          this.setState({
            showWarnAlert: true,
            alertWarnTitle: "发布成功！",
            selectedMatchArray: [],
            sureSelectedArray: [],
            deployMatchInfo: {},
            fee: -1,
            content: ""
          });
        } else {
          this.setState({
            showWarnAlert: true,
            alertWarnTitle: "网络出错，请重新发布！"
          });
        }
        break;
    }
  }

	handleCancle() {
		this.setState({
			showAlert: false,
			// selectedMatchArray: []
		})
	}

	handleSure() {
		let preState = _.fromJS(this.state).toJS();
		let {selectedMatchArray, list}= preState;
		preState.deployMatchInfo = {};
		list.map(matchItem=> {
			if (selectedMatchArray.join(",").indexOf(matchItem.matchId)!==-1) {
				preState.deployMatchInfo[matchItem.matchId] = {};
				preState.deployMatchInfo[matchItem.matchId]["letBall"] = [0, matchItem.handicap];
				preState.deployMatchInfo[matchItem.matchId]["selectType"] = {0: [], [matchItem.handicap]: []};
			}
		});
		preState.showAlert = false;
		preState.sureSelectedArray = selectedMatchArray;
		this.setState(preState);
	}

	deleteHandler(matchId, letBall) {
		let preState = _.fromJS(this.state).toJS();
		preState.deployMatchInfo[matchId]["letBall"] = preState.deployMatchInfo[matchId]["letBall"].filter(letBallId=>letBallId !== letBall);
		this.setState(preState);
	}

	selectTypeHandler(matchId, type, letBall) {
		let preState = _.fromJS(this.state).toJS();
		let selectType = preState.deployMatchInfo[matchId]["selectType"];
		let array = selectType[letBall];
		if (array.join(",").indexOf(type)!==-1) {
			array = array.filter(t=>t !== type);
		} else {
			array.push(type);
		}
		if (array.length > 2) {
			array.shift();
		}
		selectType[letBall] = array;
		preState.deployMatchInfo[matchId]["selectType"] = selectType;
		this.setState(preState);
	}

	getMoreRecommendation() {
		this.setState({
			showAlert: true,
			alertTitle: "推荐赛事"
		})
	}

	selectHandler(matchId) {
		let {selectedMatchArray} = this.state;
		let array = _.fromJS(selectedMatchArray).toJS();
		if (array.join(",").indexOf(matchId)!==-1) {
			array = array.filter(id=>id !== matchId);
		} else {
			array.push(matchId);
		}
		this.setState({selectedMatchArray: array});
	}

	deployRecommendation() {
		let {deployMatchInfo, fee, content} = this.state;

		let matchIdArray = Object.keys(deployMatchInfo);

		if (matchIdArray.length === 0) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请选择推荐赛事！"
			});
			return;
		}
		if (fee === -1 || content.trim() === "") {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请填写推荐信息！"
			});
			return;
		}

		let deployMatchIds = [];
		let deployLetBalls = [];
		let deployResults = [];
		let winLvFlagWrong = false;
		matchIdArray.map(matchId=> {
			let letBallArray = deployMatchInfo[matchId]["letBall"];
			if (letBallArray.length !== 0) {
				let selectTypeArray = deployMatchInfo[matchId]["selectType"];
				letBallArray.map(leBall=> {
					if (selectTypeArray[leBall].length === 0) {
						winLvFlagWrong = true;
						return;
					}
					let resultSum = selectTypeArray[leBall].reduce((a, b)=>a + b);
					deployMatchIds.push(matchId);
					deployLetBalls.push(leBall);
					deployResults.push(resultSum);
				});
			}
		});
		if (winLvFlagWrong) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请选择胜率！"
			});
			return;
		}
		if (deployMatchIds.length === 0) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请选择推荐赛事！"
			});
			return;
		}
    	ApiAction.post(UrlConfig.deployRecommendation, {
			content: content,
			fee: fee,
			matchIds: deployMatchIds.join(","),
			letBalls: deployLetBalls.join(","),
			results: deployResults.join(","),
			token: Cookie.getCookie("token") || ''
		});

		// alert(deployMatchIds.join(","))

		// Post(UrlConfig.deployRecommendation, {
		// 	content: content,
		// 	fee: fee,
		// 	matchIds: deployMatchIds.join(","),
		// 	letBalls: deployLetBalls.join(","),
		// 	results: deployResults.join(",")
		// }).then((res)=> {
		// 	if (res.success) {
		// 		this.setState({
		// 			showWarnAlert: true,
		// 			alertWarnTitle: "发布成功！",
		// 			selectedMatchArray: [],
		// 			sureSelectedArray: [],
		// 			deployMatchInfo: {},
		// 			fee: -1,
		// 			content: ""
		// 		});
		// 		this.showLoading(false);
		// 	} else {
		// 		this.setState({
		// 			showWarnAlert: true,
		// 			alertWarnTitle: "网络出错，请重新发布！"
		// 		});
		// 		this.showLoading(false);
		// 	}
		// });
	}

	renderItems(list) {
    // if(process.browser){
    //   alert('renderItems')
    // }
		return list.map(function (item, index) {
			return (
				<TapAble className="saishi block" key={"hot" + index}
				         onTap={this.selectHandler.bind(this, item.matchId)}>
					<div
						className={this.state.selectedMatchArray.join(",").indexOf(item.matchId)!==-1 ? "matchWap selected" : "matchWap"}>
						<div className="item itemLeft">
							<img src={item.homeTeamAvatar ? item.homeTeamAvatar : "../images/photo.png"}/>
							<span>{item.homeTeam}</span>
						</div>
						<div className="item itemMiddle">
							<div><span
								className="o">{item.matchName.length > 3 ? item.matchName.substring(0, 3) + '..' : item.matchName}</span>
							</div>
							<div className="g">{item.finalScore || 'vs'}</div>
							<div className=""><span
								className="oo">{item.matchDate.length > 5 ? item.matchDate.substring(5) : ''}</span>
							</div>
						</div>
						<div className="item itemRight">
							<span>{item.awayTeam}</span>
							<img src={item.awayTeamAvatar ? item.awayTeamAvatar : "../images/photo.png"}/>
						</div>
					</div>
				</TapAble>
			)
		}.bind(this));
	}

	renderDetailMatch() {
		let {sureSelectedArray, list, deployMatchInfo} = this.state;
		return list.filter(item=>sureSelectedArray.join(",").indexOf(item.matchId)!==-1)
			.map(function (item, index) {
				return (
					<div className="itemMatchWap" key={"recommendation" + index}>
						{
							deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId]["letBall"] && deployMatchInfo[item.matchId]["letBall"].map((letBall, index)=> {
								return this.renderMatch(item, letBall, index)
							})
						}
					</div>
				)
			}.bind(this));
	}

	renderMatch(item, letBall, index) {
		let {deployMatchInfo} = this.state;
		return <div className="itemMatch" key={index}>
			<div className="line1">
				<span className="left">{item.matchName}</span>
				{/*{<span className="money">1粒米</span>}*/}
				<span className="right">{item.matchDate}</span>
			</div>
			<div className="line2">
				<span className="left">{item.homeTeam}</span>
				<span className="vs">vs</span>
				<span className="right">{item.awayTeam}</span>
			</div>
			<div className="line3">
				<div className="left">
					<span className="num">{letBall ? item.handicap : 0}</span>
				</div>
				<div className="right">
					<span onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 1, letBall)}
					      className={"first" + (deployMatchInfo[item.matchId]["selectType"][letBall].join(",").indexOf(1)!==-1 ? " selected" : "")}>{'主胜 ' + (letBall ? item.oddsRs : item.oddsS)}</span>
					<span onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 2, letBall)}
					      className={"middle" + (deployMatchInfo[item.matchId]["selectType"][letBall].join(",").indexOf(2)!==-1 ? " selected" : "")}>{'平局 ' + (letBall ? item.oddsRp : item.oddsP)}</span>
					<span onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 4, letBall)}
					      className={"last" + (deployMatchInfo[item.matchId]["selectType"][letBall].join(",").indexOf(4)!==-1 ? " selected" : "")}>{'客胜 ' + (letBall ? item.oddsRf : item.oddsF)}</span>
				</div>
			</div>
			<div className="deleteBtn" onTouchEnd={this.deleteHandler.bind(this, item.matchId, letBall)}>删除</div>
		</div>
	}


	render() {
		let {selectedMatchArray, list, content, fee} = this.state;
		return (
			<Layout className='hotmatch' title={'新增推荐'}>
				<Loading showLoading={this.state.showLoading}/>
				<div className="newAddAlert">
					<TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
					             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
					             secondBtnOnTouchEnd={this.handleSure.bind(this)}>
						<div>{this.renderItems(list)}</div>
					</TwoBtnAlert>
				</div>
				<TwoBtnAlert show={this.state.showWarnAlert} title={this.state.alertWarnTitle} firstBtnTitle={"取消"}
				             secondBtnTitle={"确定"}
				             firstBtnOnTouchEnd={()=>this.setState({showWarnAlert: false})}
				             secondBtnOnTouchEnd={()=>this.setState({showWarnAlert: false})}>
				</TwoBtnAlert>
				<div className="newAddItemWap">

					<div className="newAddItem newAddBtn"
					     onTouchEnd={this.getMoreRecommendation.bind(this)}>
						<div>选择赛事</div>
					</div>
					{this.renderDetailMatch(this.state.list.filter(item=>selectedMatchArray.join(",").indexOf(item.id)!==-1))}
					<div className="newAddItem recommendReason">
						<textarea className="reason" placeholder="推荐理由" value={content} onChange={(e)=> {
							this.setState({content: e.target.value.trim()});
						}}/>
					</div>
					<div className="newAddItem recommendFee">
						<input placeholder="查看费用"
						       value={fee === -1 ? "" : fee}
						       className="seeFee"
						       onChange={(e)=> {
							       let value = e.target.value.trim();
							       if (!/^[0-9]*$/.test(value)) {
								       this.setState({
									       showWarnAlert: true,
									       alertWarnTitle: "请填写整数！"
								       });
								       return;
							       }
							       this.setState({fee: e.target.value.trim()});
						       }}/>
						<span className="mili">米粒</span>
					</div>

				</div>
				<div className="deployBtnWap" onTouchEnd={this.deployRecommendation.bind(this, "mine")}>
					<div className="deployBtn">
						<div className="footer-item">
							<div>发布</div>
						</div>
					</div>
				</div>
			</Layout>
		)
	}

	componentDidMount() {
		super.componentDidMount();
		this.showLoading(true);
		let data={
			status: 1,
			matchTypes: '',
			token: Cookie.getCookie("token") || ""
		};
		ApiAction.post(UrlConfig.matchList, data);
	}


}

export default MoreRecommendation;