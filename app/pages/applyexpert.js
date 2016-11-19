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

  retrieveFormData(formRef, fileRef){
    var me = this;
    var _frmdata = this.refs[formRef].getFormData();
      _frmdata[fileRef] = ReactDOM.findDOMNode(this.refs[fileRef]).files[0];
    return _frmdata;
  }

  submitExpertForm(){
    event.preventDefault();
    // 表单验证
    if(this.doValid('expertCard')){
      this.setState({submitState: "submitted"});
      var frmdata = this.retrieveFormData('expertForm', 'expertCard');
      var token = Cookie.getCookie("token") || '';
      this.showLoading(true)
      // ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
      frmdata.token = token;
      frmdata.name = this.refs.expertName.value;
      frmdata.phone = this.refs.expertPhone.value;
      frmdata.content = this.refs.expertDescribe.value;
      frmdata.paramUrl = 'cardPic';
      frmdata.username = token.substr(token.length-6);
      console.log('form data:',frmdata);
      UploadAction.uploadfile('/lottery/expert/apply', frmdata);
    }
  }

  doValid(fileRef){
    // 验证文件类型和文件大小
    var _qs = ReactDOM.findDOMNode(this.refs[fileRef]).files;

    if(_qs.length == 0){
      Toast.show("请上传文件", 'info');
      return false;
    }
    var _fileExt = _qs[0].name.substring(_qs[0].name.lastIndexOf("."));

    if(!_fileExt || (_fileExt.toLowerCase() !== ".jpg" && _fileExt.toLowerCase() !== ".jpeg" && _fileExt.toLowerCase() !== ".png" && _fileExt.toLowerCase() !== ".gif")){
      Toast.show("明细文件需为图片", 'info');
      return false;
    }
    if(_qs[0].size == 0){
      Toast.show("文件大小不能为0", 'info');
      return false;
    }
    if(_qs[0].size > 2 * 1024 * 1024){
      Toast.show("文件大小不能大于2M", 'info');
      return false;
    }
    if(this.refs.expertName.value.trim() === ""){
      Toast.show("请填写您的姓名", 'info');
      return false;
    }
    if(this.refs.expertPhone.value.trim() === ""){
      Toast.show("请填写您的手机号", 'info');
      return false;
    }
    if(this.refs.expertDescribe.value.trim() === ""){
      Toast.show("请填写简介", 'info');
      return false;
    }
    if(!this.refs.expertContract.checked){
      Toast.show("请仔细阅读并同意专家协议", 'info');
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
            <PageForm ref="expertForm" className="form-horizontal" action="/apiQS/upload" enctype="multipart/form-data">
              <input type="file" name="qsFile" ref="expertCard" accept=".jpg,.jpeg,.png,.gif" />
            </PageForm>
            <textarea placeholder="输入简介" ref='expertDescribe' rows="6"></textarea>
          </div>
          <div className="roleArea">
            <input type="checkbox" ref="expertContract"/>
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
              <input type="checkbox"/>
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
      if(data && data.success) {
        Toast.show("发送成功！", 'success');
        this.reset();
      } else if(data && data.message){
        Toast.show(data.message, 'info');
      } else {
        Toast.show("发送失败，请稍候再试！", 'error');
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
