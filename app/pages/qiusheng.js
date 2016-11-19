import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import NextButton from '../components/nextbutton';
import Input from '../components/Input';
import TitleInput from '../components/titleinput';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage';
import ReactSwipe from '../components/swiper/react-swipe';
import HomeBanner from '../components/HomeBanner';
import Loading from '../helper/loading';
import TwoBtnAlert from '../components/twobtnalert';
import TapAble from 'react-tappable';
import Saishi from '../components/Saishi';
import QsFooter from '../components/qsfooter';

export default class extends BasePage {
    state = {
        data: {
            topBanners: [
                {
                    image: 'http://7xlnmo.com1.z0.glb.clouddn.com/145396576168090468692267313600',
                    type: 0,
                },
                {
                    image: 'http://7xlnmo.com1.z0.glb.clouddn.com/145396645627348451797384768730',
                    type: 0,
                }
            ],
        },
        banners: [],
        specialist: [],
        recList: [],
        showAlert: false
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.recommendBuy:
                this.setState({
                    showAlert: false
                })
                if (body.success) {
                    window.to('/recodetail?id=' + this.state.payId);
                } else {
                    Toast.show(body.msg, 'error')
                }
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        if (this.props.token) {
            Cookie.setCookie("token", this.props.token, 7);
        }
        $("#scrollDiv").Scroll({line: 1, speed: 500, timer: 3000, up: "but_up", down: "but_down"});
    }

    componentWillMount() {
        // console.log(this.props.data)
        if (this.props.data && this.props.data.expert && this.props.data.expert.length > 0) {
            if (this.props.data.expert.length % 4 === 1) {
                this.props.data.expert.push({})
                this.props.data.expert.push({})
                this.props.data.expert.push({})
            } else if (this.props.data.expert.length % 4 === 2) {
                this.props.data.expert.push({})
                this.props.data.expert.push({})
            } else if (this.props.data.expert.length % 4 === 3) {
                this.props.data.expert.push({})
            }
        }
        this.setState({
            banners: this.props.data.banner || [],
            specialist: this.props.data.expert || [],
            recList: this.props.data.recommend || []
        })

    }

