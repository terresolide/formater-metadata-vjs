<i18n>{
   "en":{
     "localize": "Localize on the map",
     "display_layer": "Display the layer on the map",
     "download_data": "Download data",
     "download_forbidden": "Forbidden download",
     "platform": "Platform | Platforms"
   },
   "fr":{
     "localize": "Localiser sur la carte, cliquer pour garder la position",
     "display_layer": "Afficher sur la carte",
     "download_data": "Télécharger les données",
     "download_forbidden": "Téléchargement interdit",
     "platform": "Plateforme | Plateformes"
   }
}
</i18n>
<template>
  <span class="mtdt-related" :class="'mtdt-related-' + type" v-if="!empty || type === 'cartouche'">
       <div class="formater-message" v-if="message" @click="message = ''">{{message}}</div>
       <progress-bar :value="progress" v-if="progress!==null && progress < 100" :options="progressBarOptions"></progress-bar>
    <div v-if="type === 'cartouche' && hasBboxLayer" style="display:inline-block;" >
      <div class="mtdt-related-type fa fa-dot-circle-o" :style="{backgroundColor:primary}" 
     :title="$t('localize')"   @click="fixBbox">
      </div>
    
    </div>
    <div v-if="layers && layers.length === 1 && type === 'cartouche'">
      <div class="mtdt-related-type fa fa-globe" @click="changeLayer(layers[0])" :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
          
       </div> 
   </div>
   <div v-if="type === 'metadata'"></div>
    <div v-if="layers && (layers.length > 1 || (type === 'metadata' && layers.length > 0))">
      <div class="mtdt-related-type fa fa-globe" :style="{backgroundColor: layerAdded ? '#8c0209' : primary}" :title="$t('display_layer')">
          <span class="fa fa-caret-down" v-if="type === 'cartouche'"></span>
       </div>
       <div class="mtdt-expand">
            <ul class="mtdt-layers">
            <li v-for="(layer, index) in layers" :key="index" @click="changeLayer(layer);">
             <i class="fa" :class="{'fa-square-o': !layer.checked,'fa-check-square-o': layer.checked}"  :data-layer="index"></i>
             <div  :title="layer.description">{{layer.name}}</div>
           </li>
           </ul>   
       </div> 
         <hr v-if="type === 'metadata'" />
   </div>
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

   <div v-if="download && download.length === 1 && type === 'cartouche'">
       <div class="mtdt-related-type fa fa-download" :class="{disabled:download[0].disabled}" :style="{backgroundColor: primary}" :title="$t('download_data')" @click="triggerDownload(0)">
         
      </div> 
    </div>
    <div v-if="download && (download.length >1 || (type === 'metadata' && download.length > 0))">
       <div class="mtdt-related-type fa fa-download"  :style="{backgroundColor: primary}" :title="$t('download_data')">
         <span v-if="type === 'cartouche'" class="fa fa-caret-down"></span>
      </div> 
      <div v-if="type === 'metadata'"></div>
      <div class="mtdt-expand mtdt-links" >
           <ul >
           <li v-for="(file, index) in download" :key="index" @click="triggerDownload(index);" :class="{disabled: file.disabled}">
              <a  :title="file.description" >{{file.name? file.name: $t('download_data')}}</a>
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
      type: {
        type: String,
        default: 'cartouche'
      },
      download: {
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
      related: {
        type: Array|Object,
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
    computed: {
      primary() {
        return this.$store.state.style.primary
      },
      emphasis() {
        return this.$store.state.style.emphasis
      },
      layerAdded () {
        var layerAdded = false
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
      }
    },
    data () {
      return {
        lang: 'eng',
        empty: true,
        platformAdded: false,
        message: '',
        progress: null,
        progressBarOptions: {
          text: {
            color: '#000000',
            shadowEnable: true,
            shadowColor: '#000000',
            fontSize: 14,
            fontFamily: 'Helvetica',
            dynamicPosition: false,
            hideText: false
          },
          progress: {
            color: '#2dbd2d',
            backgroundColor: '#C0C0C0'
          },
          layout: {
            height: 70,
            width: 70,
            verticalTextAlign: 35,
            horizontalTextAlign: 28,
            zeroOffset: 10,
            strokeWidth: 10,
            progressPadding: 0,
            type: 'circle'
          }
        }
      }
    },

    methods: {
      checkEmpty () {
        if (this.download && this.download.length > 0) {
          this.empty = false
        } else if (this.layers && this.layers.length > 0){
          this.empty = false
        } else if (this.links &&  this.links.length >0) {
          this.empty = false
        } else if (this.platforms && this.platforms.length > 0) {
          this.empty = false
        }
      },
      changeLayer (layer) {
        // console.log(index)
         // this.$set(this.meta.layers[index], 'checked', !this.meta.layers[index].checked)
         this.$set(layer, 'checked', !layer.checked)
           //   this.meta.layers[index].checked = !this.meta.layers[index].checked

         if (layer.checked) {
           var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: layer, id: this.id}})
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
       triggerDownload (index) {
         console.log('trigger download')
         if (this.download[index].disabled) {
           return
         }
         var _this = this
         this.progress = 0
   
         
         var filename = 'download'
         var downloadProgress = function (e) {
           if (e.total) {
             _this.progress = Math.round(100 * e.loaded / e.total)
           }
         }
         
         var _this = this

         this.$http.get(this.download[index].url )
            // this.$http.get('http://api.formater/interface-services/' , {responseType: 'blob', downloadProgress: downloadProgress})
             .then( response => {
               console.log(response)
               var headerDisposition = response.headers.get('Content-Disposition')
               if (headerDisposition) {
                 console.log(headerDisposition)
                 var match = headerDisposition.match(/filename[^;\n=]*=(\\?\"|'){0,1}([^\\?\"']*)(\\?\"|'){0,1}/i)
                 if (match) {
                   var filename = match[2]
                 }
                //  res = re.search("filename[^;\n=]*=(['\"])*(.*)(?(1)\1|)", string) res.group(2)
               }
               const url = window.URL.createObjectURL(response.bodyBlob);
               const link = document.createElement('a')
               // link.setAttribute('download', )
               link.href = url
               link.setAttribute('download', filename)
               document.body.appendChild(link)
               link.click()
               _this.progress = null
             }).catch(function (response) {
                 _this.progress = null
                 switch(response.status) {
                 case 403:
                   console.log('forbidden')
                   this.message = this.$i18n.t('download_forbidden')
                   this.download[index].disabled = true
                   break
                   default:
                     console.log(response);
                 }
            })
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
  .mtdt-related .progress-bar{
    display: block;
    position: absolute;
    top: -100px;
    right: 2px;
    background: rgba(255,255, 255, 0.9);
    z-index: 2;
    padding:10px;
}
 .mtdt-related .progress-bar > div {
   position: absolute !important;
 }
 .mtdt-related-metadata{
   margin: 10px;
   padding:10px;
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
 font-size:1.3em;
 margin-right:3px;
}
.mtdt-related-cartouche .mtdt-related-type{
   cursor:pointer;
   opacity:0.9
}
.mtdt-related-cartouche .mtdt-related-type.disabled{
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

.mtdt-related-cartouche .mtdt-related-type + .mtdt-expand{
    display:none;
    position:absolute;
    bottom: 21px;
    right:0;
    z-index:100;
    height:auto;
    min-width:200px;
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
   word-break: break-all;
}
 .mtdt-related-cartouche ul.mtdt-layers li div{

    text-overflow: clip;
    margin:0;
    padding:0;
    width: calc(100% - 32px);
    overflow: hidden;
    word-break: break-all;
    vertical-align: top;
    max-height:26px;
}
 .mtdt-related-cartouche .mtdt-expand h4 {
   margin: 5px 0px;
 }
  </style>