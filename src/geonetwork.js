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
           uuidToDomId (uuid) {
             // first character must be letter and character other than "_" and "-" are forbidden
             return 'i' + uuid.toLowerCase().replace(/[^a-z0-9\-_]+/, '')
           },
           treatmentLinks (metaId, linkArr) {
             var links = this.strToArray(linkArr)
             var self = this
             var response = {}
             links.forEach(function (link, index) {
               // length === 7 for the translation
               if (link.length < 7) {
                 switch (link[3]) {
                 case 'OpenSearch':
                   response.api = {}
                   response.api.http = link[2]
                   response.api.name = link[0].length > 0 ? link[0] : link[1]
                   break;
                 case 'OGC:WMS': 
                 case 'OGC:WFS':
                 case 'OGC:WFS-G':
                 case 'OGC:KML':
                 case 'OGC:OWS':
                 case 'OGC:OWS-C':
                 case 'GLG:KML-2.0-http-get-map':
                   if (!response.layers) {
                     response.layers = []
                   }
                   var id = metaId + '_' + index
                   response.layers.push(self.linkToLayer(link, id))
                   break;
                 case 'WWW:DOWNLOAD-1.0-link--download':
                 case 'telechargement':
                   if (!response.download) {
                     response.download = []
                   }
                   response.download.push(self.linkToDownload(link))
                   break;
                 case 'WWW:LINK-1.0-http--link':
                 default:
                   if (!response.links) {
                     response.links = []
                   }
                   response.links.push(self.linkToLink(link))
                   break;
                 }
               }
             })
             return response
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