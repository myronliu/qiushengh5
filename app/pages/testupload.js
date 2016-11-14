import Layout from '../components/layout'
import BasePage from '../components/BasePage.js';

export default class extends BasePage {
  state={
  };

  apiSuccess(url,body){
    this.showLoading(false);
    switch(url){
      case UrlConfig.matchList:
        this.setState({
          list: body
        })
        break;
    }
  }

  componentDidMount(){
    super.componentDidMount();

    // this.showLoading(true)
    // ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
  }

  render() {
    return (
      <Layout hideBack={true} className={'hotmatch'} title={'热门赛事'}>
        <form action="/api/upload" encType="multipart/form-data" method="post">
          <input type="hidden" name="url" value="" /><br />
          <input type="hidden" name="username" value="liu" /><br />
          <input type="file" name="upload" multiple="multiple" /><br />
          <input type="submit" value="Upload" />
        </form>
      </Layout>
    )
  }
}
