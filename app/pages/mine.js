import Layout from '../components/layout';
import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import NextButton from '../components/nextbutton';
import Input from '../components/Input';
import TitleInput from '../components/titleinput';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig';
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TwoBtnAlert from '../components/twobtnalert';
import TapAble from 'react-tappable';
import QsFooter from '../components/qsfooter';
import Saishi from '../components/Saishi';

export default class extends BasePage {
    state = {
        overlist: [],
        unoverlist: [],
        showAlert: false,
        status: 'unover'
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.order:
                this.setState({
                    avatar: body.my.avatar,
                    name: body.my.name,
                    ifCommon: body.my.ifCommon === 'YES',
                    rices: body.rices,
                    overlist: body.orders.over || [],
                    unoverlist: body.orders.unOver || []
                })
                break;
            case UrlConfig.recommendBuy:
                this.setState({
                    showAlert: false
                })
                window.to("/recommendationdetail?id=" + this.state.payId);
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.showLoading(true);
        ApiAction.post(UrlConfig.order, {token: Cookie.getCookie("token") || ''});
    }

    handleUnover() {
        this.setState({
            status: 'unover'
        })
    }

    handleOver() {
        this.setState({
            status: 'over'
        })
    }

    pay(fee, id) {
        window.to('/recommendationdetail?id=' + id);
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

    gotoCharge() {
        window.location.href = 'http://qiusheng.qingxinguoyuan.com/pay/test?token=' + Cookie.getCookie("token");
    }

    gotoMyreRommendation() {
        window.to('/myrecommendation');
    }
    gotoNewAddRecommendation() {
        window.to('/lanchrecommendation');
    }

    applyExpert() {
        window.to('/applyexpert');
    }

    writeArticle() {
        window.to('/writearticle');
    }

    deposit() {
        window.to('/deposit');
    }

    withdraw() {
        alert('申请提现，等待接口');
    }

    renderOptions() {
        if (this.state.ifCommon) {
            return (
                <div className="options">
                    <span className="optionButton" onTouchEnd={this.applyExpert.bind(this)}>申请专家</span>
                </div>
            );
        } else {
            return (
                <div className="options">
                    <span className="optionButton" onTouchEnd={this.withdraw.bind(this)}>
                        <img src="../images/mine/icon-withdraw.png"/>
                        申请提现
                    </span>
                    <span className="optionButton" onTouchEnd={this.gotoCharge.bind(this)}>
                        <img src="../images/mine/icon-deposit.png"/>
                        快速充值</span>
                </div>
            );
        }
    }


    renderArticle() {
        let articleList = [{
            title: '文章名字',
            desc: '文章描述'
        }];//this.state.articleList;

        return articleList.map(function (item, index) {
            return (
                <div className="articlePreview" key={"arti" + index}>
                    <div className="articleTitle">{item.title}</div>
                    <div className="articleDesc">{item.desc}</div>
                </div>
            )
        }.bind(this));
    }

    renderMatches(data) {
        data = [{

            "id": "ff808081586b8fb601586d038d420011",
            "matchName": "英足总",
            "betsType": "串关",
            "homeTeam": "布莱克",
            "awayTeam": "吉灵汉姆",
            "matchDate": "2016-11-17 03:45:00",
            "content": null,
            "recommendWay": null,
            "fee": 0,
            "picUrl": null,
            "hits": null,
            "createTimeStr": null,
            "expertName": null,
            "expertTitle": null,
            "avatar": null,
            "ifBuy": true
        },{

            "id": "ff808081586b8fb601586d038d420011",
            "matchName": "英足总",
            "betsType": "串关",
            "homeTeam": "布莱克",
            "awayTeam": "吉灵汉姆",
            "matchDate": "2016-11-17 03:45:00",
            "content": null,
            "recommendWay": null,
            "fee": 0,
            "picUrl": null,
            "hits": null,
            "createTimeStr": null,
            "expertName": null,
            "expertTitle": null,
            "avatar": null,
            "ifBuy": true
        }]
        return data.map(function (item, index) {
            return (
                <Saishi
                    type="saishiAttachPrice"
                    data={item}
                    key={"s" + index}
                    onTap={this.pay.bind(this, item.fee, item.id)}></Saishi>
            )
        }.bind(this));
    }

    render() {
        let rightBtn = {title: '新增推荐', func: this.gotoNewAddRecommendation.bind(this)};
        return (
            <Layout hideBack={true} className={'mine'} title={'我的'} rightItems={[rightBtn]}>
                <Loading showLoading={this.state.showLoading}/>
                <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
                             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
                             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
                <div className="header">
                    <div className="userInfo myInfo">
                        <img src={this.state.avatar ? this.state.avatar : "../images/photo.png"} className=""/>
                        <div className="textInfo">
                            <div className="tTitle">{ this.state.name || '座无虚席' }</div>
                            <div className="tDesc">米仓：<span
                                className="money">{this.state.rices || '0'}</span>{CommonConfig.unit}</div>
                        </div>
                        <div className="right">
                            <TapAble className="writeArticleBtn" onTap={this.writeArticle.bind(this)}>
                                发表文章
                            </TapAble>
                        </div>
                    </div>
                    {this.renderOptions()}
                </div>
                <div className="contentWrap unoverlist">
                    <div className="contentTitle">竞彩中</div>
                    <div className="contentInner">
                        {this.renderMatches(this.state.unoverlist)}
                    </div>
                </div>
                <div className="contentWrap overlist">
                    <div className="contentTitle">已结束</div>
                    <div className="contentInner">
                        {this.renderMatches(this.state.overlist)}
                    </div>
                </div>
                <div className="contentWrap articleList">
                    <div className="contentTitle">文章</div>
                    <div className="contentInner">
                        {this.renderArticle()}
                    </div>
                </div>
                <div style={{height: '9rem'}}></div>
                <QsFooter page={"mine"}/>
            </Layout>
        )
    }
}
