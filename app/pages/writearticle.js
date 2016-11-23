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
    switch (url) {
        case UrlConfig.publishArticle:
          Toast.show('发布成功', 'success', 1000);
          break;
    }
  }

  render(){
    let publishBtn={title: '发布',func:this.publishArticle.bind(this)};
    return (
      <Layout hideBack={false} className={'writeArticle'} title={'发表文章'} rightItems={[publishBtn]}>
        <input className="articleTitle" placeholder="请输入标题" ref="articleTitle" />
        <textarea className="articleContent" rows="30" placeholder="请输入正文" ref="articleContent"/>
      </Layout>
    )
  }
}
