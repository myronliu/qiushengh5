// 充值记录
import Layout from '../components/layout';
import BasePage from '../components/BasePage.js';
import UrlConfig from '../config/urlconfig';
import Cookie from '../helper/cookie';


export default class extends BasePage {
  state={
    applyStatus: 'expert'
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.depositRecord:
        
        break;
    }
  }

  componentDidMount(){
    console.log('12341234');
    super.componentDidMount();
    this.showLoading(true);
    ApiAction.post(UrlConfig.depositRecord, {token: Cookie.getCookie("token") || ''});
  }
  render(){
    return (
      <Layout  hideBack={false} className={'applyExpert'} title={'充值记录'}>

      </Layout>
    )
  }
}
