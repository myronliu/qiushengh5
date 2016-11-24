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
        status: 'unover',
        articleList: []
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
                    unoverlist: body.orders.unOver || [],
                    articleList: body.articles || []
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

	gotoMoreRecommendation() {
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
        window.to('/drawapply');
    }

    drawrecords() {
        window.to('/drawrecords');
    }

    renderOptions() {
        if (this.state.ifCommon) {
            return (
                <div className="options">
                    <span className="optionButton" onTouchEnd={this.applyExpert.bind(this)}>
                      <img src="../images/mine/icon-deposit.png"/>申请专家
                    </span>
                    <span className="optionButton" onTouchEnd={this.gotoCharge.bind(this)}>
                        <img src="../images/mine/icon-deposit.png"/>
                        快速充值</span>
                </div>
            );
        } else {
            return (
                <div className="options">
                    <span className="optionButton" onTouchEnd={this.gotoMoreRecommendation.bind(this)}>
                        <img src="../images/mine/icon-withdraw.png"/>
                        新增推荐
                    </span>
                    <span className="optionButton" onTouchEnd={this.gotoCharge.bind(this)}>
                        <img src="../images/mine/icon-deposit.png"/>
                        快速充值</span>
                </div>
            );
        }
    }


    renderArticle() {
        return this.state.articleList.map(function (item, index) {
            return (
                <div className="articlePreview" key={"arti" + index}>
                    <div className="articleTitle">{item.title}</div>
                    <div className="articleDesc">{item.content}</div>
                </div>
            )
        }.bind(this));
    }

    renderMatches(data) {
        data = data || [];
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
    renderHeaderRight(){
      if(!this.state.ifCommon){
        return (
          <div className="right">
              <TapAble className="writeArticleBtn" onTap={this.writeArticle.bind(this)}>
                  发表文章
              </TapAble>
          </div>
        );
      }else{
        return null;
      }
    }
    renderArticleArea(){
      if(!this.state.ifCommon){
        return (
          <div className="contentWrap articleList">
              <div className="contentTitle">文章</div>
              <div className="contentInner">
                  {this.renderArticle()}
              </div>
          </div>
        );
      }else{
        return null;
      }
    }
    noFunc(){}

    render() {
        let leftBtn = {title: '我的推荐', func: this.gotoMyreRommendation.bind(this)};
        let rightBtn1 = this.state.ifCommon ? {title: '', func: this.noFunc.bind(this)}:{title: '提现', func: this.withdraw.bind(this)};
        let rightBtn2 = this.state.ifCommon ? {title: '', func: this.noFunc.bind(this)}:{title: '明细', func: this.drawrecords.bind(this)};
        return (
            <Layout hideBack={true} className={'mine'} title={'我的'} rightItems={[rightBtn1, rightBtn2]} leftItems={leftBtn}>
                <Loading showLoading={this.state.showLoading}/>
                <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
                             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
                             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
                <div className="header">
                    <div className="userInfo myInfo">
                        <img src={this.state.avatar ? this.state.avatar : "../images/photo.png"} className=""/>
                        <div className="textInfo">
                            <div className="tTitle">{ this.state.name || '座无虚席' }</div>
                            <div className="tDesc">余额：<span
                                className="money">{this.state.rices || '0'}</span>{CommonConfig.unit}</div>
                        </div>
                        {this.renderHeaderRight()}
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
                {this.renderArticleArea()}
                <div style={{height: '9rem'}}></div>
                <QsFooter page={"mine"}/>
            </Layout>
        )
    }
}
