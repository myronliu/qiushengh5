// 申请专家
import Layout from '../components/layout';
import PageForm from '../components/pageform';
import ReactDOM from 'react-dom';
import UploadAction from '../actions/uploadaction';
import UploadStore from '../stores/uploadstore';
import BasePage from '../components/BasePage.js';
import Cookie from '../helper/cookie';

var addIconSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAATdJREFUWAntmcEOATEQQGe6G3HmxkfwBz5KlgNOuBDf4Tv8gm/AzZkDRmfjsKqx23QTbcyedHZqX18ncxkE/dBi0r3TdQ0EAwLqcOzXDwKeAGGXYDPD6fKIOeTjsieA1q/hbN9HxLOG7aVsMlRIBiei9h2ua8XXbTtJUDHNqEKpyW9imFF9SwjpnYDWfRti9G+NpnWePJ1t3v7uNh++rX0WUqM+9mx7xajNik9MjPrYs+2NxqhTHzX7pO3kxVhZvkufjcaogBZLoI7fTjVaVlNmTZbluxxArt7FVpVcMVrFkkuOGHWxVSU3GqNOfbTs5HX2TfNb0RgVUPPqfNdi1NeguT8eo/n0wcQPbM2MikckgXF94mhGlTSSEY9IPt+GEXmNbzKF49VBw/Z1YBtSGTALM/GMiQdiT0AxQdOW+yWoAAAAAElFTkSuQmCC";
var selectIconSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAxRJREFUWAntmVtrE0EUx8/Ozq65VUwxlTYgVoUWROql+uqD4oOKWurXEPSTKPjgF+ibFyr6YiE+Cl5ahRZBSKHFS02N0ZpsYjKbXeds3O6OpMlmswkrZqDdmdnMOb/8z5mTTUYC3u4sfB0zdf22aRpn+XAY50LQCpJEMhKlN66fT32WLEjGVnSiJHRDVgCkEDAiggmU1JlssiKhylGKSjYgKYcMU5NANzgTgSGJMxIMd0PJMEE6LMiGjIRP8ZwMS7gdQKdnsQ0j6D/RBqBBh2mg6EDRoBUI2l7fczSdlOHy8RiQDks3Dfqdt7K3J0Zg5mQcoioBKkswv6iBYbZa4dzrm6JRRYJrpxqQ6P7QiAJXT8Qdkja9voDK3MvMdByScVnA+fRDF8atBn0BvTgVg3RSzLLlD1V4sVptxSbc6znomckITIyqgtO1PIOFlYow127QU9Cp/SqcPhgRGPLFOjxa8r6J7MWeQbGaYAgnRr09X4+nKJw7ErX9WNdS1YD7r0pQ856a2+vFxNmeFjsIeelYDCbHVP6HoGV4v8HEF7lGI7uxVsZ5rXSKJaub8PC1BsVfHuuRyx52PSl6gSuJkNYC7hyhd1J2KCLBLN/hKnUgTdOEx280yG3VLRt+/nkCzW4yXpgdJVCpZrAqj8/sdAISEdHss3cVWN30EW/XOxItum64uxjmJ2/LLWExyld4uFM87O62uFaFpfWae8pX31OOouVGTpYtJe3cs5XFnB3fS+FAStxo2RwDVDOI5hm0HawNb0N92dJ5FDR72PXVU+jdXnZKA/drflYMa4cz/3vHbc7qdwyKq5rB2pZrugkPeK3Uqs7ms+91c/UFig4R9mNB3MlYGeb5p06+ZHTD1HStb1C0du+lBht/noCwVj5drsB6XoRv6tXHZEeb6W/7+NA797wEh/dR+MZV/K4Fr6TtsytQ20g21xsVbft47Sr0bkO97g9Ag1Z4oOh/rWgBf9gPb7PYCvyhh2Tw9CGsoMiGjETZpdzEIxJKdA4bJmXx+Ea3jm/wrMn6YnM3k0+zKrsV5gOx30afD4N8Xd6LAAAAAElFTkSuQmCC';
var unselectIconSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAxdJREFUWAntmc9r02AYx983TbRdXBtQLxVvelQQBEEPniy4MTxMkTHwJuwyUVDwLxBFL2sFb4LDDgZT1FkFfxwEwcPcRRTxOrAKCm2qjWtL8vp9ttUlYcnSNu0CNpf3eZ7kfZ5Pv+8P0ryc4cq9+JEWjcYtxsVxIViaYlt9cc6KTPA3XFEuT2Z2F/ka5CKX2BSLKdMU3GpIqk9czGycswS7IMnKYZ4tFGcA+WHyZPp6FADdDLnnxavCYgclGm5S0v1AZHxiI8apwlcRGSgPEGKUPO5FLtwHDXtI+or2FQ1bgbDz9XyOVirGsXK5OieE2NbKj+kpqK4v77cs6zEgR8tl42ErsD0DrVTELiHMZ3g727mqpBgG7IOgqvYEFMrFTdMgJffZwfAq987u+9ldBwUc13VjmjFx1A7COb+raeo1e8zP7jqorv+5Adgzdggo+SqVGpiwxzazuwqK1T0hhHXFBfEplVJPQ9GGK+7rBgaFKrFS6fd9LICzvhnXbup6dQjmbfuzgPsej8eG0Or2eBA7EChBonAeCccx1/KbwZZK1UOWxWap3zoEN2CPJBKJpfVYcCsQKIbwHraVFSVXi3vDGoaxF+Wf4gftaGJAQSsWY2NYPO+bsVbbQKCcS/MoZjaTe8EinqzVrAIgHf9k0fdSMqk+afZvpw0EqmkDs4zxcT9YQMqYHnOAOOAE4Tms8Kwz1ronB+1CsJibDFtLflVR6IY5SD7FsVdmMD1OOPPxefS76Iy15wUGpfQ+sDOAdowO1F+EkmNorfbQnL0cyZ23NvY8poErD19SFDYCyOrGWVqPugoES9CElSTp3wKz9fwly/KwqqrfbLGOzbZAqSrBYq98ayegxca5PDo4uP2jPR6G3TYoFde0RAZb1wLZBIl5el7T4i/JD/tqaTG5iwOuDrgjhlE/ZZriczIZ/+J+Jiy/I1CCACx9EnoUFpBXno6G3itpN+J90LBV7Sv6/yqKt5/iyof9sCUIKR+xEaNERyR0+hBS3vDTEBsd49x5/XNPvVZfkDjLRvr4hiQg2MZy/WaUD8T+AsjyVj2+n9QHAAAAAElFTkSuQmCC';

var closeIconSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAAoBJREFUWAntmV1q3DAQx0e2E/pQeoDkDn0KhD71GIUGCrlAHpJt89F9WNqlX/mAnCAQyEKOEfIQSulLDpEDhEDS7srq/GVr67q215K92AELjCx5ZvTTjCwPliAu6uu7JflbHpCil4rUEvqaLoLEDQm68Bf9ntj+diM05C/5U3h07C34p+hsGhLjgyscyzdKqQ1/MVgRk49bIyHo2u8ffmkDYJpBDrd2lKLnHsINT6YF2tLWbMxI4w+bqi1QeRxg9PIetq2/A607Ip1HO4/W7YG67TmvUaUGnvrUe1EWCLLQKSuflnNSxIByeHsiZXg5GW6+ShtNtyEDWei4wlqDGkj+/nLCQD5/gs+KYPUzloEsdFxhrUHp890qe2zNeK0INglp5LVuZCPRNfvWGlTsHVxxnrjGGZc05rNgsyC1DnRhw7IElvJaPOgfnTMI80YhRSdg0Ua/LnG4owaRgYSu6bOprT1qjOsBszwb0oj40l6OhatCwowzKJQzYdkm541Tu3VAVgb9B5bYj6nCSyHEenYNd9LcdObJzjbeVwadvt2JcJuJ6iUwY581srPqSqBTSGz8cUG4dcjjdtbWZWRtamfQTEjsrR69xqVfohphnUBzIeMXJ3M3KPG5LfKwNajOmEps5kWwNlmXgbcGpd2n31n5zBgo2iezYLVuZMOYKFVbgwoxCP3+s3UGPC2CNKMnYaET6Q7+23ONfG7t+gMC6Z5NCKskzprRFTR35nN40P0pmYNT/2Y58zBep03rt77OwW1sdaA23ioj+3g8itMH/NgvM6smZMAGRg9HJDh9aAKizJiajRkDXzx5K9X9Dz59oFYf32BWavh+WaqH/TYfiP0BqlVhFTNWLFsAAAAASUVORK5CYII=";

