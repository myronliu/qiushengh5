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
      // return (
      //   <div className="record" key={'record' + index}>
      //     <div>
      //       {"交易单号：" + item.tradeNo}
      //     </div>
      //     <div>
      //       {"创建时间" + item.createTime}
      //     </div>
      //     <div>
      //       {"状态：" + item.drawStatus}
      //     </div>
      //     <div>
      //       {"提现数额：" + item.rice + CommonConfig.unit}
      //     </div>
      //     <div>
      //       {"支付宝账户：" + item.alipayNo}
      //     </div>
      //     <div>
      //       {"原因：" + item.reason}
      //     </div>
      //   </div>
      // )


      return (
          <div className="drecords-item" key={'item' + index}>
              <div className="content">
                  <div className="topInfo">
                      <div className="leftInfo">
                          <span className="title">{"-" + item.rice + CommonConfig.unit}</span>
                          <div className="teamName">{"提现到支付宝：" + item.alipayNo}</div>
                      </div>
                      <div className="rightInfo">
                          <div className={item.drawStatus === "已支付" ? "limitNumGray" : "limitNum"}><span>{item.drawStatus}</span></div>
                          <div>{item.createTime}</div>
                      </div>
                  </div>
                  <div className="bottomInfo">
                      <div className="limitItem">
                          <span>交易单号：</span>
                          <span>{item.tradeNo}</span>
                      </div>
                  </div>
                  {
                    item.reason ? 
                      (
                        <div className="bottomInfo">
                            <div className="limitItem">
                                <span>失败原因：</span>
                                <span>{item.reason}</span>
                            </div>
                        </div>
                      )
                      :
                      (
                        <div></div>
                      )
                  
                  }
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
