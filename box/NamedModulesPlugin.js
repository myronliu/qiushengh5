const crc16 = require('js-crc').crc16;
const md5 = require('md5');

function NamedModulesPlugin(options) {
  this.options = options || {};
}

NamedModulesPlugin.prototype.apply = function (compiler) {
  compiler.plugin('compilation', (compilation) => {
    compilation.plugin('before-module-ids', (modules) => {
      const tmpArr = [];
      modules.forEach(function (module, index) {
        if (module.id === null && module.libIdent) {
          const tmpId = module.libIdent({
            context: this.options.context || compiler.options.context,
          });
          module.id = crc16(tmpId);
          const thisIndex = tmpArr.findIndex(data => data.id === module.id);
          if (thisIndex === -1) {
            tmpArr.push({
              id: module.id,
              index,
              tmpId,
            });
          } else {
            modules[tmpArr[thisIndex].index].id = md5(tmpArr[thisIndex].tmpId);
            module.id = md5(tmpId);
          }
        }
      }, this);
    });
  });
};

module.exports = NamedModulesPlugin;
