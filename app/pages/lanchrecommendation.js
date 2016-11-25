/**
 * Created by sjzhang on 2016/11/13.
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
import PageForm from '../components/pageform';
import UploadAction from '../actions/uploadaction';
import ReactDOM from 'react-dom';
import UploadStore from '../stores/uploadstore';
import Keyboard from '../components/keyboard';

const recommendType = {
	EXPERT: "普通推荐",
	SHOPKEEPER: "实单推荐"
};
class LanchRecommendation extends BasePage {
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
			myDefineFee: -1,
			content: "",
			imgUrl: "",
			userType: "EXPERT",
			kbdShow: false
		};
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

			case UrlConfig.deployRecommendation:
				if (body.success) {
					this.setState({
						showWarnAlert: true,
						alertWarnTitle: "发布成功！",
						selectedMatchArray: [],
						sureSelectedArray: [],
						deployMatchInfo: {},
						fee: -1,
						myDefineFee: -1,
						content: "",
						imgUrl: ""
					});
				} else {
					this.setState({
						showWarnAlert: true,
						alertWarnTitle: body.msg
					});
				}
				break;
			case UrlConfig.myDetail:
				if (body.myType) {
					this.setState({
						userType: body.myType
					});
				} else {
					this.setState({
						showWarnAlert: true,
						alertWarnTitle: "网络出错，请刷新页面！"
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
			if (selectedMatchArray.join(",").indexOf(matchItem.matchId) !== -1) {
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
		if (array.join(",").indexOf(type) !== -1) {
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
		if (array.join(",").indexOf(matchId) !== -1) {
			array = array.filter(id=>id !== matchId);
		} else {
			array.push(matchId);
		}
		this.setState({selectedMatchArray: array});
	}

	deployRecommendation() {
		let {deployMatchInfo, fee, myDefineFee, content, userType, imgUrl} = this.state;

		let matchIdArray = Object.keys(deployMatchInfo);

		if (matchIdArray.length === 0) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请选择推荐赛事！"
			});
			return;
		}
		if (fee === -1 && (myDefineFee === -1 || myDefineFee === "")) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请选择费用！"
			});
			return;
		}
		if (userType === "EXPERT" && (content.trim() === "" || content.trim().length < 30)) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "推荐理由不少于30字！"
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

		let params = {
			content: content,
			fee: fee,
			matchIds: deployMatchIds.join(","),
			letBalls: deployLetBalls.join(","),
			results: deployResults.join(","),
			token: Cookie.getCookie("token") || ''
		};

		if (userType === "EXPERT") {
			this.showLoading(true);
			ApiAction.post(UrlConfig.deployRecommendation, params);
		} else {
			var frmdata = this.retrieveFormData();
			// 表单验证
			if (this.doValid()) {
				this.showLoading(true);
				["content", "fee", "matchIds", "letBalls", "results", "token"].map(key=> {
					frmdata[key] = params[key];
				});
				frmdata.recommendWay = "REAL";
				frmdata.paramUrl = 'pics';
				frmdata.username = Cookie.getCookie("token").substring(Cookie.getCookie("token").length - 6);
				UploadAction.uploadfile("/" + UrlConfig.deployRecommendation, frmdata);
			}
		}
	}

	retrieveFormData() {
		var me = this;
		var _frmdata = this.refs.pageForm.getFormData();
		_frmdata["qsFile"] = ReactDOM.findDOMNode(this.refs.qsFile).files[0];
		return _frmdata;
	}

	doValid() {
		// 验证文件类型和文件大小
		var _qs = ReactDOM.findDOMNode(this.refs.qsFile).files;

		if (_qs.length == 0) {
			Toast.show("请上传文件");
			return false;
		}
		var _fileExt = _qs[0].name.substring(_qs[0].name.lastIndexOf("."));

		if (!_fileExt || (_fileExt.toLowerCase() !== ".jpg" && _fileExt.toLowerCase() !== ".jpeg" && _fileExt.toLowerCase() !== ".png" && _fileExt.toLowerCase() !== ".gif")) {
			Toast.show("明细文件需为图片");

			return false;
		}
		if (_qs[0].size == 0) {
			Toast.show("文件大小不能为0");

			return false;
		}
		if (_qs[0].size > 2 * 1024 * 1024) {
			Toast.show("文件大小不能大于2M");

			return false;
		}
		return true;
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
						className={this.state.selectedMatchArray.join(",").indexOf(item.matchId) !== -1 ? "matchWap selected" : "matchWap"}>
						<div>{item.bh}</div>
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
		list = list.filter(item=>sureSelectedArray.join(",").indexOf(item.matchId) !== -1);
		return list.map(function (item, index) {
			return (
				<div className="itemMatchWap" key={"recommendation" + index}>
					{
						deployMatchInfo[item.matchId] && deployMatchInfo[item.matchId]["letBall"] && deployMatchInfo[item.matchId]["letBall"].map((letBall, index)=> {
							return this.renderMatch(item, letBall, index, list.length)
						})
					}
				</div>
			)
		}.bind(this));
	}

	renderMatch(item, letBall, index, listLength) {
		let {deployMatchInfo} = this.state;
		return <div className="itemMatch" key={index} style={{marginBottom: index === listLength ? 0 : "1rem"}}>
			<div className="middleWap">
				<div className="line1">
					<span className="left">
						<span className="bh">{item.bh + " "}</span>
						<span>{item.matchName}</span>
					</span>
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
					      className={"first" + (deployMatchInfo[item.matchId]["selectType"][letBall].join(",").indexOf(1) !== -1 ? " selected" : "")}>{'主胜 ' + (letBall ? item.oddsRs : item.oddsS)}</span>
						<span onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 2, letBall)}
						      className={"middle" + (deployMatchInfo[item.matchId]["selectType"][letBall].join(",").indexOf(2) !== -1 ? " selected" : "")}>{'平局 ' + (letBall ? item.oddsRp : item.oddsP)}</span>
						<span onTouchEnd={this.selectTypeHandler.bind(this, item.matchId, 4, letBall)}
						      className={"last" + (deployMatchInfo[item.matchId]["selectType"][letBall].join(",").indexOf(4) !== -1 ? " selected" : "")}>{'客胜 ' + (letBall ? item.oddsRf : item.oddsF)}</span>
					</div>
				</div>
			</div>
			<div className="deleteBtn">
				<div className="deleteBtnIcon" onTouchEnd={this.deleteHandler.bind(this, item.matchId, letBall)}/>
			</div>
		</div>
	}

	goHomePage() {
		window.to('/qiusheng');
	}

	render() {
		let {selectedMatchArray, list, content, fee, myDefineFee, sureSelectedArray, imgUrl, userType, kbdShow} = this.state;
		let rightBtn = {icon: '../icons/nav_sy_pre.png', func: this.goHomePage.bind(this)};
		return (
			<Layout className='lanchRecommendation' title={'新增推荐'} rightItems={[rightBtn]}>
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

				<div className="lanchrecommendationItem">
					<div className="flexItem">
						<div className="btnDiv">标题</div>
						<div className="btnImage">
							<div className="recommendType">{recommendType[userType]}</div>
						</div>
					</div>

					<div className="flexItem selectMatchBtn"
					     style={{border: sureSelectedArray.length === 0 ? 0 : "1px solid #dddddd"}}
					     onTouchEnd={this.getMoreRecommendation.bind(this)}>
						<div className="btnDiv">选择赛事</div>
						<div className="btnImage">
							<div className="icon addMatch"></div>
						</div>
					</div>

					{this.renderDetailMatch()}

					<div className="imageView"
					     style={{display: imgUrl === "" || userType === "EXPERT" ? "none" : "block"}}>
						<img className="preLoadImg" src={imgUrl}/>
						<div className="deleteImgBtn"
						     onTouchEnd={()=> {
							     this.setState({
								     imgUrl: ""
							     });
							     this.refs.qsFile.value = "";
						     }}>
						</div>
					</div>

					<div className="flexItem reasonDiv">
                        <textarea className="reason" placeholder="描述一下你的推荐理由" value={content} onChange={(e)=> {
	                        this.setState({content: e.target.value.trim()});
                        }}/>
					</div>
					<div className="flexItem addImageFlex"
					     style={{display: userType === "SHOPKEEPER" && imgUrl === "" ? "" : "none"}}>
						<div className="addImageWap"
						     onTouchEnd={()=> {
							     this.refs.qsFile.click();
						     }}>
							<div className="addBtn">
								<div className="add">
									<div className="adddd addRow"></div>
									<div className="adddd addColumn"></div>
								</div>
							</div>
							<div className="text">添加图片</div>
						</div>
					</div>
					<div className="flexItem moneyTitle">选择费用</div>
					<div className="flexItem moneyDiv">
						<div className={fee === 0 ? "feebox selected" : "feebox"}
						     onTouchEnd={this.selectFee.bind(this, 0)}>免费
						</div>
						<div className={fee === 28 ? "feebox selected" : "feebox"}
						     onTouchEnd={this.selectFee.bind(this, 28)}>28球币
						</div>
						<div className={fee === 48 ? "feebox selected" : "feebox"}
						     onTouchEnd={this.selectFee.bind(this, 48)}>48球币
						</div>
						<div className={fee === 98 ? "feebox selected" : "feebox"}
						     onTouchEnd={this.selectFee.bind(this, 98)}>98球币
						</div>
						<div className={myDefineFee !== -1 ? "feebox myDefineFee selected" : "feebox myDefineFee"}>
							<input placeholder="自定义" value={myDefineFee === -1 ? "" : myDefineFee}
							       onFocus={()=> {
								       this.setState({
									       fee: -1,
									       myDefineFee: ""
								       });
							       }}
							       onChange={this.changeMyDefineFee.bind(this)}/><span>球币</span>
						</div>
					</div>

				</div>
				<div className="deployBtnWap" onTouchEnd={this.deployRecommendation.bind(this)}>
					<div className="deployBtn">
						<div className="footer-item">
							<div>发布</div>
						</div>
					</div>
				</div>
				<PageForm ref="pageForm" className="form-horizontal" action="/apiQS/upload"
				          enctype="multipart/form-data">
					<input style={{display: "none"}} type="file" ref="qsFile" name="qsFile"
					       capture="camera" accept="image/*" onChange={($e)=> {
						let files = $e.target.files;
						if (files.length == 0) return;
						this.beforeUpload && this.preLoadImg(files[0]);
					}}/>
				</PageForm>
				<Keyboard show={kbdShow}
				          handleDel={this.handleDel.bind(this)}
				          handleAdd={this.handleAdd.bind(this)}
				          close={this.closeKbd.bind(this)}/>
			</Layout>
		)
	}

	handleDel() {
		let {fee} = this.state;
		if (fee !== 0) {
			fee = fee.substring(0, fee.length - 1) === "" ? 0 : fee.substring(0, fee.length - 1);
			this.setState({fee});
		}
	}

	handleAdd(num) {
		let {fee} = this.state;
		if (fee === 0) {
			this.setState({fee: num});
		} else {
			this.setState({fee: fee + num});
		}
	}

	closeKbd() {
		this.setState({kbdShow: false});
	}

	selectFee(money) {
		let {fee} = this.state;
		if (fee === money) {
			this.setState({fee: -1, myDefineFee: -1});
		} else {
			this.setState({fee: money, myDefineFee: -1});
		}
	}

	changeMyDefineFee($e) {
		let value = $e.target.value.trim();
		if (!/^[0-9]*$/.test(value)) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请填写整数！"
			});
			return;
		}
		this.setState({
			fee: -1,
			myDefineFee: value === "" ? -1 : value
		});
	}

	preLoadImg(file) {
		var reader = new FileReader();
		let _this = this;
		reader.readAsDataURL(file);
		reader.onload = function (e) {
			_this.showLoading(false);
			_this.setState({imgUrl: e.target.result});
		};
	}

	beforeUpload(file) {
		if (file.type.indexOf("image") === -1) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请上传图片文件！"
			});
			return false;
		} else {
			this.showLoading(true);
			return true;
		}
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
		ApiAction.post(UrlConfig.myDetail, {token});

		UploadStore.uploadfile(function (body) {
			this.showLoading(false);
			if (body.success) {
				this.setState({
					showWarnAlert: true,
					alertWarnTitle: "发布成功！",
					selectedMatchArray: [],
					sureSelectedArray: [],
					deployMatchInfo: {},
					fee: -1,
					myDefineFee: -1,
					content: "",
					imgUrl: ""
				});
			} else {
				this.setState({
					showWarnAlert: true,
					alertWarnTitle: "网络出错，请重新发布！"
				});
			}
		}.bind(this));
	}
}

export default LanchRecommendation;
