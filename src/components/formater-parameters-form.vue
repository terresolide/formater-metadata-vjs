<i18n>
{
  "fr": {
     "test": "test"
  }
}
</i18n>
<template>
<div class="fmt-parameters-form">
<div v-for="(item, index) in parameters" class="fmt-input-block fmt-input-group" >
	<label :style="{color: textColor}">{{item.name}}</label>
	<formater-select v-if="item.options && item.options.length > 0" :depth="depth" :name="item.name" width="260px" :options="item.options" @input="selectChange" :defaut="null" :set-value="item.value"></formater-select>
	<div class="fmt-input disable" v-if="item.options && item.options.length === 1" :style="{backgroundColor: inputColor}">
	 <span>{{item.options[0]}}</span>
	</div>
	<div class="fmt-input" v-if="!item.options" :style="{backgroundColor: inputColor}">
		<input type="text" :name="item.name"  v-model="inputs[item.name]"  :defaultValue="item.value" :pattern="item.pattern" :title="item.title" :placeholder="item.title"  @change="changeText" @keypress="changeTextOnEnter"></input>
	</div>
</div>
</div>
</template>

<script>
import FormaterSelect from 'formater-commons-components-vjs/src/formater-select.vue'

export default {
  name: 'FormaterParametersForm',
  components: {
    FormaterSelect
  },
  props: {
    lang: {
      type: String,
      default: 'en'
    },
    parameters: {
      type: Array,
      default: []
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      inputColor: null,
      textColor: null,
      aerisSearchListener: null,
      aerisResetListener: null,
      inputs: {}
    }
  },
  computed: {
//     inputs () {
//       console.log('passe dans inputs')
//       var _this = this
//       var inputs = {}
//       this.parameters.forEach(function (parameter) {
//         if(!parameter.options) {
//           inputs[parameter.name] = parameter.value ? parameter.value : null
//         }
//       })
//       return inputs
//     }
  },
  created () {
    var _this = this
    this.parameters.forEach(function (parameter) {
      if(!parameter.options) {
        _this.inputs[parameter.name] = parameter.value ? parameter.value : null
      }
    })
    this.textColor = this.$store.state.style.primary
    this.handleTheme(this.$store.state.style.emphasis)
  	this.aerisSearchListener = this.handleSearch.bind(this)
    document.addEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisResetListener = this.handleReset.bind(this)
    document.addEventListener('aerisResetEvent', this.aerisResetListener)
  	
  },
  destroyed () {
    document.removeEventListener('aerisSearchEvent', this.aerisSearchListener)
    this.aerisSearchListener = null
    document.removeEventListener('aerisResetEvent', this.aerisResetListener)
    this.aerisResetListener = null
  },
  methods: {
    handleTheme (color) {
      this.inputColor = this.$shadeColor(color, 0.8)
      if ((this.$el) && (this.$el.querySelector)) {
        var nodes = this.$el.querySelectorAll('.flt-input')
        var _this = this
        nodes.forEach( function (node) {
          node.style.backgroundColor = _this.$shadeColor( color, 0.8)
        })
    	}
    },
    changeTextOnEnter (event) {
      if (event.which == 13 || event.keyCode == 13) {
        this.changeText()
        return false;
      }
    },
    changeText(event) {
       // trigger event change text
       var e = new CustomEvent('fmt:textChangeEvent')
       document.dispatchEvent(e)
    },
    selectChange (value) {
      var evt = new CustomEvent('fmt:selectChangeEvent')
      document.dispatchEvent(evt)
    },
    handleSearch (event) {
      if (this.depth !== event.detail.depth) {
        return
      }
      for(var name in this.inputs) { 
        if (this.inputs[name] !== null) {
          event.detail[name] = this.inputs[name]
        }
      }
//       this.parameters.forEach(function (parameter) {
//         if (!parameter.options && parameter.value) {
//           event.detail[parameter.name] = parameter.value
//         }
//       })
    },
     handleReset (event) {
      for(var name in this.inputs) { 
        this.inputs[name] = null
      }
      this.$forceUpdate()
     }
  }
}
</script>
<style>

.fmt-parameters-form .fmt-input-block{
	margin: 5px 10px;
	display:block;
}
.fmt-parameters-form .fmt-input-block.fmt-input-group{
  	margin: 5px 10px;
}
.fmt-parameters-form input {
    border: none;
    background-color: transparent;
    padding: 0 10px;
    outline: none;
   /* padding: .5em; */
    line-height: 35px;
}
.fmt-parameters-form label{
	display: block;
	font-size: 1.1em;
	text-transform:capitalize;
    letter-spacing: -0.5px;
}
</style>