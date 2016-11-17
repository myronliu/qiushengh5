var EvoFlux = require('evoflux');

module.exports = EvoFlux.createStore("uploadfile", {
  init:function(){
    this.data={};
    this.triggerTo={
      uploadfile: "uploadfile"
    };
  },


  uploadfile: function(cb){
    this.on("uploadfile",function(){
      cb(this.data);
    }.bind(this));
  },

  actions:{
    uploadfile: function(data){
      this.data = data.data;
    },
  }
});