const GeonetworkPlugin = {
    install(Vue, options) {
       Vue.prototype.$gn = {
           $http: null,
           $store: null,
           init: function (locale, server, http, store) {
             this.$http = http
             this.$store = store
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
           treatmentLinks (metaId, linkArr, local) {
             var links = this.strToArray(linkArr)
             var self = this
             var response = {}
             // keep length 7 if 
             links.forEach(function (link, index) {
               // length === 7 for the translation
               if (!local || (link.length === 6 && local )) {
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
                   if (link.length < 7) {
                     if (!response.layers) {
                       response.layers = []
                     }
                     var id = metaId + '_' + index
                     response.layers.push(self.linkToLayer(link, id))
                   }
                   break;
                 case 'WWW:DOWNLOAD-1.0-link--download':
                 case 'telechargement':
                   if (!response.download) {
                     response.download = []
                   }
                   response.download.push(self.linkToDownload(link))
                   break;
                 case 'UKST':
                  
                   if (link[6] && link[6].toLowerCase() === 'opensearch') {
                     response.api = {}
                     response.api.http = link[2]
                     response.api.name = link[0].length > 0 ? link[0] : link[1]
                   }
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
           treatmentMetadata (meta, uuid) {
             meta.id = uuid
             if (this.$store.state.geonetwork) {
                 meta.logo = this.$store.state.geonetwork + meta.logo.replace(/^\//, '')
                 meta.exportLinks = {
                     xml: this.$store.state.geonetwork + 'srv/api/records/'+ uuid + '/formatters/xml?attachment=true',
                     pdf: this.$store.state.geonetwork + 'srv/api/records/'+ uuid + '/formatters/xsl-view?root=div&output=pdf'
                 }
             }
             if (typeof meta.abstract === 'object') {
               meta.abstract = meta.abstract[0]
             }
             if (meta.abstract) {
               meta.abstract = meta.abstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
             }
             if (meta.defaultAbstract) {
               meta.defaultAbstract = meta.defaultAbstract.replace(/(?:\\[rn]|[\r\n])/g, '<br />');
             }
             
             meta.description = meta.abstract ? meta.abstract: meta.defaultAbstract
             
             meta.osParameters = []
             meta.mapping = []
             if (meta.image) {
                 meta.images =  this.strToArray(meta.image)
                 meta.images.forEach( function (image, index) {
                   if(image[0] === 'thumbnail') {
                     meta.thumbnail = image[1]
                   }
                 })
             }
             var self = this
             // constraints
             this.$store.state.constraintList.forEach (function (constraint) {
               if (meta[constraint] && typeof meta[constraint] === 'string') {
                 meta[constraint] = [meta[constraint]]
               }
             }) 
             
             // contacts
             var contacts = {metadata: {}, resource: {}}
             if (meta.responsibleParty) {
                   if (typeof meta.responsibleParty === 'string') {
                     meta.responsibleParty = [meta.responsibleParty]
                   }
                  meta.responsibleParty.forEach( function (contact)  {
                     var fields = contact.split('|');
                     if(fields.length < 11) {
                     // keep only main contact not the translation
                       if (fields[1] === 'metadata' || fields[1] === 'metadonnées') {
                        if (contacts.metadata[fields[0]]){
                          contacts.metadata[fields[0]].push(fields)
                        } else {
                          contacts.metadata[fields[0]] = [fields]
                        }
                       }else{
                         if (contacts.resource[fields[0]]){
                            contacts.resource[fields[0]].push(fields)
                         } else {
                            contacts.resource[fields[0]] = [fields]
                         }
                       }
                     }
                 })
             }
             delete meta.responsibleParty
             meta.contacts = contacts
             
             if (!meta.link) {
               return meta;
             }
             // links
             var links = this.treatmentLinks(meta.id, meta.link, meta._locale === meta.docLocale)
             meta = Object.assign(meta, links)
             delete meta.link
             return meta
           },
           extractBbox(bbox, id) {
             if (!bbox) {
               return null
             }
             switch (typeof bbox) {
             case 'string':
               var geometryType = 'Polygon'
               var path = this.bboxString2Array(bbox)
               break;
             case 'object':
               var geometryType = 'MultiPolygon'
               var self = this
               var path = []
               bbox.forEach(function(box) {
                 path.push(self.bboxString2Array(box))
               })
               break;
             }
             
             if (path) {
              var feature = {
                     type: 'Feature',
                     id: id,
                     geometry: {
                       type: geometryType,
                       coordinates:path
                     }
                   }
             }
             return feature
           },
           bboxString2Array (bbox) {
             var bboxList = this.strToArray(bbox)
             var path = []
             //trouble with rectangle ??? add polygon!
             bboxList.forEach(function (tab){
               tab = tab.map(x => parseFloat(x))
               var latmin = Math.min(tab[3], tab[1])
               var latmax = Math.max(tab[3], tab[1])
               var lngmin = Math.min(tab[0], tab[2])
               var lngmax = Math.max(tab[0], tab[2])
               path.push([[lngmin, latmin], [lngmin, latmax], [lngmax, latmax], [lngmax, latmin], [lngmin, latmin]])
               
             })
             return path
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