const MetadataToolsPlugin = {
		install(Vue, options) {
//		    Vue.prototype.$myAddedProperty = 'Example Property'
//		    Vue.prototype.$myAddedMethod = function() {
//		   	  return Vue.myAddedProperty
//		    }
		   Vue.prototype.$gnLang = {}
		   Vue.prototype.$locale = null
		   Vue.prototype.$gnDone = false
		   Vue.prototype.$getGnLangue = function () {
         if (process.env.GEONETWORK ) {
           var _this = this
           console.log(_this.$locale)
           // default search json
           var json = process.env.GEONETWORK + 'catalog/locales/' + _this.$locale + '-search.json'
           this.$http.get(json).then(
                response => { Vue.prototype.$gnLang = Object.assign(_this.$gnLang,response.body)}
            )
           
            // default topic categories
            var json = process.env.GEONETWORK + 'srv/api/0.1/standards/iso19139/codelists/gmd:MD_TopicCategoryCode'
            this.$http.get(json, {
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': _this.$locale === 'fr' ? 'fre': 'eng'
              }
            }).then( response => { Vue.prototype.$gnLang = Object.assign(_this.$gnLang,response.body)})
           // group name
            var json = process.env.GEONETWORK + 'srv/api/0.1/tools/i18n/db?type=Group'
            this.$http.get(json, {
              headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': _this.$locale === 'fr' ? 'fre': 'eng'
              }
            }).then( response => { Vue.prototype.$gnLang = Object.assign(_this.$gnLang,response.body)})
         }
       }
		   Vue.prototype.$setGnLocale = function (lang) {
		     if (['en', 'fr'].indexOf(lang) >=0) {
		       if (this.$locale !== lang) {
		         Vue.prototype.$locale = lang
		         this.$getGnLangue()
		       }
		     }
		   }
       Vue.prototype.$gnToArray = function (tabs) {
         var myArray = []
         if (typeof tabs === 'string') {
           myArray.push(tabs.split('|'))
         } else {
           myArray = tabs.map(tab => tab.split('|'))
         }
         return myArray;
       }
		   Vue.prototype.$gn = function (str) {
		     console.log(str)
		     console.log(this.$gnLang[str])
		     if (this.$gnLang && this.$gnLang[str]) {
		       return this.$gnLang[str];
		     } else {
		       return str;
		     }
		   }
	 }
}

export default MetadataToolsPlugin;