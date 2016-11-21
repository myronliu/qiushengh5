import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

export default class extends BasePage {
  state = {
  };

  apiSuccess(url, body) {
    this.showLoading(false);
    switch (url) {
      case UrlConfig.concern:
        this.setState({
          focusList: (body.has ? body.experts : []),
          newList: (!body.has ? body.experts : [])
        })
        break;
    }
  }

  componentDidMount() {
    super.componentDidMount();

    // this.showLoading(true)
    // ApiAction.post(UrlConfig.concern, {token: Cookie.getCookie("token") || ''});
  }

  render() {
      return (
          <Layout hideBack={false} className={'article'} title={'文章'} >
            <Loading showLoading={this.state.showLoading}/>
            <div>{"这里只是一个test的文章，哈哈哈哈，没有任何数据"}</div>
            <div>{"文章ID：" + this.props.id}</div>
          </Layout>
      )
  }
}
