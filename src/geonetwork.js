const GeonetworkPlugin = {
    install(Vue, options) {
       Vue.prototype.$gn = {
           $http: null,
           init: function (locale, server, http) {
             this.$http = http
             this.geonetwork = server
             this.setLocale(locale)
             this.getTranslation()

           },
           lang: {},
           locale: null,
           done: false,
           getTranslation () {
             if (!this.geonetwork) {
               return
             }
             var json = this.geonetwork + 'catalog/locales/' + this.locale + '-search.json'
             this.$http.get(json).then(
                  response => { this.lang = Object.assign(this.lang, response.body)}
              )
             
              // default topic categories
              var json = this.geonetwork + 'srv/api/0.1/standards/iso19139/codelists/gmd:MD_TopicCategoryCode'
              this.$http.get(json, {
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Accept-Language': this.locale === 'fr' ? 'fre': 'eng'
                }
              }).then( response => { this.lang = Object.assign(this.lang,response.body)})
             // group name
              var json = this.geonetwork + 'srv/api/0.1/tools/i18n/db?type=Group'
              this.$http.get(json, {
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Accept-Language': this.locale === 'fr' ? 'fre': 'eng'
                }
              }).then( response => { this.lang = Object.assign(this.lang,response.body)})
           },
           setLocale: function (lang) {
             if (!this.geonetwork || !this.$http) {
               return
             }
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
             return link
           },
           t (str) {
             if (this.lang && this.lang[str]) {
               return this.lang[str];
             } else {
               return str;
             }
           }
       }
   }
}

export default GeonetworkPlugin;