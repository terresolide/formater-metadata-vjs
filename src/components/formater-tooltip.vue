<template>
<div v-if="description" style="position:relative;">
      <span class="fa fa-info-circle" @click="showTooltip($event)"></span>
      <div class="fmt-tooltip" @click="hideTooltip()" v-html="description"></div>
</div> 
</template>
<script>
export default {
  name: 'FormaterTooltip',
  props: {
    description: {
      type: String,
      default: null
    }
  },
  methods: {
    hideTooltip() {
      document.querySelectorAll('.tooltip-show').forEach(function (node) {
        node.classList.remove('tooltip-show')
      })
    },
    showTooltip (event) {
      event.preventDefault()
      if (event.target.classList.contains('tooltip-show')) {
        event.target.classList.remove('tooltip-show')
        return
      }
      this.hideTooltip()
      event.target.classList.add('tooltip-show')
    }
  }
}
</script>
<style scoped>
.fa-info-circle {
  text-shadow: 2px 2px 4px dark;
  opacity: 0.8;
  cursor: pointer;
}
.fa-info-circle:hover {
  opacity: 1;
}
</style>
<style>
div.fmt-tooltip {
  position: absolute;
  display:none;
  background-color: #fafafa;
  border: 1px solid #a3a3a3;
  font-size: smaller;
  line-height:1;
  text-align:left;
  padding: 5px;
  cursor: pointer;
  width: 150px;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.4);
  z-index:1;
}
.tooltip-show + div.fmt-tooltip {
  display:block;
}
</style>