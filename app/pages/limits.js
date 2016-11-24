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
            case UrlConfig.url + "?url=http://b.fencaike.com/api/" + UrlConfig.competition:
                var ll = JSON.parse(body);
                this.setState({
                    list: ll.data || {}
                })
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this.showLoading(true)
        ApiAction.post(UrlConfig.url + "?url=http://b.fencaike.com/api/" + UrlConfig.competition);

    }


    renderItemNew(item) {
        var type;
        return item.map(function (item, index) {
            switch (item.limit_type) {
                case '连续不胜':
                    type = 'type-1';//橙色
                    break;
                case '连续不平':
                    type = 'type2';//绿色
                    break;
                case '连续不负':
                    type = 'type3';//紫色
                    break;
                case '连续赢盘':
                    type = 'type4';//蓝色
                    break;
                case '连续大球':
                    type = 'type5';//红色
                    break;
                default :
                    type = 'type1';
            }
            return (
                <div className="limit-item" key={'item' + index}>
                    <div className={"limitType " + type}>
                        {item.limit_type}
                    </div>
                    <div className="content">
                        <div className="topInfo">
                            <div className="leftInfo">
                                <span className="title">{item.third_level}</span>
                                <span className="time">{item.code}</span>
                                <div className="teamName">{item.jc_team_name}</div>
                            </div>
                            <div className="rightInfo">
                                <div className="limitNum"><span>{item.limit_num}</span>场</div>
                                <div>临场极限</div>
                            </div>
                        </div>
                        <div className="bottomInfo">
                            <div className="limitItem">
                                <span>历史极限</span>
                                <span>近1年</span>
                                <span>{item.one_his_num}</span>
                                <span>近10年</span>
                                <span>{item.ten_his_num}</span>
                            </div>
                            <div className="limitSurpass">
                                <span>超出历史极限</span>
                                <span>近1年</span>
                                <span>{item.one_his_end_time.substr(2, 2) + '/' + item.one_his_end_time.substr(5, 2) + '/' + item.one_his_end_time.substr(8, 2)}</span>
                                <span>近10年</span>
                                <span>{item.ten_his_end_time.substr(2, 2) + '/' + item.ten_his_end_time.substr(5, 2) + '/' + item.ten_his_end_time.substr(8, 2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    }

    renderItem(item) {
        return item.map(function (item, index) {
            return (
                <div className="item" key={'item' + index}>
                    <div className="title">
                        {item.limit_type}
                    </div>
                    <div className="lline">
                        <span className="l1">{item.code}</span>
                        <span className="l2" style={{backgroundColor: item.backgroundcolor}}>{item.third_level}</span>
                        <span className="l3">{item.jc_team_name}</span>
                        <span className="l4">{item.limit_num + "场"}</span>
                        <span className="l5">{item.one_his_num}</span>
                        <span className="l6">{item.ten_his_num}</span>
                        <span
                            className="l7">{item.one_his_end_time.substr(2, 2) + '/' + item.one_his_end_time.substr(5, 2) + '/' + item.one_his_end_time.substr(8, 2)}</span>
                        <span
                            className="l8">{item.ten_his_end_time.substr(2, 2) + '/' + item.ten_his_end_time.substr(5, 2) + '/' + item.ten_his_end_time.substr(8, 2)}</span>
                    </div>
                </div>
            )
        })
    }

    renderList() {
        var arr = [];
        for(var key in this.state.list){
            arr.push(
                <div className="listS" key={'list' + key}>
                    {this.renderItemNew(this.state.list[key])}
                </div>
            )
        }
        return arr;
        // return this.state.list.map(function (item, index) {
        //     return (
        //         <div className="listS" key={'list' + index}>
        //             {this.renderItemNew(item)}
        //         </div>
        //     )
        // }.bind(this));


    }

    render() {
        return (
            <Layout hideBack={false} className={'limits'} title={'极限追盘'}>
                <Loading showLoading={this.state.showLoading}/>
                {this.renderList()}
            </Layout>
        )
    }
}