export default class extends BasePage {
  state={
    applyStatus: 'expert',
    expertChecked: false,
    keeperChecked: false,
    expertCheckedSrc: unselectIconSrc,
    keeperCheckedSrc: unselectIconSrc,
    keepCardImgUrl: '',
    licenceImageUrl: '',
    expertCardImageUrl: ''
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

  submitShopkeeperForm(){
    event.preventDefault();
    // 表单验证
    if(this.doValid('keeperCard') && this.doValid('shopLicence')){
      // this.setState({submitState: "submitted"});
      // var frmdata = this.retrieveFormData('expertForm', 'expertCard');
      // var token = Cookie.getCookie("token") || '';
      // this.showLoading(true)
      // // ApiAction.post(UrlConfig.matchList, {status:2, matchTypes:'', token: Cookie.getCookie("token") || 'dds'});
      // frmdata.token = token;
      // frmdata.name = this.refs.expertName.value;
      // frmdata.phone = this.refs.expertPhone.value;
      // frmdata.content = this.refs.expertDescribe.value;
      // frmdata.paramUrl = 'cardPic';
      // frmdata.username = token.substr(token.length-6);
      // console.log('form data:',frmdata);
      // UploadAction.uploadfile('/lottery/expert/apply', frmdata);
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
    if(!this.state.expertChecked){
      Toast.show("请仔细阅读并同意专家协议", 'info');
      return false;
    }
    return true;
  }
  preLoadImg(file, type) {
		var reader = new FileReader();
		let _this = this;
		reader.readAsDataURL(file);
		reader.onload = function (e) {
			_this.showLoading(false);
      if(type === 'keeperCard'){
        _this.setState({keepCardImgUrl: e.target.result});
      }else if(type === 'licence'){
        _this.setState({licenceImageUrl: e.target.result});
      }else if(type === 'expertCard'){
        _this.setState({expertCardImageUrl: e.target.result});
      }

		};
	}



  chooseExpertCard(){
    this.refs.expertCard.click();
  }
  chooseKeeperCard(){
    this.refs.keeperCard.click();
  }

  chooseLicence(){
    this.refs.shopLicence.click();
  }

  applyForm(){
    if(this.state.applyStatus === 'expert'){
      this.submitExpertForm();
    }else if(this.state.applyStatus === 'shopkeeper'){
      this.submitShopkeeperForm();
    }
  }
  checkExpertContract(){
    if(this.state.expertChecked){
      this.setState({
        expertChecked: false,
        expertCheckedSrc: unselectIconSrc
      });
    }else{
      this.setState({
        expertChecked: true,
        expertCheckedSrc: selectIconSrc
      });
    }
  }
  checkKeeperContract(){
    if(this.state.keeperChecked){
      this.setState({
        keeperChecked: false,
        keeperCheckedSrc: unselectIconSrc
      });
    }else{
      this.setState({
        keeperChecked: true,
        keeperCheckedSrc: selectIconSrc
      });
    }
  }

  gotoContract(type){
    window.to(`/contract?type=${type}`);
  }

  closePreview(key){
    this.setState({
      [key]: ''
    });
  }

  renderApply(status){
    if(status === 'expert'){
      // 专家
      return (
        <div className="user-input">
          <div className="input-area">
            <div className="input-item">
              <span className="item-label">姓名</span>
              <input className="item-input" type="text" ref='expertName' placeholder="请输入您的真实姓名"/>
            </div>
            <div className="input-item">
              <span className="item-label">联系电话</span>
              <input className="item-input" type="tel" ref='expertPhone' placeholder="请输入您的联系电话"/>
            </div>
            <div className="file-item">
              <span className="item-label">上传身份证正面照</span>
              <img className="add-card" src={addIconSrc} onTouchEnd={this.chooseExpertCard.bind(this)}/>
              <PageForm ref="expertForm" className="form-horizontal" action="/apiQS/upload" enctype="multipart/form-data">
                <input type="file" name="qsFile" ref="expertCard" capture="camera" accept=".jpg,.jpeg,.png,.gif" onChange={($e)=> {
                   let files = $e.target.files;
                   if (files.length == 0) return;
                   this.preLoadImg(files[0], 'expertCard');
                 }}/>
              </PageForm>
            </div>
            <div className="image-preview" style={{display: this.state.expertCardImageUrl === "" ? "none" : "block"}}>
              <img className="preview-image" src={this.state.expertCardImageUrl} />
              <img className="close" src={closeIconSrc} onTouchEnd={this.closePreview.bind(this, 'expertCardImageUrl')}/>
            </div>

            <textarea placeholder="描述一下你的简介" ref='expertDescribe' rows="6"></textarea>
          </div>
          <div className="role-area">
            <img className="checkbox-icon" src={this.state.expertCheckedSrc} onTouchEnd={this.checkExpertContract.bind(this)}/>
            <span>已阅读并同意<span className="contract-name" onTouchEnd={this.gotoContract.bind(this, 'expert')}>《专家协议》</span></span>
          </div>
        </div>
      );
    }else{
      return (
        <div className="user-input">
          <div className="input-area">
            <div className="input-item">
              <span className="item-label">姓名</span>
              <input className="item-input" type="text" ref='keeperName' placeholder="请输入您的真实姓名"/>
            </div>
            <div className="input-item">
              <span className="item-label">联系电话</span>
              <input className="item-input" type="tel" ref='keeperPhone' placeholder="请输入您的联系电话"/>
            </div>
            <div className="input-item">
              <span className="item-label">彩票站点地址</span>
              <input className="item-input" type="tel" ref='keeperPhone' placeholder="请输入您的站点地址"/>
            </div>
            <div className="file-item">
              <span className="item-label">上传身份证正面照</span>
              <img className="add-card" src={addIconSrc} onTouchEnd={this.chooseKeeperCard.bind(this)}/>
              <PageForm ref="keeperCardForm" className="form-horizontal" action="/apiQS/upload" enctype="multipart/form-data">
                <input type="file" name="qsFile" ref="keeperCard" capture="camera" accept=".jpg,.jpeg,.png,.gif" onChange={($e)=> {
                   let files = $e.target.files;
                   if (files.length == 0) return;
                   this.preLoadImg(files[0], 'keeperCard');
                 }}/>
              </PageForm>
            </div>
            <div className="image-preview" style={{display: this.state.keepCardImgUrl === "" ? "none" : "block"}}>
              <img className="preview-image" src={this.state.keepCardImgUrl} />
              <img className="close" src={closeIconSrc} onTouchEnd={this.closePreview.bind(this, 'keepCardImgUrl')}/>
            </div>
            <div className="file-item">
              <span className="item-label">上传营业执照</span>
              <img className="add-card" src={addIconSrc} onTouchEnd={this.chooseLicence.bind(this)}/>
              <PageForm ref="shopLicenceForm" className="form-horizontal" action="/apiQS/upload" enctype="multipart/form-data">
                <input type="file" name="qsFile" ref="shopLicence" accept=".jpg,.jpeg,.png,.gif" onChange={($e)=> {
                   let files = $e.target.files;
                   if (files.length == 0) return;
                   this.preLoadImg(files[0], 'licence');
                 }}/>
              </PageForm>
            </div>
            <div className="image-preview" style={{display: this.state.licenceImageUrl === "" ? "none" : "block"}}>
              <img className="preview-image" src={this.state.licenceImageUrl} />
              <img className="close" src={closeIconSrc} onTouchEnd={this.closePreview.bind(this, 'licenceImageUrl')}/>
            </div>
          </div>
          <div className="role-area">
            <img className="checkbox-icon" src={this.state.keeperCheckedSrc} onTouchEnd={this.checkKeeperContract.bind(this)}/>
            <span>已阅读并同意<span className="contract-name" onTouchEnd={this.gotoContract.bind(this, 'stationmaster')}>《站长协议》</span></span>
          </div>

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
  renderTitleComponent(){
    return (
      <div className="switch-area">
        <div className={this.state.applyStatus === 'expert' ? 'active': 'unactive'} onTouchEnd={this.switchApplyStatus.bind(this, 'expert')}>申请专家</div>
        <div className={this.state.applyStatus === 'shopkeeper' ? 'active': 'unactive'} onTouchEnd={this.switchApplyStatus.bind(this, 'shopkeeper')}>申请站长</div>
      </div>
    );
  }

  render(){
    var titleComponent = this.renderTitleComponent();
    return (
      <Layout hideBack={false} className={'apply-expert'} title={titleComponent}>
        {this.renderApply(this.state.applyStatus)}
        <div className="apply-button-area" onTouchEnd={this.applyForm.bind(this)}>
          <div className="apply-button">申请</div>
        </div>
      </Layout>
    )
  }
}
