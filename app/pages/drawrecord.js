import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

export default class extends BasePage {
  state = {
    records: []
  };

  apiSuccess(url, body) {
    this.showLoading(false);
    switch (url) {
      case UrlConfig.drawrecords:
        if(body.success){
          // Toast.show("提交成功");
          this.setState({
            records: body.data
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
    ApiAction.post(UrlConfig.drawrecords, {token: Cookie.getCookie("token") || ''});
  }

  renderRecords(){
    return this.state.records.map(function(item, index){
      return (
        <div className="record" key={'record' + index}>
          <div>
            {"交易单号：" + item.tradeNo}
          </div>
          <div>
            {"创建时间" + item.createTime}
          </div>
          <div>
            {"状态：" + item.drawStatus}
          </div>
          <div>
            {"提现数额：" + item.rice + CommonConfig.unit}
          </div>
          <div>
            {"支付宝账户：" + item.alipayNo}
          </div>
          <div>
            {"原因：" + item.reason}
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <Layout hideBack={false} className={'drawrecords'} title={'提现明细'}>
        <Loading showLoading={this.state.showLoading}/>
        {this.renderRecords()}
      </Layout>
    )
  }
}
