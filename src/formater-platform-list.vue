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
 <h4>{{$tc('platform', platforms.length)}}</h4>
           <ul class="mtdt-layers">

           <li v-for="(platform, index) in platforms" :key="index"  @click="selectPlatform(index)">
              <div  :title="platform.description[lang] || platform.description" >{{platform.title[lang] || platform.title}}</div>
          
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
    console.log(this.siblings)
    this.completePlatforms()
    console.log(this.platforms)
  },
  data () {
    return {
      lang: 'eng',
      time: 0,
      platforms: []
    }
  },
  methods: {
	selectPlatform (index) {
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
	 platformAdded () {
        var platformAdded = false
        this.siblings.forEach(function (platform) {
          platformAdded = platformAdded || platform.checked
        })
        return platformAdded
      },
    changePlatform(platform) {
      this.$set(platform, 'checked', !platform.checked)
      //   this.meta.layers[index].checked = !this.meta.layers[index].checked
      console.log(platform)
      if (platform.checked) {
        console.log('add layer')
        if (platform.layers && platform.layers[0]) {
          var event = new CustomEvent('fmt:addLayerEvent', {detail: {layer: platform.layers[0], id: platform.id}})
          document.dispatchEvent(event)
        }
      } else {
        console.log('remove layer')
        if (platform.layers && platform.layers[0]) {
          var event = new CustomEvent('fmt:removeLayerEvent', {detail: {id: platform.layers[0].id}})
          document.dispatchEvent(event)
        }
      }
    },
    fillPlatforms (resp) {
    	console.log('time = ' + this.time)
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
            // platform = Object.assign({}, _this.$gn.treatmentMetadata(platformSelected, platform.id))
//             var links = _this.$gn.treatmentLinks(platformSelected.id, platformSelected.link)
//             delete platformSelected.link
//             platformSelected = Object.assign(platformSelected, links)
            _this.platforms[index] = _this.$gn.treatmentMetadata(platformSelected, platform.id)
          })
    }
   
  }
}
</script>
<style>

</style>