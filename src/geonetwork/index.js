const JSONPATH = require('jsonpath')

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
           facets: ['inspireThemeURI', 'mdActions', 'sourceCatalog', 'spatialRepresentationType', 'maintenanceAndUpdateFrequency', 'status'],
           addFacet (facet) {
        	   if (this.facets.indexOf(facet) < 0) {
        	     this.facets.push(facet)
        	   }
           },
           extractDataInfo (metadata, json, idLang) {
             metadata.title = this.extractFromLangs(
                  JSONPATH.query(json, "$..['gmd:citation']['gmd:CI_Citation']['gmd:title']"),
                  idLang)
             var description = this.extractFromLangs(
                 JSONPATH.query(json, "$..['gmd:abstract']"),
                 idLang)
             metadata.description = description.replace(/(?:\\[rn]|[\r\n])/g, '<br />')
             metadata.status = JSONPATH.query(json,"$..['gmd:status']['gmd:MD_ProgressCode']['@codeListValue']")[0]
             metadata.identifier = JSONPATH.query(json, "$..['gmd:identifier']..['gco:CharacterString']['#text']")[0]
            // metadata.dataCenter =
             metadata.topicCat = json['gmd:topicCategory']['gmd:MD_TopicCategoryCode']
             metadata.keyword = this.extractKeywords(json['gmd:descriptiveKeywords'], idLang)
             metadata.images = this.extractImages(json['gmd:graphicOverview'], idLang)
             var constraints = this.extractConstraints(
                 JSONPATH.query(json, "$..['gmd:resourceConstraints']..['gmd:MD_LegalConstraints']"),
                 idLang)
             if (constraints) {
               metadata.legalConstraints = constraints
             }
             var constraints = this.extractConstraints(
                 JSONPATH.query(json, "$..['gmd:resourceConstraints']..['gmd:MD_Constraints']"),
                 idLang)
             if (constraints) {
               metadata.constraints = constraints
             }
             var contacts = this.extractContacts(
                 JSONPATH.query(json, "$..['gmd:CI_ResponsibleParty']"),
                 'resource',
                 idLang)
             contacts.forEach(function (contact) {
               if (metadata.contacts.resource[contact[0]]) {
                 metadata.contacts.resource[contact[0]].push(contact)
               } else {
                 metadata.contacts.resource[contact[0]] = [contact]
               }
             })
             this.extractExtent(metadata, json['gmd:extent'])
           },
           extractBboxJson (json) {
             var latmin = json['gmd:southBoundLatitude']['gco:Decimal']['#text']
             var latmax = json['gmd:northBoundLatitude']['gco:Decimal']['#text']
             var lngmin = json['gmd:westBoundLongitude']['gco:Decimal']['#text']
             var lngmax = json['gmd:eastBoundLongitude']['gco:Decimal']['#text']
             return [lngmin, latmin, lngmax, latmax].join('|')
           },
           extractConstraints (json, idLang) {
             if (!json) {
               return null
             }
             var constraints = []
             if (!json || json.length === 0) {
               return null
             }
             var _this = this
             json.forEach (function (node) {
               var list = node['gmd:otherConstraints']
               if (list ) {
                 var list = !list.forEach ? [list] : list
                 list.forEach(function (constraint) {
                   constraints.push(_this.extractFromLangs(constraint, idLang))
                 })
               }
               var list = node['gmd:useLimitation']
               if (list ) {
                 var list = !list.forEach ? [list] : list
                 list.forEach(function (constraint) {
                   constraints.push(_this.extractFromLangs(constraint, idLang))
                 })
               }
             })
             return constraints
           },
           extractContacts (json, type, idLang) {
             var contacts = []
             if (!json) {
               return contacts
             }
             if (json.length > 0) {
               var _this = this
               json.forEach (function (jsoncontact) {
                  contacts.push(_this.extractContact(jsoncontact, type, idLang))
               })
             } else {
               contacts.push(this.extractContact(json, type, idLang))
             }
             return contacts
           },
           extractContact (json, type, idLang) {
            
             var role = JSONPATH.query(json, "$..['gmd:CI_RoleCode']['@codeListValue']")[0]
             var organisation = this.extractFromLangs(
                 JSONPATH.query(json, "$..['gmd:organisationName']" )[0],
                 idLang)
             var name = JSONPATH.query(json, "$..['gmd:individualName']['gco:CharacterString']" )[0]
             var email = JSONPATH.query(json, "$..['gmd:electronicMailAddress']..['#text']")[0]
             var address = null
             var position = null
             return [role, type, organisation, name, email, position, null, address]
           },
           extractDistributionInfo (metadata, json, idLang) {
             this.extractFormat(metadata, json['gmd:MD_Distribution']['gmd:distributionFormat'], idLang)
             this.extractLinks (metadata, json, idLang) 
           },
           extractExtent (metadata, json) {
             var geographics = JSONPATH.query(json, "$..['gmd:EX_GeographicBoundingBox']")
             var _this = this
             if (geographics.length > 1) {
               metadata.geobox = []
               geographics.forEach(function (boxjson) {
                 metadata.geobox.push(_this.extractBboxJson(boxjson))
               })
             } else {
               metadata.geobox = this.extractBboxJson(geographics[0])
             }
           },
           extractFormat (metadata, json, idLang) {
             var formats = []
             var _this = this
             var nodes = JSONPATH.query(json, "$..['gmd:MD_Format']")
             if (nodes === undefined) {
               return null
             }
             if (!nodes.forEach) {
               nodes = [nodes]
             }
             nodes.forEach(function (format) {
                formats.push(_this.extractFromLangs(format['gmd:name'], idLang))
             })
             metadata.format = formats
           },
           extractFromLangs(json, idLang) {
             var value = null
             if (json === undefined) {
               return null
             }
             if (idLang) {
               var values = JSONPATH.query(json, "$..['gmd:LocalisedCharacterString']")
               if (values.length > 0) {
                 values.forEach(function (node) {
                   if (node['@locale'] === '#' + idLang && node['#text']) {
                     value = node['#text']
                   }
                 })
               }
             }
             if (!value) {
               json = json.length > 0 ? json[0] : json
               value = json['gco:CharacterString']? json['gco:CharacterString']['#text'] : (json['gmx:Anchor'] ? json['gmx:Anchor']['#text'] : null)
             }
             return value
           },
           extractImages (json, idLang) {
             var images = []
             var _this = this
             if (json === undefined) {
               return null
             }
             if (!json.forEach) {
               json = [json]
             }
             json.forEach(function (image) {
               var file = image['gmd:MD_BrowseGraphic']['gmd:fileName']['gco:CharacterString']['#text']
               var description = _this.extractFromLangs(image['gmd:MD_BrowseGraphic']['gmd:fileDescription'], idLang)
               console.log(description)
               images.push(['overview', file, description])
             })
             return images
           },
           extractKeywords (json, idLang) {

             var keywords = []
             var _this = this
             json.forEach(function (keynode) {
               var list = keynode['gmd:MD_Keywords']['gmd:keyword']
               if (!list.forEach) {
                 list = [list]
               }
               list.forEach (function (node) {
                 keywords.push(_this.extractFromLangs(node, idLang))
               })
             })
             return keywords
           }, 
           extractLineage(metadata, json, idLang) {
             metadata.lineage = 'un tesst curiosité'
             var statements = JSONPATH.query(json, "$..['gmd:statement']")
             var sentences = []
             var _this = this
             statements.forEach(function (statement) {
               sentences.push(_this.extractFromLangs(statement, idLang))
             })
             metadata.lineage = sentences.join('<br />')
           },
           extractLinks (metadata, json, idLang) {
             var links = JSONPATH.query(json, "$..['gmd:CI_OnlineResource']")
             var _this = this
             links.forEach(function (online, index) {
               var protocol = online['gmd:protocol']['gco:CharacterString']['#text']
               var url = online['gmd:linkage']['gmd:URL']
               var name = _this.extractFromLangs(online['gmd:name'], idLang)
               var description = _this.extractFromLangs(online['gmd:description'], idLang)
               var link = {
                   id: index,
                   title: name,
                   description: description,
                   url: url,
                   type: protocol
                 }
               switch(protocol) {
               case 'UKST':
               case 'OpenSearch':
                 metadata.api = {
                   http: url,
                   name: name
                 }
                 break;
               case 'OGC:WMS': 
               case 'OGC:WFS':
               case 'OGC:WFS-G':
               case 'OGC:KML':
               case 'OGC:OWS':
               case 'OGC:OWS-C':
               case 'GLG:KML-2.0-http-get-map':
                   if (!metadata.layers) {
                     metadata.layers = []
                   }
                   var id = metadata.id + '_' + index
                   link.id = id
                   link.href = link.url
                   link.name = link.title
                   link.checked = false
                   delete link.url
                   delete link.title
                   metadata.layers.push(link)
                 break;
               case 'application/vnd.google-earth.kml+xml':
                 break;
               case 'WWW:DOWNLOAD-1.0-link--download':
               case 'telechargement':
                 if (!metadata.download) {
                   metadata.download = []
                 }
                 link.name = link.title
                 delete link.title
                 metadata.download.push(link)
                 break;
               case 'WWW:DOWNLOAD-1.0-link--order':
               case 'order':
                 if (!metadata.order) {
                   metadata.order = []
                 }
                 metadata.order.push(link)
                 break;
               
               case 'WWW:LINK-1.0-http--link':
               default:
                 if (!metadata.links) {
                   metadata.links = []
                 }
                 link.href = link.url
                 delete link.url
                 metadata.links.push(link)
                 break;
               }
             })
           },
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
           layerId2MetaId (layerId) {
             var metaId = layerId.match(/(.*)_[0-9]+$/)
             if (metaId && metaId.length === 2) {
               return metaId[1]
             } else {
               return null
             }
           },
           treatmentLinks (metaId, linkArr, local) {
             var links = this.strToArray(linkArr)
             var self = this
             var response = {}
             console.log(local)
             // keep length 7 if 
             links.forEach(function (link, index) {
               // length === 7 for the translation
               if ((!local && link.length > 6) || (link.length === 6 && local )) {
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
                    if ((!local && link.length >=7) || (local && link.length === 6)) {
                     if (!response.layers) {
                       response.layers = []
                     }
                     var id = metaId + '_' + index
                     response.layers.push(self.linkToLayer(link, id))
                    }
                   break;
                 case 'application/vnd.google-earth.kml+xml':
                   break;
                 case 'WWW:DOWNLOAD-1.0-link--download':
                 case 'telechargement':
                   if (!response.download) {
                     response.download = []
                   }
                   response.download.push(self.linkToDownload(link))
                   break;
                 case 'WWW:DOWNLOAD-1.0-link--order':
                 case 'order':
                   if (!response.order) {
                     response.order = []
                   }
                   response.order.push(self.linkToDownload(link))
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