    pay(fee, id, ifBuy) {
        if (!ifBuy && fee && fee != "0") {
            this.setState({
                showAlert: true,
                alertTitle: "需支付" + fee + CommonConfig.unit + "查看专家推荐<br />(1" + CommonConfig.unit + "=1元)",
                payId: id
            })
        } else {
            window.to('/recodetail?id=' + id);
        }
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

    gotoSpecial(id) {
        if (id !== null) {
            window.to('/specialinfo?id=' + id)
        }
    }

    gotoSpecialist() {
        window.to('/specialist')
    }

    gotoHotmatch() {
        window.to('/hotmatch')
    }

    gotoHots() {
        window.to('/userrank')
    }

    renderBanner() {
        var count = this.state.banners.length;
        if (!process.browser && count > 0) {
            var item = this.state.banners[0];
            return <HomeBanner data={item} count={count}/>
        } else {
            return this.state.banners.map(function (item, i) {
                item.image = item.url;
                return <HomeBanner key={i} data={item} count={count}/>
            }.bind(this));
        }
    }

    rendScrolBanner() {
        return <ReactSwipe continuous={true} speed={400} auto={2000}>
            {this.renderBanner()}</ReactSwipe>
    }

    renderItems() {
        if (this.state.list instanceof Array) {
            return this.state.list.map(function (item, index) {
                return (
                    <div className="specialItem" key={"s" + index}>
                        <div className="img">
                            <img src={item.url} className=""/>
                        </div>
                        <div className="name">
                            {item.name}
                        </div>
                    </div>
                )
            }.bind(this));
        }
    }

    renderSpecialist() {
        if (this.state.specialist instanceof Array) {
            return this.state.specialist.map(function (item, index) {
                return (
                    <TapAble className="specialItem" key={"s" + index} onTap={this.gotoSpecial.bind(this, item.id)}>
                        <img src={item.avatar ? item.avatar : '../images/photo.png'} className=""/>
                        <div className="name">
                            {item.name ? item.name : '虚位以待'}
                        </div>
                    </TapAble>
                )
            }.bind(this));
        }
    }

    renderRecommendList() {
        let recList = [
            {
                "expert": {
                    "id": "ff8080815828cc90015828fba10d0033",
                    "hits": "0",
                    "title": "推荐专家",
                    "name": "啊Zhang张先森无脸人",
                    "avatar": "http://wx.qlogo.cn/mmopen/UEFcaeyFkDh0deia30cNjdia8QkqPhAN9MvjMG8PRA7OB6hYCIOys9ib7rEXbfwmQ9FPlSdRV4441qJBK2iaK3V5AQ/0"
                },
                "recommend": {
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
                    "ifBuy": false
                }
            },
            {
                "expert": {
                    "id": "ff8080815811a5a90158121f3f420004",
                    "hits": "0",
                    "title": "推荐专家",
                    "name": "创造财富",
                    "avatar": "http://wx.qlogo.cn/mmopen/Q3auHgzwzM5sWLbuj1scSvNwX6F5TMKmbYXqUnZdM3zMTQ00DKHJsXzVDaCeBA7uRBeZPmgKCUWdj8L8jKtZHYmvY58AQNgBYhloZI4OicdE/0"
                },
                "recommend": {
                    "id": "ff8080815862933901586556c460003a",
                    "matchName": "世杯亚",
                    "betsType": "单关",
                    "homeTeam": "中国",
                    "awayTeam": "卡塔尔",
                    "matchDate": "2016-11-15 19:35:00",
                    "content": null,
                    "recommendWay": null,
                    "fee": 99,
                    "picUrl": null,
                    "hits": null,
                    "createTimeStr": null,
                    "expertName": null,
                    "expertTitle": null,
                    "avatar": null,
                    "ifBuy": false
                }
            },];
        //let recList = this.state.recList;
        if (recList instanceof Array) {
            return recList.map(function (item, index) {
                return (
                    <div className="recItem" key={"rec" + index}>
                        <TapAble className="specialInfo" onTap={this.gotoSpecial.bind(this, item.expert.id)}>
                            <img src={item.expert.avatar ? item.expert.avatar : "../images/photo.png"}/>
                            <div className="textInfo">
                                <div className="tTitle">{item.expert.name}</div>
                                <div className="tDesc">{item.expert.title}</div>
                            </div>
                        </TapAble>
                        <Saishi
                            type="saishiAttachPrice"
                            key={"s" + index}
                            data={item.recommend}
                            onTap={this.pay.bind(this, item.recommend.fee, item.recommend.id, item.recommend.ifBuy)}
                        ></Saishi>
                    </div>
                )
            }.bind(this))
        }
    }

    renderHots() {
        return this.props.data.hots.map(function (item, index) {
            return (
                <li key={"li" + index}>
                    <span className="middleInfo">{item.name}</span>
                    <span className="numInfo">{item.hits}</span>
                </li>
            )
        })
    }

    render() {
        var navContent = [
            {
                id: 'hotNews',
                title: '火线资讯',
                direct_url: '',
            }, {
                id: 'runChart',
                title: '极限追盘',
                direct_url: '',
            },
            {
                id: 'scoreLive',
                title: '比分直播',
                direct_url: ''
            },
            {
                id: 'freeRecommend',
                title: '免费推荐',
                direct_url: ''
            },
            {
                id: 'lotteryOrder',
                title: '彩店实单',
                direct_url: ''
            }
        ];
        return (
            <Layout hideBack={true} className={'qiusheng'} title={'球盛体育'}>
                <Loading showLoading={this.state.showLoading}/>
                <TwoBtnAlert show={this.state.showAlert} title={this.state.alertTitle} firstBtnTitle={"取消"}
                             secondBtnTitle={"确定"} firstBtnOnTouchEnd={this.handleCancle.bind(this)}
                             secondBtnOnTouchEnd={this.handleSure.bind(this)}/>
                {this.rendScrolBanner()}
                <div className="navBar">
                    {
                        navContent.map(function (item, index) {
                            return (
                                <li key={"navBar" + index}>
                                    <img src={"../images/qiusheng/icon-" + item.id + ".png"}/>
                                    <div>{item.title}</div>
                                </li>
                            )
                        })
                    }
                </div>
                <div className="content hotmatchHome">
                    <div className="topInfo">
                        <span className="title">{"足球赛事"}</span>
                        <span className="link" onTouchEnd={this.gotoHotmatch.bind(this)}>{"全部赛事"}</span>
                    </div>
                    <Saishi type="saishi"
                            data={this.props.data.match}></Saishi>
                </div>
                <TapAble className="hongrenbang block" onTap={this.gotoHots.bind(this)}>
                    <div id="scrollDiv" className="scrolldivs">
                        <img className="leftInfo" src="../images/qiusheng/icon-hongrenbang.png"/>
                        <ul className="scrollul">
                            {this.renderHots()}
                        </ul>
                    </div>
                </TapAble>

                <div className="content recListHome">
                    <div className="topInfo">
                        <span className="title">{"最新推荐"}</span>
                        <span className="subTitle">{"推荐有风险 投注请谨慎"}</span>
                    </div>
                    {this.renderRecommendList()}
                </div>
                <div className="content specialistHome">
                    <div className="topInfo">
                        <span className="title">{"竞彩专家"}</span>
                        {/*<span className="link" onTouchEnd={this.gotoSpecialist.bind(this)}>{"更多"}</span>*/}
                    </div>
                    {this.renderSpecialist()}
                </div>
                <div style={{height: '9rem'}}></div>
                <QsFooter page={"home"}/>
            </Layout>
        )
    }
}
