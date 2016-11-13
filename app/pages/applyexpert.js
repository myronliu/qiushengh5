// 申请专家
import Layout from '../components/layout';

export default class extends BasePage {
  state={
    applyStatus: 'expert'
  };

  switchApplyStatus(status){
    console.log('switchApplyStatus', status);
    this.setState({
      applyStatus: status
    });
  }

  submitShopkeeperForm(){
    console.log('submit');
    // this.refs.shopkeeperForm.submit();
  }

  renderApply(status){
    if(status === 'expert'){
      // 专家
      return (
        <div className="userInput">
          <div className="inputArea">
            <input type="text" placeholder="姓名"/>
            <input type="text" placeholder="联系电话"/>
            <textarea placeholder="输入简介" rows="6"></textarea>
          </div>
          <div className="roleArea">
            <input type="checkbox" />
            <span>已阅读并同意<a>《专家协议》</a></span>
          </div>
          <div className="applyButton">申请</div>
          <p className="tips">申请专家，写推荐，赚收成</p>
        </div>
      );
    }else{
      return (
        <div className="userInput">
          <form method="post" encType="multipart/form-data" ref="shopkeeperForm" action="">
            <div className="inputArea">
              <input type="text" placeholder="姓名"/>
              <input type="text" placeholder="联系电话"/>
              <input type="text" placeholder="彩票站点地址"/>
            </div>
            <div className="roleArea">
              <input type="checkbox" />
              <span>已阅读并同意<a>《站长协议》</a></span>
            </div>
            <div className="applyButton" onTouchEnd={this.submitShopkeeperForm.bind(this)}>申请</div>
            <p className="tips">申请专家，写推荐，赚收成</p>
          </form>
        </div>
      );
    }
  }

  render(){
    return (
      <Layout  hideBack={false} className={'applyExpert'} title={'申请专家'}>
        <div className="switchApply">
          <div className="switchArea">
            <div className={this.state.applyStatus === 'expert' ? 'active': 'unactive'} onTouchEnd={this.switchApplyStatus.bind(this, 'expert')}>申请专家</div>
            <div className={this.state.applyStatus === 'shopkeeper' ? 'active': 'unactive'} onTouchEnd={this.switchApplyStatus.bind(this, 'shopkeeper')}>申请站长</div>
          </div>
        </div>
        {this.renderApply(this.state.applyStatus)}
      </Layout>
    )
  }
}
