var parse = require('../loader/parse')
const loaderUtils = require('loader-utils');
module.exports = function (content) {
    //npm link  挂在本地全局

    //获取传入参数
    const options = loaderUtils.getOptions(this);

    var html = parse(content)
    console.log(html)
    /* 返回必须是string 或者 buffer
     * parse 返回结构 {
     *       template:'',
     *       script:'',
     *       stype:'',    
     *      }
     */
    return html
}

