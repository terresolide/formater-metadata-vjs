<template>
<span class="element-metadata" style="color:#154360;" v-if="metadata && Object.keys(metadata).length > 0">

 <span @click="expand=!expand" style="cursor:pointer;margin-left:-10px;" >{{ expand ? '-' : '+'}}</span>
  &lt;{{name}}<span  v-for="(meta, key) in attr" style="color:#333;" > {{key}}=<span style="color:darkgreen;">"{{meta}}"</span></span> &gt;
  <div class="element-content" v-if="expand && (text || Object.keys(metadata).length > 0)" :class="{expand: expand}">
	  <div class="meta-child" style="color:#333;"> {{text}}</div>
	  <div class="meta-child" v-for="(meta, key) in metadata"  v-if="meta && typeof meta === 'object'">
	    <element-metadata v-if="typeof key === 'string'" :metadata="meta" :name="key" :depth="depth +1"></element-metadata>
	     <element-metadata v-else :metadata="Object.values(meta)[0]" :name="Object.keys(meta)[0]" :depth="depth + 1"></element-metadata>
	  </div>
  </div>
  <span v-if="expand">&lt;/{{name}}&gt;</span>
 </span>
</span>
</span>
</template>
<script>
const ElementMetadata = () => import('./element-metadata.vue')

export default{
  name: 'ElementMetadata',
  components: {
    ElementMetadata
  },
  props:{
    name: {
      type: String,
      default: 'gmd:Metadata'
    },
    metadata: {
      type: Object|Array,
      default: null
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  computed: {
//     text () {
//       return this.metadata.hasOwnProperty['#text'] ? this.metadata['#text'] : null
//     }
  },
//   watch: {
//     metadata (newvalue) {
//       this.initMeta(newvalue)
//     }
//   },
  data () {
    return {
       attr: {},
       text: null,
       childs: {},
       list: [],
       expand: true
    }
  },
  created () {
    if (!this.metadata) {
      return
    }
    this.expand = this.depth > 0 ? false : true
//     if (Object.keys(this.metadata))
//     this.initMeta(this.metadata)
//     var _this = this
    for(var key in this.metadata) {
      if (typeof key === 'string') {
	      if (key === '#text') {
	        this.text = this.metadata[key]
	      }else if  (key.substring(0, 1) === '@') {
	        if (key.substring(0,6) !== '@xmlns' && key.substring(0, 4) !== '@xsi') {
	        this.attr[key.substring(1)] = this.metadata[key]
	        }
	      } else {
	        this.childs[key] = this.metadata[key]
	      }
      } else {
       // this.list.push(this.metadata[key])
      }
    }
    // console.log(this.text)
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
               this.$set(this.attr, key.substring(1), newmeta[key])
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
  margin-left:0px;
  padding-left:25px;
  border-left: 1px dotted grey;
}
.element-metadata .element-content {
  display:none;
}
.element-metadata .element-content.expand {
  display:block;
}
</style>