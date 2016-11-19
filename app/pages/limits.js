import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import TapAble from 'react-tappable';
import Loading from '../helper/loading';
import QsFooter from '../components/qsfooter';

export default class extends BasePage {
    state = {
        list: []
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.url+"?url=http://b.fencaike.com/api/"+UrlConfig.competition:
                var ll = JSON.parse(body);
                this.setState({
                    list: ll.data || []
                })
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this.showLoading(true)
        ApiAction.post(UrlConfig.url+"?url=http://b.fencaike.com/api/"+UrlConfig.competition);

    }

    renderItem(item){
        return item.map(function(item, index){
            return(
                <div className="item" key={'item'+index}>
                    <div className="title">
                        {item.limit_type}
                    </div>
                    <div className="lline">
                        <span className="l1">{item.code}</span>
                        <span className="l2" style={{backgroundColor:item.backgroundcolor}}>{item.third_level}</span>
                        <span className="l3">{item.jc_team_name}</span>
                        <span className="l4">{item.limit_num + "场"}</span>
                        <span className="l5">{item.one_his_num}</span>
                        <span className="l6">{item.ten_his_num}</span>
                        <span className="l7">{item.one_his_end_time.substr(2,2) + '/' + item.one_his_end_time.substr(5,2) + '/' + item.one_his_end_time.substr(8,2)}</span>
                        <span className="l8">{item.ten_his_end_time.substr(2,2) + '/' + item.ten_his_end_time.substr(5,2) + '/' + item.ten_his_end_time.substr(8,2)}</span>
                    </div>
                </div>
            )
        })
    }

    renderList() {
        return this.state.list.map(function (item, index) {
            return (
                <div className="listS" key={'list'+index}>
                    {this.renderItem(item)}
                </div>
            )
        }.bind(this));


    }

    render() {
        return (
            <Layout hideBack={false} className={'limits'} title={'极限追盘'}>
                <Loading showLoading={this.state.showLoading}/>
                <div className="limits-header">
                    <span className="l1">{"编号"}</span>
                    <span className="l2">{"赛事类型"}</span>
                    <span className="l3">{"球队名称"}</span>
                    <span className="l4">{"临场极限"}</span>
                    <span className="l5">{"近1年"}</span>
                    <span className="l6">{"近10年"}</span>
                    <span className="l7">{"超出时间"}</span>
                    <span className="l8">{"超出时间"}</span>
                </div>
                {this.renderList()}
            </Layout>
        )
    }
}
