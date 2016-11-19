// 申请专家
import Layout from '../components/layout';
import PageForm from '../components/pageform';
import ReactDOM from 'react-dom';
import UploadAction from '../actions/uploadaction';
import UploadStore from '../stores/uploadstore';
import BasePage from '../components/BasePage.js';
import Cookie from '../helper/cookie';
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

  retrieveFormData(){
    var me = this;
    var _frmdata = this.refs.pageForm.getFormData();
      _frmdata["qsFile"] = ReactDOM.findDOMNode(this.refs.qsFile).files[0];
    return _frmdata;
  }

  submitExpertForm(){
    event.preventDefault();
    // token,name,phone,cardPic,content
    // 表单验证
    if(this.doValid()){
      this.setState({submitState: "submitted"});

      var frmdata = this.retrieveFormData();
      var token = Cookie.getCookie("token") || '';
      console.log(token);
      this.showLoading(true)
      // ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
      frmdata.token = token;
      frmdata.paramUrl = 'cardPic';
      frmdata.username = token.substr(token.length-6);
      console.log('data---',frmdata);
      // UploadAction.uploadfile('/lottery/expert/apply', frmdata);
    }
  }

  doValid(){
    // 验证文件类型和文件大小
    var _qs = ReactDOM.findDOMNode(this.refs.qsFile).files;

    if(_qs.length == 0){
      Toast.show("请上传文件。");
      return false;
    }
    var _fileExt = _qs[0].name.substring(_qs[0].name.lastIndexOf("."));

    if(!_fileExt || (_fileExt.toLowerCase() !== ".jpg" && _fileExt.toLowerCase() !== ".jpeg" && _fileExt.toLowerCase() !== ".png" && _fileExt.toLowerCase() !== ".gif")){
      Toast.show("明细文件需为图片。");

      return false;
    }
    if(_qs[0].size == 0){
      Toast.show("文件大小不能为0。");

      return false;
    }
    if(_qs[0].size > 2 * 1024 * 1024){
      Toast.show("文件大小不能大于2M。");

      return false;
    }
    return true;
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
            <input type="text" ref='expertName' placeholder="姓名"/>
            <input type="text" ref='expertPhone' placeholder="联系电话"/>
            <PageForm ref="pageForm" className="form-horizontal" action="/apiQS/upload" enctype="multipart/form-data">
              <input type="file" name="qsFile" ref="qsFile" accept=".jpg,.jpeg,.png,.gif" />
            </PageForm>
            <textarea placeholder="输入简介" red='expertDescribe' rows="6"></textarea>
          </div>
          <div className="roleArea">
            <input type="checkbox" />
            <span>已阅读并同意<a>《专家协议》</a></span>
          </div>
          <div className="applyButton" onTouchEnd={this.submitExpertForm.bind(this)}>申请</div>
          <p className="tips">申请专家，写推荐，赚收成</p>
        </div>
      );
    }else{
      return (
        <div className="userInput">
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

        </div>
      );
    }
  }
  componentDidMount(){
    super.componentDidMount();

    UploadStore.uploadfile(function(data){
      if(data && data.status == 0) {
        Toast.show("发送成功！");
        this.reset();
      } else if(data && data.message){
        Toast.show(data.message);
      } else {
        Toast.show("发送失败，请稍候再试！");
      }

      this.setState({
        submitState: "ready"
      });

    }.bind(this));
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
