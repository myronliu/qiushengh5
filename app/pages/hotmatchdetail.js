import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';
import TwoBtnAlert from '../components/twobtnalert';
import Saishi from '../components/Saishi';

export default class extends BasePage {
    state = {
        recList: [],
        tabs: ['热门', '专家'],//['推荐专家','特邀大咖','彩店专家','明星专家'],
        currentTab: 0,
        homeTeam: '桑托斯',
        awayTeam: '圣保罗',
        matchName: '巴西',
        matchDate: '11-11',
        showAlert: false,
        homeTeamAvatar: '',
        awayTeamAvatar: ''
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.matchDetail:
                this.setState({
                    homeTeam: body.detail.homeTeam,
                    awayTeam: body.detail.awayTeam,
                    matchName: body.detail.matchName,
                    matchDate: body.detail.matchDate,
                    homeTeamAvatar: body.detail.homeTeamAvatar,
                    awayTeamAvatar: body.detail.awayTeamAvatar,
                    recList: body.recommends
                })
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

    componentDidMount() {
        super.componentDidMount();

        this.showLoading(true)
        ApiAction.post(UrlConfig.matchDetail, {id: this.props.id, token: Cookie.getCookie("token") || ''});
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
    track(fee) {
        console.log(fee);
    }

    handleCancle() {
        this.setState({
            showAlert: false
        })
    }

    handleSure() {
        this.showLoading(true)
        ApiAction.post(UrlConfig.recommendBuy, {recommendId: this.state.payId, token: Cookie.getCookie("token") || ''});
    }

    renderRecommondList() {
        let recList = this.state.recList;

        return recList.map(function (item, index) {
            return (
                <TapAble className="recItem block" key={"rec" + index}
                         onTap={this.pay.bind(this, item.fee, item.id, item.ifBuy)}>
                    <div className="specialInfo">
                        <img src={item.avatar ? item.avatar : "../images/photo.png"}/>
                        <div className="textInfo">
                            <div className="tTitle">{item.expertName}</div>
                            <div className="tDesc">{item.expertTitle}</div>
                        </div>
                    </div>
                    <div className="saishiItem" key={"s" + index}>
                        <div className="leftPart">
                            <div className="sTopInfo">
                                <span className="add">{item.betsType}</span>
                                <span className="recWay">{item.recommendWay}</span>
                                <span className="time">{item.createTimeStr}</span>
                            </div>
                        </div>
                        <div className="rightPart">
                            {item.fee > 0 ? (item.ifBuy ? "查看" : (item.fee + CommonConfig.unit)) : ("免费")}
                        </div>
                    </div>
                </TapAble>
            )
        }.bind(this))
    }

    changeTab(index) {
        this.setState({
            currentTab: index
        })
    }

    renderTabs() {
        return this.state.tabs.map(function (item, index) {
            return (
                <span onTouchEnd={this.changeTab.bind(this, index)}
                      className={"tabItem" + (this.state.currentTab === index ? " active" : '')}
                      key={index}>
                    {item}
                </span>
            )
        }.bind(this));
    }

    render() {
        return (
            <Layout className={'hotmatchdetail'} title={'赛事详情'}>
                <Loading showLoading={this.state.showLoading}/>
                <div className="top">
                    <Saishi
                        type="saishi"
                        data={this.state}/>
                </div>
                <div className="tabs">
                    {this.renderTabs()}
                </div>
                {this.renderRecommondList()}
                <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
                             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
                             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
            </Layout>
        )
    }
}
