const fs = require('fs')
const path = require('path')
const sep = path.sep

function VersionPlugin (options) {
  this.options = options || {}
}

VersionPlugin.prototype.apply = function (compiler) {
  var self = this
  compiler.plugin('afterPlugins', function (params) {
    const packageJsonPath = path.join(params.context, sep + 'package.json')
    const dateStr = getDateStr()
    let packageJsonStr = fs.readFileSync(packageJsonPath, 'utf8')
    const r = new RegExp('(?<=version\\":\\s*\\")(.*)(?=")')
    packageJsonStr = packageJsonStr.replace(r, "1.0." + dateStr)
    fs.writeFileSync(packageJsonPath, packageJsonStr, 'utf8')
  })
}

function getDateStr () {
  const now = new Date()
  return now.getFullYear() + format(now.getMonth() + 1) + format(now.getDate()) + format(now.getHours()) + format(now.getMinutes())
  function format (num) {
    return num < 10 ? '0' + num : '' + num
  }
}

module.exports = VersionPlugin
