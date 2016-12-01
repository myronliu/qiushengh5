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
			deployMatchInfo: {},
			fee: -1,
			myDefineFee: -1,
			content: "",
			imgUrl: "",
			userType: "EXPERT",
			// userType: "SHOPKEEPER",
			kbdShow: false,
			title: ""

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
						deployMatchInfo: {},
						fee: -1,
						myDefineFee: -1,
						content: "",
						imgUrl: ""
					});
					window.sessionStorage.removeItem("selectedMatchData");
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


	deleteHandler(matchId, letBall) {
		let preState = _.fromJS(this.state).toJS();
		preState.deployMatchInfo[matchId][letBall] = null;
		let matchIdObj = preState.deployMatchInfo[matchId];
		let flag = false;
		Object.keys(matchIdObj).map(letBall=> {
			flag = flag || (matchIdObj[letBall] && matchIdObj[letBall].length !== 0);
		});
		if (!flag) {
			preState.selectedMatchArray = preState.selectedMatchArray.filter(id=>id !== matchId);
		}
		this.setState(preState);
	}

	gotoSelectMatch() {
		window.to('/selectmatch');
	}

	deployRecommendation() {
		let {selectedMatchArray, deployMatchInfo, fee, myDefineFee, content, userType, imgUrl, title} = this.state;
		if (selectedMatchArray.length === 0) {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请选择推荐赛事！"
			});
			return;
		}

		if (title === "") {
			this.setState({
				showWarnAlert: true,
				alertWarnTitle: "请输入标题！"
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

		selectedMatchArray.map(matchId=> {
			let matchIdObj = deployMatchInfo[matchId];
			Object.keys(matchIdObj).map(letBall=> {
				if (matchIdObj[letBall] && matchIdObj[letBall].length > 0) {
					deployLetBalls.push(letBall);
					deployMatchIds.push(matchId);
					let resultSum = matchIdObj[letBall].reduce((a, b)=>a + b);
					deployResults.push(resultSum);
				}

			});
		});

		let params = {
			title: title,
			content: content,
			fee: fee,
			matchIds: deployMatchIds.join(","),
			letBalls: deployLetBalls.join(","),
			results: deployResults.join(","),
			token: Cookie.getCookie("token") || ''
		};

		if (userType === "EXPERT") {
			this.showLoading(true);
			params.recommendWay = "COMMON";
			ApiAction.post(UrlConfig.deployRecommendation, params);
		} else {
			var frmdata = this.retrieveFormData();
			// 表单验证
			if (this.doValid()) {
				this.showLoading(true);
				["title", "content", "fee", "matchIds", "letBalls", "results", "token"].map(key=> {
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

	renderDetailMatch() {
		let {selectedMatchArray, list, deployMatchInfo} = this.state;
		list = list.filter(item=>this.arrayIncludes(selectedMatchArray, item.matchId));
		return list.map(function (item, index) {
			let matchId = item.matchId;
			return (
				<div className="itemMatchWap" key={"recommendation" + index}>
					{
						deployMatchInfo[matchId] && Object.keys(deployMatchInfo[matchId]).map((letBall, id)=> {
							return deployMatchInfo[matchId][letBall] && this.renderMatch(item, letBall, index + "_" + id, list.length, deployMatchInfo[matchId][letBall]);
						})
					}
				</div>
			)
		}.bind(this));
	}

	renderMatch(item, letBall, index, listLength, lvArray) {
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
						<span className="num">{letBall != "0" ? item.handicap : 0}</span>
					</div>
					<div className="right">
						<span
							className={"first" + (this.arrayIncludes(lvArray, 1) ? " selected" : "")}>{'主胜 ' + (letBall != "0" ? item.oddsRs : item.oddsS)}</span>
						<span
							className={"middle" + (this.arrayIncludes(lvArray, 2) ? " selected" : "")}>{'平局 ' + (letBall != "0" ? item.oddsRp : item.oddsP)}</span>
						<span
							className={"last" + (this.arrayIncludes(lvArray, 4) ? " selected" : "")}>{'客胜 ' + (letBall != "0" ? item.oddsRf : item.oddsF)}</span>
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
		let {selectedMatchArray, list, content, fee, myDefineFee, imgUrl, userType, kbdShow, title} = this.state;
		let rightBtn = {icon: '../icons/nav_sy_pre.png', func: this.goHomePage.bind(this)};
		return (
			<Layout className='lanchRecommendation' title={'新增推荐'} rightItems={[rightBtn]}>
				<Loading showLoading={this.state.showLoading}/>
				<TwoBtnAlert show={this.state.showWarnAlert} title={this.state.alertWarnTitle} firstBtnTitle={"取消"}
				             secondBtnTitle={"确定"}
				             firstBtnOnTouchEnd={()=>this.setState({showWarnAlert: false})}
				             secondBtnOnTouchEnd={()=>this.setState({showWarnAlert: false})}>
				</TwoBtnAlert>

				<div className="lanchrecommendationItem">
					<div className="titleDesc">
						<div className="btnDiv">标题</div>
						<div className="btnImage">
							<input value={title} placeholder="输入标题" onChange={($e)=> {
								if (selectedMatchArray.length === 0) {
									this.setState({
										showWarnAlert: true,
										alertWarnTitle: "请先选择推荐赛事！"
									});
									return;
								}
								this.setState({title: $e.target.value.trim()})
							}}/>
						</div>
					</div>

					<div className="selectMatchBtn"
					     style={{border: selectedMatchArray.length === 0 ? 0 : "1px solid #dddddd"}}
					     onTouchEnd={this.gotoSelectMatch.bind(this)}>
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

					<div className="reasonDiv">
                        <textarea className="reason" placeholder="描述一下你的推荐理由" value={content} onChange={(e)=> {
	                        this.setState({content: e.target.value.trim()});
                        }}/>
					</div>
					<div className="addImageFlex"
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
					<div className="moneyTitle">选择费用</div>
					<div className="moneyDiv">
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

		let selectedMatchData = JSON.parse(window.sessionStorage.getItem("selectedMatchData"));
		if (selectedMatchData) {
			let {deployMatchInfo}=selectedMatchData;
			let matchIdArray = Object.keys(deployMatchInfo);
			matchIdArray = matchIdArray.filter(matchId=> {
				let validFlag = true;
				let matchIdObj = deployMatchInfo[matchId];
				if (undefined === matchIdObj) {
					validFlag = false;
				} else {
					let letBallKeys = Object.keys(matchIdObj);
					if (letBallKeys.length === 0) {
						validFlag = false;
					} else {
						let nullArray = false;
						letBallKeys.map(key=> {
							nullArray = nullArray || matchIdObj[key].length > 0;
						});
						validFlag = validFlag && nullArray;
					}
				}
				return validFlag;
			});
			this.setState({selectedMatchArray: matchIdArray, deployMatchInfo});
		}

		UploadStore.uploadfile(function (body) {
			this.showLoading(false);
			if (body.success) {
				this.setState({
					showWarnAlert: true,
					alertWarnTitle: "发布成功！",
					selectedMatchArray: [],
					deployMatchInfo: {},
					fee: -1,
					myDefineFee: -1,
					content: "",
					imgUrl: ""
				});
				window.sessionStorage.removeItem("selectedMatchData");
			} else {
				this.setState({
					showWarnAlert: true,
					alertWarnTitle: "网络出错，请重新发布！"
				});
			}
		}.bind(this));
	}

	arrayIncludes(array, str) {
		return array.join(",").indexOf(str) != -1;
	}
}

export default LanchRecommendation;
