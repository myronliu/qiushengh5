/**
 * Created by sjzhang on 2016/11/14.
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


class RecommendationDetail extends BasePage {
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
			avatar: "",
			picUrl: "",
			name: "",
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
			case UrlConfig.recommendDetail:
				body = body || {};
				if (body.success) {
					body.data = body.data || {};
					body.data.detail = body.data.detail || {};
					body.data.matches = body.data.matches || [];
					this.setState({
						list: body.data.matches,
						picUrl: body.data.detail.picUrl || "../images/photo.png",
						content: body.data.detail.content || '',
						name: body.data.expert.name || '',
						title: body.data.expert.title || ''

					})
				} else {
					Toast.show(body.msg)
				}

				break;
		}
	}


	deployRecommendation() {

	}

	renderItems(list) {
		return list.map(function (item, index) {
			return (
				<div className="itemMatch" key={"reco" + index}>
					<div className="line1">
						<span className="left">
							<span style={{color: "#2c2c2c"}}>{item.bh}</span>
							<span>{item.matchName}</span></span>
						<span className="right">{item.matchDate}</span>
					</div>
					<div className="line2">
						<span className="left">{item.homeTeam}</span>
						<span className="vs">vs</span>
						<span className="right">{item.awayTeam}</span>
					</div>
					<div className="line3">
						<div className="left">
							<span className="num">{item.letBalls}</span>
						</div>
						<div className="right">
							<span className={"first" + (item.result & 1 ? " active" : "")}>{'主胜 ' + item.oddsS}</span>
							<span className={"middle" + (item.result & 2 ? " active" : "")}>{'平局 ' + item.oddsP}</span>
							<span className={"last" + (item.result & 4 ? " active" : "")}>{'客胜 ' + item.oddsF}</span>
						</div>
					</div>
				</div>
			)
		}.bind(this));
	}

	goHomePage() {
		window.to('/qiusheng');
	}

	render() {
		let {list, avatar, picUrl, name, title, content} = this.state;
		let rightBtn = {icon: './images/home_1.png', func: this.goHomePage.bind(this)};
		return (
			<Layout className='hotmatch' title={'推荐详情'} rightItems={[rightBtn]}>
				<Loading showLoading={this.state.showLoading}/>
				<TwoBtnAlert show={this.state.showWarnAlert} title={this.state.alertWarnTitle} firstBtnTitle={"取消"}
				             secondBtnTitle={"确定"}
				             firstBtnOnTouchEnd={()=>this.setState({showWarnAlert: false})}
				             secondBtnOnTouchEnd={()=>this.setState({showWarnAlert: false})}>
				</TwoBtnAlert>

				<div className="recommendationDetail">
					<div className="flexItem header">
						<div className="headerWap">
							<div className="divImg">
								<img src={avatar ? avatar : "../images/photo.png"} className=""/>
							</div>
							<div className="introduce">
								<div className="introduceInfo top">
									{name}
								</div>
								<div className="introduceInfo bottom">
									{title}
								</div>
							</div>
						</div>
					</div>
					<div className="itemMatchWap">
						{this.renderItems(list)}
					</div>

					<div className="content">
						{content}
					</div>

					<img style={{display: picUrl ? "block" : "none"}}
					     className="showImg" src={picUrl}/>
					<div className="flexItem likeUnlikeShareDiv">
						{/*<div className="doBtn like">{'\uD83D\uDC4D'}</div>*/}
						{/*<div className="doBtn like">{'ue00e'}</div>*/}
						<div className="doBtn like">like</div>
						<div className="doBtn unlike">unlike</div>
						<div className="doBtn share">share</div>
					</div>
					<div className="flexItem operateDiv">
						<div className="doBtn maxBonus">
							<span>理论最大反奖：</span>
							<span className="bili">256%</span>
						</div>
						<div className="doBtn followOperate">跟单投注</div>
					</div>

				</div>
			</Layout>
		)
	}

	componentDidMount() {
		super.componentDidMount();
		// this.showLoading(true);
		// let data = {
		// 	status: 1,
		// 	matchTypes: '',
		// 	token: Cookie.getCookie("token") || ""
		// };
		// ApiAction.post(UrlConfig.matchList, data);
		let list = [{
			matchName: "世预赛",
			matchDate: "2016-12-14",
			homeTeam: "中国",
			awayTeam: "日本",
			letBalls: 1,
			result: 1,
			oddsS: 1.3,
			oddsP: 2.3,
			oddsF: 3.6,
			bh: "001"
		}];
		this.setState({list});

		this.showLoading(true);
		// ApiAction.post(UrlConfig.expertDetail, {
		// 	id: this.props.id,
		// 	token: Cookie.getCookie("token") || '4A658C932EC03A80D651EABC74E08383D2EFD43F4C19558D5E4BF07367A3FC000055D74AFE1D6D014BFF6B4F87D557570AD61DEB36EEE90DCDC78A0700FD6FA413F17223F0379E6F67C33419E6DE9060'
		// });

		ApiAction.post(UrlConfig.recommendDetail, {
			recommendId: this.props.id,
			token: Cookie.getCookie("token") || '4A658C932EC03A80D651EABC74E08383D2EFD43F4C19558D5E4BF07367A3FC000055D74AFE1D6D014BFF6B4F87D557570AD61DEB36EEE90DCDC78A0700FD6FA413F17223F0379E6F67C33419E6DE9060'
		});


	}


}

export default RecommendationDetail;