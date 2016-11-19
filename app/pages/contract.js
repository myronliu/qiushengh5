import Layout from '../components/layout'

import Cookie from '../helper/cookie';
import Toast from '../helper/toast';
import ApiStore from '../stores/apistore';
import ApiAction from '../actions/apiaction';
import UrlConfig from '../config/urlconfig'
import BasePage from '../components/BasePage.js';
import Loading from '../helper/loading';

import Contract from '../config/contract';

export default class extends BasePage {
  state={
    title:Contract[this.props.type] && Contract[this.props.type].title ? Contract[this.props.type].title : Contract['default'].title,
    context:Contract[this.props.type] && Contract[this.props.type].context ? Contract[this.props.type].context : Contract['default'].context
  };

  componentWillMount(){
    super.componentDidMount();
  }

  render() {
    return (
      <Layout className={'contract'} title={this.state.title}>
        <div className={"context"} dangerouslySetInnerHTML={{__html: this.state.context}}>
        </div>
      </Layout>
    )
  }
}
