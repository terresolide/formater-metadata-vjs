/**
 * 
 */

const ToolsPlugin = {
    install(Vue, options) {
      Vue.prototype.$custURL = function (url) {
        var split = url.split(/\&|\?|#/)
        var params = []
        var authParams = []
        split.forEach(function(tab) {
          var value = tab.split('=')
          if (value.length > 1) {
            if (['code', 'state', 'session_state', 'error'].indexOf(value[0]) >= 0) {
              authParams[value[0]] = value[1]
            } else {
              params[value[0]] = value[1]
            }
          }
        })
        this.base = split[0]
        this.params = params
        this.authParams = authParams
        return this
      }
    }
}
export default ToolsPlugin;