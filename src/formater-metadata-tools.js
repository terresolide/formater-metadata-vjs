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
//         var json = () => import('./assets/geonetwork-' + this.$locale + '.json')
//         if (process.env.URL) {
//           // other geonetwork words
//           var json = process.env.URL +  '/assets/geonetwork-' + this.$locale + '.json'
//           this.$http.get(json).then( response => { Vue.prototype.$gnLang = Object.assign(_this.$gnLang,response.body)})
//         }
       }
		   
		   Vue.prototype.$gn = {
		       lang: {},
		       locale: null,
		       done: false,
		       getTranslation () {
		         if (!geonetwork) {
		           return
		         }
		         var json = geonetwork + 'catalog/locales/' + this.locale + '-search.json'
	           Vue.$http.get(json).then(
	                response => { Vue.prototype.$gn.lang = Object.assign(this.lang, response.body)}
	            )
	           
	            // default topic categories
	            var json = geonetwork + 'srv/api/0.1/standards/iso19139/codelists/gmd:MD_TopicCategoryCode'
	            Vue.$http.get(json, {
	              headers: {
	                'Accept': 'application/json, text/plain, */*',
	                'Accept-Language': this.locale === 'fr' ? 'fre': 'eng'
	              }
	            }).then( response => { Vue.prototype.$gn.lang = Object.assign(_this.$gn.lang,response.body)})
	           // group name
	            var json = geonetwork + 'srv/api/0.1/tools/i18n/db?type=Group'
	            Vue.$http.get(json, {
	              headers: {
	                'Accept': 'application/json, text/plain, */*',
	                'Accept-Language': this.locale === 'fr' ? 'fre': 'eng'
	              }
	            }).then( response => { Vue.prototype.$gn.lang = Object.assign(this.lang,response.body)})
	         },
		       setLocale: function (lang) {
		         if (['en', 'fr'].indexOf(lang) >=0) {
		           if (this.locale !== lang) {
		             this.locale = lang
		             this.getTranslation()
		           }
		         }
		       },
		       strToArray(tabs) {
		         var myArray = []
		         if (typeof tabs === 'string') {
		           myArray.push(tabs.split('|'))
		         } else {
		           myArray = tabs.map(tab => tab.split('|'))
		         }
		         return myArray;
		       },
		       linkToLayer (arr, id) {
		         var layer = {
		             id: id,
		             name: arr[0],
		             description: arr[1],
		             href: arr[2],
		             type: arr[3],
		             checked: false
		         }
		         return layer
		       },
		       linkToDownload (arr, id) {
		         var download = {
		             id: id,
		             name: arr[0],
		             description: arr[1],
		             url: arr[2],
		             type: arr[3]
		         }
		         return download;
		       },
		       linkToLink (arr, id) {
		         var link = {
		             id: id,
		             title: arr[0],
		             description: arr[1],
		             href: arr[2],
		             type: arr[3]
		         }
		       },
		       t (str) {
		         if (this.lang && this.lang[str]) {
		           return this.lang[str];
		         } else {
		           return str;
		         }
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
     
       Vue.prototype.$gnLinkToLayer = function (arr, id) {
         var layer = {
             id: id,
             name: arr[0],
             description: arr[1],
             href: arr[2],
             type: arr[3],
             checked: false
         }
         return layer
       }
       Vue.prototype.$gnLinkToDownload = function (arr, id) {
         var download = {
             id: id,
             name: arr[0],
             description: arr[1],
             url: arr[2],
             type: arr[3]
         }
         return download;
       }
       Vue.prototype.$gnLinkToLink = function (arr, id) {
         var download = {
             id: id,
             title: arr[0],
             description: arr[1],
             href: arr[2],
             type: arr[3]
         }
         return download;
       },
		   Vue.prototype.$gn = function (str) {
		     if (this.$gnLang && this.$gnLang[str]) {
		       return this.$gnLang[str];
		     } else {
		       return str;
		     }
		   }
		   Vue.prototype.$gnExtractText = function (obj, lang) {
		     if (obj[lang]) {
		       return obj[lang]
		     } else {
		       return obj[Object.keys(obj)[0]]
		     }
		   }
	 }
}

export default MetadataToolsPlugin;