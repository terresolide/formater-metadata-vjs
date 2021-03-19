<template>
<span class="element-metadata" v-if="metadata && Object.keys(metadata).length > 0">

 + &lt;{{name}}<span  v-for="(meta, key) in attr" style="color:red;" > {{key}}="{{meta}}"</span> &gt;
  <div class="meta-child" > {{text}}</div>
  <div class="meta-child" v-for="(meta, key) in metadata"  v-if="meta && typeof meta === 'object' && typeof key === 'string'">
  <element-metadata  :metadata="meta" :name="key"></element-metadata>
  </div>
  <div class="meta-child" v-for="(meta, key) in metadata"  v-if="meta && typeof meta === 'object' && typeof key === 'number'">
    <element-metadata  :metadata="Object.values(meta)[0]" :name="Object.keys(meta)[0]" ></element-metadata>
  </div>
 </span>
</span>
</span>
</template>
<script>

export default{
  name: 'ElementMetadata',
  props:{
    name: {
      type: String,
      default: 'gmd:Metadata'
    },
    metadata: {
      type: Object|Array,
      default: null
    }
  },
  watch: {
    metadata (newvalue) {
      this.initMeta(newvalue)
    }
  },
  data () {
    return {
       attr: {},
       text: null,
       childs: [],
       list: []
    }
  },
  created () {
    if (!this.metadata) {
      return
    }
    if (Object.keys(this.metadata))
    this.initMeta(this.metadata)
//     var _this = this
//     for(var key in this.metadata) {
//       if (typeof key === 'string') {
// 	      if (key === '#text') {
// 	        this.text = this.metadata[key]
// 	      }else if  (key.substring(0, 1) === '@') {
// 	        if (key.substring(0,6) !== '@xmlns') {
// 	        this.attr[key.substring(1)] = this.metadata[key]
// 	        }
// 	      } else {
// 	        this.childs[key] = this.metadata[key]
// 	      }
//       } else {
//         this.list.push(this.metadata[key])
//       }
//     }
//     if (this.list.length > 0) {
//        console.log(this.list)
//     }
  },
  methods: {
    initMeta (newmeta) {
      var _this = this
      for(var key in newmeta) {
        if (typeof key === 'string') {
          if (key === '#text') {
            this.text = newmeta[key]
          }else if  (key.substring(0, 1) === '@') {
            if (key.substring(0,6) !== '@xmlns') {
                this.attr[key.substring(1)] = newmeta[key]
            }
          } else {
            this.childs[key] = newmeta[key]
          }
        } else {
          this.list.push(mewmeta[key])
        }
      }
    }
  }
}
</script>
<style>
.meta-child {
  margin-left:10px;
}
</style>