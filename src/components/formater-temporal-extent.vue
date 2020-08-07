<i18n>
{
  "en": {
    "now": "Now"
  },
  "fr": {
    "now": "Aujourd'hui"
  }
}
</i18n>
<template>
<div  class="mtdt-cartouche-elt">
  <div  v-for="(begin, index) in startDate" v-if="begin">
    <span>{{date2str(begin)}}</span>
    <i class="fa fa-long-arrow-right" :style="{color:$store.state.style.primary}" ></i>
    <span >{{date2str(endDate[index])}}</span>
  </div>
</div>
</template>
<script>
export default{
  name: 'FormaterTemporalExtent',
  props: {
    start: {
      type: Object|String,
      default: null
    },
    end: {
      type: Object|String,
      default: null
    }
  },
  data () {
    return {
      startDate: null,
      endDate: null
    }
  },
  created () {
    if (this.start && typeof this.start === 'object') {
      this.startDate = this.start
    } else {
      this.startDate = [this.start]
    }
    if (this.end && typeof this.end === 'object') {
      this.endDate = this.end
    } else {
      this.endDate = [this.end]
    }
  },
  methods: {
    date2str (date) {
      var myDate = moment(date, 'YYYY-MM-DD')
      if (myDate.isValid()) {
        return myDate.format('ll')
      } else {
        return this.$i18n.t('now')
      }
    }
  }
}
</script>