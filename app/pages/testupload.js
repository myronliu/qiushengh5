import Layout from '../components/layout';
import BasePage from '../components/BasePage.js';
import PageForm from '../components/pageform';
import UploadAction from '../actions/uploadaction';
import UploadStore from '../stores/uploadstore';
import ReactDOM from 'react-dom';
import Toast from '../helper/toast';

var StyleSheet = {
  hidden: {
    display: "none"
  },

  visible: {
    display: "block"
  },

  comment: {
    fontSize: "12px"
  },

  toolbarStyle: {
    padding: "15px 20px",
    textAlign: "center"
  }
};

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

  reset() {
    this.refs.pageForm.reset();
    this.setState({
    });
  }

  retrieveFormData(){
    var me = this;
    var _frmdata = this.refs.pageForm.getFormData();
    _frmdata["qsFile"] = ReactDOM.findDOMNode(this.refs.qsFile).files[0];
    return _frmdata;
  }

  doSubmit(){
    event.preventDefault();

    // 表单验证
    if(this.doValid()){
      this.setState({submitState: "submitted"});

      var frmdata = this.retrieveFormData();
      
      this.showLoading(true)
      // ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
      frmdata.paramUrl = 'picUrl';
      frmdata.username = 'liu';
      UploadAction.uploadfile('/upload', frmdata);
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
  // <form action="/apiQS/upload" encType="multipart/form-data" method="post">
  //   <input type="hidden" name="url" value="" /><br />
  //   <input type="hidden" name="username" value="liu" /><br />
  //   <input type="file" name="upload" multiple="multiple" /><br />
  //   <input type="submit" value="Upload" />
  // </form>
  render() {
    return (
      <Layout hideBack={true} className={'hotmatch'} title={'热门赛事'}>
        <PageForm ref="pageForm" className="form-horizontal" action="/apiQS/upload" enctype="multipart/form-data">
          <div className="form-group">
            <label className="col-sm-2 control-label">交易类型</label>
            <div className="col-sm-5">
              <select ref="adjustType" name="adjustType" className="form-control">
                <option value="1">人工调增</option>
                <option value="-1">人工调减</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-2 control-label">上传图片</label>
            <div className="col-sm-5">
              <input type="file" name="qsFile" ref="qsFile" accept=".jpg,.jpeg,.png,.gif" />
            </div>
            <div className="col-sm-4">
              <a href={this.state.file} target="_blank">下载批量文件模版</a>
            </div>
          </div>

          <div className="row">
            <div className="btn-toolbar col-lg-12" style={StyleSheet.toolbarStyle} role="toolbar" aria-label="工具栏">
              <button type="button" className="btn btn-primary" onClick={this.doSubmit.bind(this)} style={{width: "100px"}} disabled={this.state.submitState === "submitted" ? true : false}>确认上传</button>
            </div>
          </div>
        </PageForm>

      </Layout>
    )
  }
}
