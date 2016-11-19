import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';
import QsFooter from '../components/qsfooter';
import Saishi from '../components/Saishi';

export default class extends BasePage {
    state = {
        list: [],
        status: "on",
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.matchList:
                this.setState({
                    list: body
                })
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this.showLoading(true)
        ApiAction.post(UrlConfig.matchList, {status: 2, matchTypes: '', token: Cookie.getCookie("token") || 'dds'});
    }

    selectOn() {
        this.showLoading(true);
        this.setState({
            status: 'on'
        })
        ApiAction.post(UrlConfig.matchList, {status: 2, matchTypes: '', token: Cookie.getCookie("token") || 'dds'});
    }

    selectEnd() {
        this.showLoading(true);
        this.setState({
            status: 'end'
        })
        ApiAction.post(UrlConfig.matchList, {status: 5, matchTypes: '', token: Cookie.getCookie("token") || 'dds'});
    }

    gotoDetail(id) {
        window.to('/hotmatchdetail?id=' + id);
    }

    renderItems() {
        return this.state.list.map(function (item, index) {
            return (
                <Saishi
                    style="margin-bottom:2rem;"
                    type="saishi"
                    data={item}
                    key={"hot" + index}
                    onTap={this.gotoDetail.bind(this, item.id)}>
                    <div className="bh">No.{item.bh}</div>
                </Saishi>

            )
        }.bind(this));
    }

    render() {
        return (
            <Layout hideBack={true} className={'hotmatch'} title={'热门赛事'}>
                <div className="header">
                    <span className={this.state.status === "on" ? "active left" : "left"}
                          onTouchEnd={this.selectOn.bind(this)}>竞彩中</span>
                    <span className={this.state.status === "end" ? "active right" : "right"}
                          onTouchEnd={this.selectEnd.bind(this)}>已结束</span>
                </div>
                {this.renderItems()}

                <Loading showLoading={this.state.showLoading}/>
                <div style={{height: '9rem'}}></div>
                <QsFooter page={"saishi"}/>
            </Layout>
        )
    }
}
