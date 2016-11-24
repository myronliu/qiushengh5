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
        myballs: 0
    };

    apiSuccess(url, body) {
        this.showLoading(false);
        switch (url) {
            case UrlConfig.drawapply:
                if(body.success){
                    Toast.show("提交成功");
                }else{
                    Toast.show(body.msg, 'error');
                }
                break;
            case UrlConfig.myorder:
                if(body.success){
                    // Toast.show("提交成功");
                    this.setState({
                        myballs: parseInt(body.data) || 0
                    })
                }else{
                    Toast.show(body.msg, 'error');
                }
                break;
        }
    }

    componentDidMount() {
        super.componentDidMount();
        this.showLoading(true);
        ApiAction.post(UrlConfig.myorder, {token: Cookie.getCookie("token") || ''});
    }

    handleSubmit(){
        this.showLoading(true);
        var balls = parseFloat(this.refs.balls.state.value);
        var alipayNo = this.refs.alipayNo.state.value;
        if(!balls){
            Toast.show("体现金额大于0", 'error');
        }else if(balls > this.state.myballs){
            Toast.show("最多提取："+this.state.myballs, 'error');
        }else if(!alipayNo){
            Toast.show("请输入支付宝账户", 'error')
        }else{
            ApiAction.post(UrlConfig.drawapply, {token: Cookie.getCookie("token") || '' , balls: balls, alipayNo: alipayNo});
        }
    }

    render() {
        return (
            <Layout hideBack={false} className={'drawapply'} title={'申请提现'}>
                <Loading showLoading={this.state.showLoading}/>
                <div><span className="ava-amount">可提现金额：</span><span className="ava-balls">{this.state.myballs}</span></div>
                <div className='center_input'>
                  <TitleInput title={'金额'} titleWidth={'6rem'} titleColor={"#414b59"} inputWidth={'20rem'} ref='balls' placeholder={'请输入提现'}/>
                  <TitleInput title={'支付宝账号'} titleWidth={'10rem'} titleColor={"#414b59"} inputWidth={'20rem'} ref='alipayNo' placeholder={'请输入支付宝账号'}/>
                </div>
                <div className='btn-area' onTouchEnd={this.handleSubmit.bind(this)}>
                  <div className='drawapply-btn'>{'提交'}</div>
                </div>
            </Layout>
        )
    }
}
