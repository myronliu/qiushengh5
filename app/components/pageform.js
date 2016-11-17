var React = require('react');
var FormHelper = require('../helper/form');
import ReactDOM from 'react-dom';

module.exports = React.createClass({
  getDefaultProps: function() {
    return {
      className : "form-horizontal",
      name: "pageForm",
      id: "",
      enctype: "",  // 包含文件时为：multipart/form-data
      method: "post",
      action: "/"
    };
  },

  getFormData: function(preData){
    var _frm = ReactDOM.findDOMNode(this.refs.pageForm);
    var _data = FormHelper.getFormData(_frm, preData);

    return _data;
  },

  reset: function(){
    ReactDOM.findDOMNode(this.refs.pageForm).reset();
  },

  render:function(){
    return (
      <form ref="pageForm" name={this.props.name} id={this.props.id} className={this.props.className}
        method={this.props.method} action={this.props.action} encType={this.props.enctype}>
        {this.props.children}
      </form>
    )
  }
});