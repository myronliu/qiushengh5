import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import NextButton from '../components/nextbutton';
import Input from '../components/Input';
import TitleInput from '../components/titleinput';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';
import TapAble from 'react-tappable';

export default class extends BasePage {
    state = {
        list: []
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.hots:
                this.setState({
                    list: body
                })
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();

        this.showLoading(true)
        ApiAction.post(UrlConfig.hots, {token: Cookie.getCookie("token") || 'dds'});
    }

    gotoDetail(id) {
        window.to('/specialinfo?id=' + id);
    }

    renderItems() {
        return this.state.list.map(function (item, index) {
            return (
                <TapAble className="item block" key={"i" + index} onTap={this.gotoDetail.bind(this, item.id)}>

                    {index < 3 ? <img className="ser"
                                      src={"../images/userrank/icon_rank" + index + ".png"}/> :
                        <span className="ser">{index + 1}</span>}
                    <img src={item.avatar ? item.avatar : '../images/photo.png'} className="photo"/>
                    <span className="info">
            <span className="name">{item.name}</span>
            <span className="desc">{item.title}</span>
          </span>
                    <span className="right">
            <span className="num">{item.hits || "0"}</span>
            <span className="text">场连红</span>
            <img src={'../images/right.png'} className="rightIcon"/>
          </span>
                </TapAble>
            )
        }.bind(this));
    }

    render() {
        return (
            <Layout className={'userrank'} title={'球盛名人堂'}>
                <Loading showLoading={this.state.showLoading}/>
                {this.renderItems()}
            </Layout>
        )
    }
}
