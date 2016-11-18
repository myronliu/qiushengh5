// 充值
import Layout from '../components/layout';

export default class extends BasePage {
  state={
    applyStatus: 'expert'
  };

  gotoDepositRecord(){
    window.to('/depositrecord');
  }

  render(){
    let recordBtn={title: '充值记录',func:this.gotoDepositRecord.bind(this)};
    return (
      <Layout hideBack={false} className={'deposit'} title={'充值'} rightItems={[recordBtn]}>
        <div className='chooseDepositArea'>
          <p className="choose-guide-text">请选择要充值的米粒数量：</p>

          <div className='deposit-item'>
              <p className='deposit-item-price'>100</p>
              <p className='deposit-item-benefit'>送<span className='benefit-num'>8</span>粒米</p>
          </div>
          <div className='deposit-item'>
              <p className='deposit-item-price'>500</p>
              <p className='deposit-item-benefit'>送<span className='benefit-num'>50</span>粒米</p>
          </div>
          <div className='deposit-item'>
              <p className='deposit-item-price'>1000</p>
              <p className='deposit-item-benefit'>送<span className='benefit-num'>120</span>粒米</p>
          </div>
          <div className='deposit-item'>
              <p className='deposit-item-price'>10000</p>
              <p className='deposit-item-benefit'>送<span className='benefit-num'>1500</span>粒米</p>
          </div>

        </div>
      </Layout>
    )
  }
}
