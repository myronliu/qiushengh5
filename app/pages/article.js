import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

export default class extends BasePage {
  state = {
    title:'',
    context:''
  };

  apiSuccess(url, body) {
    this.showLoading(false);
    switch (url) {
      case UrlConfig.articledetail:
        if(body.success){
          this.setState({
            title: body.data.title,
            context: body.data.content
          })
        }else{
          Toast.show(body.msg, 'error')
        }
        break;
    }
  }

  componentDidMount() {
    super.componentDidMount();

    this.showLoading(true)
    ApiAction.post(UrlConfig.articledetail, {articleId: this.props.id || ''});
  }

  render() {
      return (
          <Layout hideBack={false} className={'article'} title={'文章'} >
            <Loading showLoading={this.state.showLoading}/>
            <div className="article-title">{this.state.title}</div>
            <div className="article-context">{this.state.context}</div>
          </Layout>
      )
  }
}
