<i18n>{
   "en":{
     "platform": "Platform | Platforms"
   },
   "fr":{
     "platform": "Plateforme | Plateformes"
   }
}
</i18n>
<template>
<span >
 <h4 :style="{color:$store.state.style.primary}">{{$tc('platform', platforms.length)}}</h4>
           <ul class="mtdt-links">

           <li v-for="(platform, index) in platforms" :key="index"  >
              <a class="mtdt-link"  :title="platform.abstract" @click="selectPlatform(index)">{{platform.title[lang] || platform.title}}</a>
           <!--   <i class="fa" :class="{'fa-square-o': !platform.checked,'fa-check-square-o': platform.checked}"  :data-platform="index" @click="changePlatform(platform)"></i>
            -->
              <i v-if="platform.layers && platform.layers.length > 0" class="fa" :class="{'fa-square-o': !platform.checked,'fa-check-square-o': platform.checked}"  :data-platform="index" @click="changePlatform(platform)"></i>
              </li>
          </ul>   
</span> 
</template>
<script>

export default {
  name: 'FormaterPlatformList',
  components: {
  },
  props: {
    siblings: {
      type: Array,
      default: []
    }
  },

  mounted () {
    this.lang = this.$i18n.locale == 'fr' ? 'fre' : 'eng'
    this.completePlatforms()
  },
  data () {
    return {
      lang: 'eng',
      platforms: []
    }
  },
  methods: {
	selectPlatform (index) {
	  var event = new CustomEvent('fmt:metadataEvent', {detail: {meta: this.platforms[index], depth: -1 } })
    document.dispatchEvent(event)
		this.$store.commit('selectMetadata', this.platforms[index])
	},
	completePlatforms ()  {
		this.platforms = this.siblings
		 var headers =  {
		          'Accept': 'application/json, text/plain, */*',
		          'Accept-Language': this.$i18n.locale === 'fr' ? 'fre': 'eng'
		          }
		          var url = this.$store.state.geonetwork +  'srv/eng'
		          url += '/q?_content_type=json&buildSummary=false&fast=index'
		          var count = 0
		          url += '&uuid='
		          this.platforms.forEach(function (plateform) {
		            if (!plateform.completed) {
		               count++
		               url +=  plateform.id + '+or+'
		            }
		          })
		          if (count > 0) {
		            url = url.substr(0, url.length - 4)
		            this.$http.get(url, {headers: headers})
		            .then( response => { this.fillPlatforms(response.body) })
		          }
	},
    changePlatform(platform) {
      this.$set(platform, 'checked', !platform.checked)
      //   this.meta.layers[index].checked = !this.meta.layers[index].checked
      if (platform.checked) {
        if (platform.layers && platform.layers[0]) {
          var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: platform.layers[0], id: platform.id}})
          document.dispatchEvent(event)
        }
      } else {
        if (platform.layers && platform.layers[0]) {
          var event = new CustomEvent('fmt:removeLayerEvent', {detail: {id: platform.layers[0].id}})
          document.dispatchEvent(event)
        }
      }
      var platformAdded = false
      this.platforms.forEach(function (platform) {
        platformAdded = platformAdded || platform.checked
      })
      this.$emit('platformAdded', platformAdded)
    },
    fillPlatforms (resp) {
    	this.time = this.time +1
    	if (resp.metadata && typeof resp.metadata.length === 'undefined') {
            resp.metadata = [resp.metadata]
          }
          var _this = this
          var platforms = []
          this.platforms.forEach(function (platform, index) {
            var platformSelected = resp.metadata.find(function (meta) {
              return platform.id === meta['geonet:info'].uuid
            })
            var initiativeType = platform.initiativeType
            // platform = Object.assign({}, _this.$gn.treatmentMetadata(platformSelected, platform.id))
//             var links = _this.$gn.treatmentLinks(platformSelected.id, platformSelected.link)
//             delete platformSelected.link
//             platformSelected = Object.assign(platformSelected, links)
              platformSelected = _this.$gn.treatmentMetadata(platformSelected, platform.id)
              platformSelected.checked = false
              /*if (platformSelected.title) {
            	  platformSelected.title = _this.$i18n.tc(initiativeType, 1) + ': '  + platformSelected.title
              } else {
            	  platformSelected.defaultTitle = _this.$i18n.tc(initiativeType, 1) + ': '  + platformSelected.defautlTitle
              }*/
            platformSelected.initiativeType = initiativeType
           // _this.platforms[index] = _this.$gn.treatmentMetadata(platformSelected, platform.id)
            _this.$set(_this.platforms, index, platformSelected)
          })
          
    }
   
  }
}
</script>
<style>

</style>