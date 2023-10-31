<i18n>{
   "en":{
     "localize": "Localize on the map",
     "command_line": "Download from command line",
     "display_layer": "Display the layer on the map",
     "download_data": "Download data",
     "download_forbidden": "Forbidden download",
     "platform": "Platform | Platforms",
     "order_data": "Order data"
   },
   "fr":{
     "localize": "Localiser sur la carte, cliquer pour garder la position",
     "command_line": "Télécharger en ligne de commande",
     "display_layer": "Afficher sur la carte",
     "download_data": "Télécharger les données",
     "download_forbidden": "Téléchargement interdit",
     "platform": "Plateforme | Plateformes",
     "order_data": "Commander les données"
   }
}
</i18n>
<template>
  <span class="mtdt-related" :class="'mtdt-related-' + type" v-if="!empty || type === 'cartouche'">
       <div class="formater-message" v-if="message" @click="message = ''">{{message}}</div>
       <div class="fmt-progress-bar-container" v-if="progress!==null && progress < 100" style="width: 70px;padding:0;">
       <div @click="abortRequest" style="width:100%;text-align:right;">
       <i class="fa fa-close" style="color:darkred;width:40px;text-align:right;cursor:pointer;margin:0"></i></div>
       
       <progress-bar :value="progress"  :options="progressBarOptions"></progress-bar>
         </div>
    <div v-if="type === 'cartouche' && hasBboxLayer" style="display:inline-block;" >
      <div class="mtdt-related-type fa fa-dot-circle-o" :style="{backgroundColor:primary}" 
     :title="$t('localize')"   @click="fixBbox">
      </div>
    
    </div>
    <!-- ****** layers ****** -->
    <!-- view Cartouche and a lonely layer -->
    <div v-if="layers && layers.length === 1 && type === 'cartouche'">
    
     <div v-if="access.view === 'free'" class="mtdt-related-type fa fa-globe" @click="changeLayer(layers[0], true)" 
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
      </div>
       <!--  case from service with token -->
       
      <div v-else-if="token && token!==-1 && canView" class="mtdt-related-type fa fa-globe" @click="changeLayer(layers[0], true)" 
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
      </div>
      <div v-else-if="!token && canView" class="mtdt-related-type fa fa-globe" @click="authorize"
     :style="{backgroundColor: layerAdded ? '#8c0209' : primary, opacity:0.8}" :title="$t('display_layer')">
      </div>
      <div v-else-if="!token || !canView"  class="mtdt-related-type fa fa-globe disabled" 
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
      </div> 
      <!--  no authentication needed -->
      <!--   <div v-if="!token" class="mtdt-related-type fa fa-globe" @click="changeLayer(layers[0], true)" 
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
      </div> -->
   </div>
   <div v-if="type === 'metadata'"></div>
    <div v-if="layers && (layers.length > 1 || (type === 'metadata' && layers.length > 0))">
      <!--  case service without token -->
      <div v-if="access.view === 'free'" class="mtdt-related-type fa fa-globe" 
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
          <span class="fa fa-caret-down" v-if="type === 'cartouche'"></span>
       </div>
     <!-- with service and token -->
      <div v-else-if="!token && canView" class="mtdt-related-type fa fa-globe"  @click="authorize" @mouseover="$event.preventDefault()"
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary, opacity:0.8}" :title="$t('display_layer')">
          <span class="fa fa-caret-down" v-if="type === 'cartouche'"></span>
       </div>
      <div v-else class="mtdt-related-type fa fa-globe"  :class="{disabled: !canView}"
      :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
          <span class="fa fa-caret-down" v-if="type === 'cartouche'"></span>
       </div>
       <div class="mtdt-expand" v-if="canView || access.view === 'free' || type === 'metadata'">
            <ul v-if="canView && !token && access.view !== 'free'" class="mtdt-layers" >
            
            <li v-for="(layer, index) in layers" style="opacity:0.8;" :key="index" @click="authorize">
             <i class="fa" :class="{'fa-square-o': !layer.checked,'fa-check-square-o': layer.checked}"  :data-layer="index"></i>
             <div  :title="layer.description">{{layer.name}}</div>
           </li>
           </ul>  
            <ul v-else class="mtdt-layers" >
            <li v-for="(layer, index) in layers" :class="{disabled: !canView && access.view !== 'free'}" :key="index" @click="changeLayer(layer, true);">
             <i class="fa" :class="{'fa-square-o': !layer.checked,'fa-check-square-o': layer.checked}"  :data-layer="index"></i>
             <div  :title="layer.description">{{layer.name}}</div>
           </li>
           </ul>   
       </div> 
         <hr v-if="type === 'metadata'" />
   </div>
   <!-- LINKS -->
   <div v-if="links">
   		<div class="mtdt-related-type fa fa-link" :style="{backgroundColor: primary}">
          <span v-if="type === 'cartouche'" class="fa fa-caret-down" ></span>
       </div>
       <div v-if="type === 'metadata'"></div>
       <div class="mtdt-expand mtdt-links">
            <ul >
            <li v-for="(link, index) in links" :key="index" v-if="link">
             <a :href="link.href" target="_blank" :title="link.description">{{link.title}}</a>
           </li>
           </ul>    
       </div> 
         <hr v-if="type === 'metadata'" /> 
   </div>

   
    <!--  siblings -->
     <div v-if="platforms && platforms.length > 0">
       <div class="mtdt-related-type fa fa-map-marker"  :style="{backgroundColor: platformAdded ? '#8c0209' : primary}" :title="$tc('platform', platforms.length)">
         <span v-if="type === 'cartouche'" class="fa fa-caret-down"></span>
      </div> 
      <div v-if="type === 'metadata'"></div>
      <div class="mtdt-expand" >
           <formater-platform-list :siblings="platforms" @platformAdded="changePlatform"></formater-platform-list>
      </div> 
        <hr v-if="type === 'metadata'" /> 
    </div>
    <!--  DOWNLOAD 1 LINK -->
    <div v-if="download && download.length === 1 && type === 'cartouche'">
      <!--  case SHOM, OI2 open in new window -->
      <span v-if="access.download === 'free'"
        :href="download[0].url" target="_blank"  :title="$t('download_data')" >
        <span class="mtdt-related-type fa fa-download" :style="{backgroundColor: primary}" @click="record(download[0].url, 'download', $event)"></span>
        <a style="display:none;"  :href="download[0].url" target="_blank" ></a>
      </span>
       <!--  case CNES EOST (token=true)-->
       <span v-else-if="token && token !== -1 && canDownload" 
       :class="{disabled:download[0].disabled}"   :title="$t('download_data')" >
        <span class="mtdt-related-type fa fa-download" :style="{backgroundColor: primary}" @click="record(download[0].url, 'download', $event)"></span>
          <a style="display:none;" :href="download[0].url + '?_bearer=' + token" >
          </a>
      </span>
      <!-- case CNES and user not authenticate on flatsim -->
      <span v-else-if="!token && canDownload" @click="authorize">
        <span class="mtdt-related-type fa fa-download" :style="{backgroundColor: primary, opacity:0.8}" ></span>
      </span>
      <!--  other case @todo -->
      <span v-else  :class="{disabled:download[0].disabled || !token || !canDownload}" 
        :title="$t('download_data')">
         <span class="mtdt-related-type fa fa-download" :style="{backgroundColor: primary}" ></span>
      </span> 
    </div>
    <!--  command line -->
     <div v-if="download && download.length === 1 && type === 'cartouche' &&token && token !==-1 && canDownload"
       :title="$t('command_line')" @click="commandLine(download[0], token)">
        <span class="mtdt-related-type fa fa-terminal">
        </span>
     </div>
    <!-- DOWNLOAD FEW LINKS -->
    <div v-if="download && (download.length >1 || (type === 'metadata' && download.length > 0))">
       <div v-if="access.download === 'free'" class="mtdt-related-type fa fa-download"  :style="{backgroundColor: primary}" 
       :title="$t('download_data')" >
         <span v-if="type === 'cartouche'" class="fa fa-caret-down"></span>
      </div>
      <div v-else-if="!token && canDownload" class="mtdt-related-type fa fa-download"  :style="{backgroundColor: primary, opacity:0.8}" 
       :title="$t('download_data')" @click="authorize">
         <span v-if="type === 'cartouche'" class="fa fa-caret-down"></span>
      </div>
      <div v-else class="mtdt-related-type fa fa-download" :class="{disabled: !canDownload}"
        :style="{backgroundColor: primary}" :title="$t('download_data')" >
         <span v-if="type === 'cartouche'" class="fa fa-caret-down"></span>
      </div>
      <div v-if="type === 'metadata'"></div>
      <div class="mtdt-expand mtdt-links" >
           <ul >
           <li v-for="(file, index) in download" :key="index"  >
              <!--  case SHOM -->
              <span  v-if="access.download === 'free'">
                <span :title="file.description"  @click="record(file.url, 'download', $event)">
                    {{file.name? file.name: $t('download_data')}}
                </span>
                <a  :href="file.url"  target="_blank" style="display:none;"></a>
              </span>
              <!--  case FLATSIM -->
              <span  v-else-if="token && token !== -1 && canDownload"  >
                 <span :title="file.description"  @click="record(file.url, 'download', $event)">
                   {{file.name? file.name: $t('download_data')}}
                 </span>
                 <a :href="file.url + '?_bearer=' + token" style="display:none;"></a>
             </span>
             <!--  case FLATSIM without service authentication but can download -->
             <span v-else-if="!token && canDownload" style="opacity:0.8;" @click="authorize">
                {{file.name? file.name: $t('download_data')}}
             </span>
             <span v-else-if="!canDownload" class="disabled">
                {{file.name? file.name: $t('download_data')}}
             </span>
             <!--  other case @todo -->
            <span  v-else :title="file.description"  >{{file.name? file.name: $t('download_data')}}</span>
          </li> 
          </ul>    
      </div> 
        <hr v-if="type === 'metadata'" /> 
    </div>
    <!-- order -->
    <div v-if="order && order.length === 1 && type === 'cartouche'">
       <span :title="$t('order_data')" >
        <span class="mtdt-related-type fa fa-pencil-square-o" :style="{backgroundColor: primary}" @click="record(order[0].url, 'order', $event)"></span>
        <a  target="_blank" :href="order[0].url" style="display:none;" ></a> 
       </span> 
    </div>
    <div v-if="order && (order.length >1 || type === 'metadata')">
       <div class="mtdt-related-type fa fa-pencil-square-o"  :style="{backgroundColor: primary}" :title="$t('order_data')">
         <span v-if="type === 'cartouche'" class="fa fa-caret-down"></span>
      </div> 
      <div v-if="type === 'metadata'"></div>
      <div class="mtdt-expand mtdt-links" >
      <h4 v-if="type === 'metadata'"  :style="{color:$store.state.style.primary}">{{$t('order_data')}}</h4>
           <ul >
           <li v-for="(file, index) in order" :key="index" >
              <span  :title="file.description" >
                <span @click="record(file.url, 'order', $event)" >{{file.name? file.name: $t('order_data')}}</span>
                <a  :href="file.url"  target="_blank" style="display:none;"></a>
              </span>
          </li>
          </ul>    
      </div> 
      
        <hr v-if="type === 'metadata'" /> 
    </div>

  <!--  <div v-if="related && (related.children || related.parent)" style="position:relative;">
   <div class="mtdt-related-type fa fa-code-fork" :style="{backgroundColor:primary}">
      <span class="fa fa-caret-down"></span>
         </div>
         <div class="mtdt-expand">
             <label v-if="related.parent">{{$t('parent')}}</label>
             <ul v-if="related.parent">
              <li v-for="(item,index) in related.children">
                {{item.title[($i18n.locale === 'fr'? 'fre' : 'eng')]}}
             </li>
             </ul>    
             <label v-if="related.children">{{$t('children')}}</label>
             <ul v-if="related.children">
              <li v-for="(item,index) in related.children">
               {{item.title[($i18n.locale === 'fr'? 'fre' : 'eng')]}}
             </li>
             </ul>        
         </div>
     </div> -->
  </span>
  </template>
  <script>
  import ProgressBar from 'vuejs-progress-bar'
  import FormaterPlatformList from './formater-platform-list.vue'
  export default {
    name: 'FormaterRelated',
    components: {
      ProgressBar,
      FormaterPlatformList
    },
    props: {
      id: {
        type: String,
        default: null
      },
      depth: {
        type: Number,
        default: 0
      },
      access: {
        type: Object,
        default: () => {return {view: 'free', download: 'free'}}
      },
      type: {
        type: String,
        default: 'cartouche'
      },
      download: {
        type: Array,
        default: null
      },
      order: {
        type: Array,
        default: null
      },
      hasBboxLayer: {
        type: Boolean,
        default: false
      },
      layers: {
        type: Array,
        default: null
      },
      links: {
        type: Array,
        default: null
      },
      cds: {
        type: String,
        default: null
      },
      related: {
        type: Array|Object,
        default: null
      },
      title: {
        type: String,
        default: null
      }
    },
    created () {
      this.lang = this.$i18n.locale === 'fr' ? 'fre' : 'eng'
//       if (this.related && this.related.siblings) {
//     	  this.siblings = this.related.siblings
//       }
      this.checkEmpty()
    },
    destroyed () {
       this.downloadLink.forEach(function (link) {
         document.body.remove(link)
         link = null
       })
       this.downloadLink = []
    },
    computed: {
      primary() {
        return this.$store.state.style.primary
      },
      emphasis() {
        return this.$store.state.style.emphasis
      },
      isSelected () {
        if (this.$store.state.selectedMetadata === this.id && this.type === 'metadata') {
          return true
        } else {
          return false
        }
      },
      layerAdded () {
        var layerAdded = false
        var _this = this
        this.layers.forEach(function (layer) {
          layerAdded = layerAdded || layer.checked
        })
        return layerAdded
      },
      platforms () {
		    var platforms = []
    	  if (this.related && this.related.siblings) {

    		  this.related.siblings.forEach(function (platform) {
    			  if (platform.initiativeType === 'platform') {
    				  platforms.push(platform)
    			  }
    		  })
    	  }
		  return platforms
      },
      clientId () {
        return this.$store.getters['services/clientId']
      },
      token () {
        return this.$store.getters['services/token']
      },
//       isFormater () {
//         return this.$store.getters['user/isFormater']
//       },
      rights () {
       // return this.$store.getters['user/getAccess'](this.clientId, this.access)
        return this.$store.getters['user/getAccess'](this.access)
      },
      canView () {
        return this.rights.view
      },
      canDownload () {
        return this.rights.download
      }
    },
    watch: {
      isSelected (newvalue) {
        if (newvalue) {
          this.layers.forEach(function (layer) {
            if (_this.$store.getters['layers/isAdded'](layer.id)) {
              _this.changeLayer(layer, false)
            }
          })
        }
      }
    },
    data () {
      return {
        lang: 'eng',
        empty: true,
        platformAdded: false,
        message: '',
        progress: null,
        abort: false,
        downloadLink: [],
        progressBarOptions: {
          text: {
            color: '#000000',
            shadowEnable: true,
            shadowColor: '#000000',
            fontSize: 14,
            fontFamily: 'Helvetica',
            dynamicPosition: true,
            hideText: false,
            backgroundColor: 'rgba(0,0,0,0.5)'
          },
          progress: {
            color: '#2dbd2d',
            backgroundColor: '#C0C0C0'
          },
          layout: {
            height: 70,
            width: 70,
            verticalTextAlign: 16,
            horizontalTextAlign: 0,
            zeroOffset: 10,
            strokeWidth: 10,
            progressPadding: 0,
            type: 'circle'
          }
        }
      }
    },
    mounted () {
      var _this = this
      if (!this.layers) {
        return
      }
      if (this.depth !== -1) {
	      this.layers.forEach(function (layer) {
	        if (_this.$store.getters['layers/isAdded'](layer.id)) {
	          _this.changeLayer(layer, false)
	        }
	      })
      }
    },
    methods: {
      abortRequest () {
        this.abort = true
      },
      authorize () {
        if (!(this.canView || this.canDownload) || this.token) {
       
          return
        }
        var event = new CustomEvent('fmt:needAuthorize')
        document.dispatchEvent(event)
        
      },
      checkEmpty () {
        if (this.download && this.download.length > 0) {
          this.empty = false
        } else if (this.layers && this.layers.length > 0){
          this.empty = false
        } else if (this.links &&  this.links.length >0) {
          this.empty = false
        } else if (this.platforms && this.platforms.length > 0) {
          this.empty = false
        } else if (this.order && this.order.length > 0) {
          this.empty = false
        }
      },
      changeLayer (layer, zoom) {
        // console.log(index)
         // this.$set(this.meta.layers[index], 'checked', !this.meta.layers[index].checked)
         this.$set(layer, 'checked', !layer.checked)
           //   this.meta.layers[index].checked = !this.meta.layers[index].checked

         if (layer.checked) {
           var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: layer, id: this.id, token: this.token, zoom: zoom}})
           document.dispatchEvent(event)
           // this.layerAdded = true
         } else {
           var event = new CustomEvent('fmt:removeLayerEvent', {detail: {id: layer.id}})
           document.dispatchEvent(event)
           
//            this.layers.forEach(function (layer) {
//              self.layerAdded = self.layerAdded || layer.checked
//            })
         }
         // this.updateClass()
       },
       changePlatform (newvalue) {
    	   this.platformAdded = newvalue
       },
       commandLine (download, token) {
         var event = new CustomEvent('fmt:commandEvent', {detail: {
           title: this.title,
           cds: this.cds,
           uuid: this.id,
           link: download,
           token: token
         }})
         document.dispatchEvent(event)
         
       },
       record (url, type, e) {
         if (!this.$store.state.recordUrl) {
           if (e) {
             e.target.nextElementSibling.click()
           }
           return
         }
         var data = {
             email: this.$store.getters['user/email'],
             cds: this.cds,
             app: this.$store.state.app,
             domain: window.location.hostname,
             fullpath: this.$route.fullPath,
             path: this.$route.path,
             uuid: this.id,
             link: url,
             type: type,
             orgtype: this.$store.getters['user/type']
         }
        
         this.$http.post(this.$store.state.recordUrl, data, {emulateJSON: true})
         .then(
             resp => { e.target.nextElementSibling.click()},
             resp => { e.target.nextElementSibling.click()}
         )
        
       },
       triggerDownload (index) {
         this.record(this.download[0].url, 'download')
         if (this.download[index].disabled) {
           return
         }
         var _this = this
   
         
         var filename = 'download'
         var localIndex = index
         if (this.downloadLink[index]) {
           this.downloadLink[index].click()
           return
         }
         this.$set(this.download[index], 'disabled', true) 
         
         this.downloadLink[index] = document.createElement('a')
         document.body.appendChild(this.downloadLink[index])
         var downloadProgress = function (e) {
           if (e.total) {
             _this.progress = Math.round(100 * e.loaded / e.total)
            if (_this.abort) {
               e.srcElement.abort()
            }
           }
         }
         var _this = this
         var url = this.download[index].url 
         if (this.token && this.token !== -1) {
           url += '?_bearer=' + this.token
         }
         // var url = 'http://api.formater/geotiff/abana/iw2/geo_filt_20180518-20180623_sd_4rlks.tif'
         var objUrl = new URL(url)
         this.$http.get(url, {responseType: 'blob', downloadProgress: downloadProgress} )
         //this.$http.get('http://api.formater/interface-services/' , {responseType: 'blob', downloadProgress: downloadProgress})
             .then( response => {
               var headerDisposition = response.headers.get('Content-Disposition')
               if (headerDisposition) {
                 var match = headerDisposition.match(/filename[^;\n=]*=(\\?\"|'){0,1}([^\\?\"']*)(\\?\"|'){0,1}/i)
                 if (match) {
                   var filename = match[2]
                 }
                     } else {
                 // get filename from url
                   var objUrl = new URL(response.url)
                   var filename = objUrl.pathname.substring(objUrl.pathname.lastIndexOf('/') + 1)
               }
               const url = window.URL.createObjectURL(response.bodyBlob);
//                const link = document.createElement('a')
//                // link.setAttribute('download', )
//                link.href = url
               this.downloadLink[index].href = url
               this.downloadLink[index].setAttribute('download', filename)
               // document.body.appendChild(link)
               this.downloadLink[index].click()
               this.progress = null
               this.$set(this.download[index], 'disabled', false) 
             }, response => {
                 this.progress = null
                 switch(response.status) {
                 case 0:
                   //case abort, can retry
                   this.$set(this.download[index], 'disabled', false) 
                   if (this.abort) {
                     this.abort = false   
                   } else {
                     // use direct link
                      this.downloadLink[index].removeAttribute('download')
                      this.downloadLink[index].href = url
                      this.downloadLink[index].click()
                   }
                   break;
                 case 403:
                   console.log('forbidden')
                   this.message = this.$i18n.t('download_forbidden')
                   
                   break
                 case 404:
                   this.message = 'NOT FOUND'
                   default:
                     console.log(response);
                 }
            })
           // xhr.promise.abort()
            
       },
       handleOver (e) {
         e.target.style.color = this.$store.state.style.over
       },
       handleOut (e) {
         e.target.style.color = this.$store.state.style.link
       },
//        triggerDownload (index) {
//          var url = this.download[index].url
//          // var url = 'SENTINEL1.zip'
//          headers = { "Upgrade-Insecure-Requests": 1}
//          this.$http.get(url, {credentials: true}).then(
//            response => {console.log(response);}
//          )
//        },
       fixBbox (e) {
         e.target.fixed = true
         e.target.style.backgroundColor = '#8c0209'
         this.selectBbox(e, true)
         setTimeout(() => {
           e.target.style.backgroundColor = this.primary;
           e.target.fixed = false
           }, 2000);
       },
       selectBbox (e, temporaly) {
         var event = new CustomEvent('fmt:selectBboxEvent', {detail: {id: this.id, temporaly: temporaly ? true: false}})
         document.dispatchEvent(event)
       },
       unselectBbox (e) {
         if (e.target.fixed) {
           e.target.fixed = !e.target.fixed
           return
         }
         var event = new CustomEvent('fmt:unselectBboxEvent', {detail: {id: this.id}})
         document.dispatchEvent(event)
       }
    }
    
  }
  </script>
  <style>
  
  .mtdt-link {
    text-decoration: underline;
    cursor: pointer;
  }
  .mtdt-related .fmt-progress-bar-container{
    display: block;
    position: absolute;
    top: -100px;
    z-index: 2;
    padding:10px;
}
.mtdt-related .progress-bar svg {
   background: rgba(255,255, 255, 0.5);
}
 .mtdt-related .progress-bar > div { 
   position: absolute !important; 
   top:16px;
   left:0;
   line-height: 70px !important;
   width: 100%;
  text-align:center;
  } 
 .mtdt-related-metadata{
   margin: 0px;
   padding:0px;
   height:auto;
   text-align: center;
}
.mtdt-related-metadata > div{
  display: block;
  margin-bottom: 10px;
}
.mtdt-related-metadata hr {
  margin: 0 25px;
   border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
}

