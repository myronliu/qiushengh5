// 申请专家
import Layout from '../components/layout';
import Cookie from '../helper/cookie';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig';
import Toast from '../helper/toast';

export default class extends BasePage {

  publishArticle(){
      var titleData = this.refs.articleTitle.value;
      var contentData = this.refs.articleContent.value;
      ApiAction.post(UrlConfig.publishArticle, {title: titleData, content: contentData, token: Cookie.getCookie("token") || ''});
  }

  apiSuccess(url,body){
    Toast.show('发布成功', 1000);
  }

  render(){
    return (
      <Layout hideBack={false} className={'writeArticle'} title={'发表文章'}>
        <input className="articleTitle" placeholder="文章标题" ref="articleTitle" />
        <textarea className="articleContent" rows="15" placeholder="文章内容" ref="articleContent"/>
        <div className="publishButton" onTouchEnd={this.publishArticle.bind(this)}>发表</div>
      </Layout>
    )
  }
}
