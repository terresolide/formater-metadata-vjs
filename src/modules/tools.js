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
      },
      Vue.prototype.$box2sql = function (box)  {
        var tab = box.split(',')
        if (tab.length < 4) {
          return null
        }
        var points = [
          tab[0] + ' ' + tab[1],
          tab[0] + ' ' + tab[3],
          tab[2] + ' ' + tab[3],
          tab[2] + ' ' + tab[1],
          tab[0] + ' ' + tab[1]
        ]
        return 'POLYGON((' + points.join(',') + '))'
      }
    }
}
export default ToolsPlugin;