.mtdt-related-cartouche{
 float: right;
 margin-right:3px;
 margin-top:3px;
 max-height: 25px;
 max-width: 50%;
}
.mtdt-related-cartouche > div {
  display:inline-block;
}
.mtdt-related-cartouche > div.formater-message,
.mtdt-related-metadata > div.formater-message {
    display: block;
	position: absolute;
	top: -40px;
	right: 0px;
	padding: 10px;
	color: darkred;
	border: 1px solid darkred;
	border-radius: 5px;
	background-color: white;
	box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
	z-index: 1;
}
.mtdt-related-metadata > div.formater-message {
   position: relative;
   top: 0;
   right:0;
}
 .mtdt-related .mtdt-related-type{
 text-align:center;
 min-width:20px;
 vertical-align:bottom;

 border-radius:3px;
 /*background:#8c0209;*/
 background:#754a15;
 padding:3px 5px;
 color:white;
 margin-right:3px;
 box-sizing: content-box;
}
.mtdt-related-cartouche .mtdt-related-type{
   cursor:pointer;
   opacity:0.9
}
.mtdt-related-cartouche .mtdt-related-type.disabled,
.mtdt-related-cartouche a.disabled ,
.mtdt-related-cartouche span.disabled,
.mtdt-expand span.disabled {
  pointer-events:none;
  opacity:0.5;
}
 .mtdt-related-cartouche .mtdt-related-type:hover{
  opacity:1;
}
.mtdt-related-metadata .mtdt-expand{
  margin: 20px 10px 30px 10px;
  text-align:left;
}
.mtdt-related-metadata .mtdt-links.mtdt-expand{
  display:block;
}
.mtdt-links a,
.mtdt-links span {
  padding: 1px 3px;
  cursor:pointer;
  display: inline-block;
  width: 100%;
}
.wrapper-content .mtdt-app .mtdt-links a:hover,
.mtdt-links a:hover,
.wrapper-content .mtdt-app .mtdt-links span:hover,
.mtdt-links span:hover {
  background: darkred;
  color:white;
}
.mtdt-layers li:hover {
  color: darkred;
}
.mtdt-related-cartouche .mtdt-related-type + .mtdt-expand{
    display:none;
    position:absolute;
    bottom: 21px;
    right:0;
    z-index:100;
    height:auto;
    min-width:200px;
    max-width:320px;
    background:white;
    padding:5px;
    border-radius:3px;
    border:1px dotted grey;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.5);
    width:auto;
    text-align:left;
}
.mtdt-related-cartouche .mtdt-expand:hover {
  display: block;
}
.mtdt-related-cartouche  .mtdt-related-type:hover + .mtdt-expand{
  display:block;
}
 .mtdt-related-type span{
 font-size:0.8em;
 margin-left:3px;
}
 .mtdt-related .mtdt-expand label{
  font-weight: 500;
}
 
  .mtdt-related .mtdt-expand ul {
  padding:0;
  list-style: none;
  margin:  5px 3px 5px 9px;

}
.mtdt-related-metadata .mtdt-expand ul {
  display:inline;
}
  .mtdt-related-cartouche .mtdt-expand ul li {
     word-break: break-word;
  }
 .mtdt-related-metadata .mtdt-expand ul li {
 word-break: break-word;
  padding: 2px;
  margin:  0;
  cursor:pointer;
 
}
 .mtdt-related-metadata .mtdt-expand ul li.disabled {
   pointer-events: none;
   opacity:0.5
   }
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li:before{
content: "\2192";
padding: 0 5px;
display: table-cell;
font-size: 1.1em;
}

.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li a,
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li span,
.mtdt-related-metadata .mtdt-expand ul:not(.mtdt-layers)  li div{

display: table-cell;
max-width:92%;
}
 .mtdt-related ul.mtdt-layers{
  list-style-type: none;
  margin-left:0px;
  text-align:left;
}
 ul.mtdt-layers li{
  cursor: pointer;
  text-align:left;
}
 .mtdt-related ul.mtdt-layers li {
  vertical-align:text-top;
  min-width:51%;
  max-width:100%;
  
}
.mtdt-related ul.mtdt-layers li div{
   display: inline-block;
   max-width:85%;
   vertical-align:top;
   word-break: break-word;
   text-align:justify;
}
 .mtdt-related-cartouche ul.mtdt-layers li i.fa {
   margin-right: 3px;
 }
 .mtdt-related-cartouche ul.mtdt-layers li div{

    text-overflow: clip;
    margin:0;
    padding:0;
    width: calc(100% - 35px);
    overflow: hidden;
    word-break: break-word;
    vertical-align: top;
    line-height:0.9;
    max-height:32px;
    padding:2px 0;
}
 .mtdt-related-cartouche .mtdt-expand h4 {
   margin: 5px 0px;
 }
  </style>