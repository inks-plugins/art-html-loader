const vm = require('vm')
const path = require('path')
const template = require('art-template')
const loaderUtils = require('loader-utils')

const selfOptions = {
  root: process.cwd() + '/src/',
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production'
}

const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;

const loadersApi = function (source) {
  let options = {}
  const loaderoptions = loaderUtils.getOptions(this) || {}
  options = Object.assign({}, selfOptions, loaderoptions)
  // 获取art模板
  let artTpl = /<template>([\S\s]*)<\/template>/.exec(source)
  if (artTpl && artTpl.length >= 2) artTpl = artTpl[1]

  // 获取art data 数据
  let jsCode = /<script>([\S\s]*)<\/script>/.exec(source)
  if (jsCode && jsCode.length >= 2) jsCode = jsCode[1]
  const dataObj = new Function('data', jsCode)()
  let artData = dataObj.data

  // 合并引入的data文件
  const importData = dataObj.importData
  if (importData) {
    if (typeof importData === 'string') {
      const importDataPath = path.join(options.root, importData)
      const importDataObj = requireFunc(importDataPath)
      artData = Object.assign({}, importDataObj, artData)
    }
    if (importData instanceof Array) {
      importData.map(d => {
        const importDataPath = path.join(options.root, d)
        const importDataObj = requireFunc(importDataPath)
        artData = Object.assign({}, importDataObj, artData)
      })
    }
  }

  // 将页面没有直接引入但需要热更新的art文件加入依赖监听
  const artHot = dataObj.artHot
  if (artHot) {
    if (typeof artHot === 'string') {
      const cPath = path.join(options.root, artHot)
      this.addDependency(cPath)
    }
    if (artHot instanceof Array) {
      artHot.map(c => {
        const cPath = path.join(options.root, c)
        this.addDependency(cPath)
      })
    }
  }

  // 将引入的art依赖组件加入依赖监听
  let dependComponent = source.match(/\'(\S*?\.art)\'/g)
  dependComponent.map(c => {
    c = /\'(\S*?\.art)\'/.exec(c)[1]
    const cPath = path.join(options.root, c)
    this.addDependency(cPath)
  })

  // 编译art模板文件
  let tpl = template.render(artTpl, artData, options)

  if (dataObj.main) {
    const htmlList = tpl.split('</body>')
    tpl = htmlList[0] + `<script>(${dataObj.main})(windows)</script></body>` + htmlList[1]
  }
  return tpl
}

module.exports = loadersApi
