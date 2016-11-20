import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import TapAble from 'react-tappable';
import Loading from '../helper/loading';
import TitleInput from '../components/titleinput';
import NextButton from '../components/nextbutton';

export default class extends BasePage {
    state = {
        focusList: [],
        newList: []
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.drawapply:
                Toast.show("提交成功")
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();


    }

    handleSubmit(){
        this.showLoading(true);
        ApiAction.post(UrlConfig.drawapply, {token: Cookie.getCookie("token") || '' , balls: this.refs.balls.state.value, alipayNo: this.refs.alipayNo.state.value});
    }

    render() {
        return (
            <Layout hideBack={false} className={'drawapply'} title={'申请提现'}>
                <Loading showLoading={this.state.showLoading}/>
                
                <div className='center_input'>
                  <TitleInput title={'金额'} ref='balls' inputWidth={'75%'} placeholder={'请输入提现'}/>
                  <hr/>
                  <TitleInput title={'支付宝账号'} ref='alipayNo' inputWidth={'75%'} placeholder={'请输入支付宝账号'} type={'password'}/>
                </div>
                <div className='button'>
                  <NextButton onTouchEnd={this.handleSubmit.bind(this)} title={'提交'}/>
                </div>
            </Layout>
        )
    }
}
