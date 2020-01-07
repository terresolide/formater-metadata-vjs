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
<span>
 <h4>{{$tc('platform', 2)}}</h4>
           <ul class="mtdt-layers">

           <li v-for="(platform, index) in platforms" :key="index" @click="changePlatform(platform)" >
              <div  :title="platform.description[lang] || platform.description" >{{platform.title[lang] || platform.title}}</div>
          
              <i class="fa" :class="{'fa-square-o': !platform.checked,'fa-check-square-o': platform.checked}"  :data-platform="index"></i>
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
  computed: {
    platforms () {
      return []
    }
  },
  mounted () {
    this.lang = this.$i18n.locale
    console.log(this.platforms)
  },
  data () {
    return {
      lang: 'en'
    }
  },
  methods: {
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
    }
   
  }
}
</script>
<style>

</style>