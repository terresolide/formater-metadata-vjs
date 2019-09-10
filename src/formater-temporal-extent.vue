<i18n>
{
  "en": {
    "now": "Now"
  },
  "fr": {
    "now": "Maintenant"
  }
}
</i18n>
<template>
<div v-if="start" class="mtdt-cartouche-elt">
  <span v-if="start">{{date2str(startDate)}}</span>
  <i class="fa fa-long-arrow-right" :style="{color:$store.state.style.primary}" ></i>
  <span >{{date2str(endDate)}}</span>
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
      this.startDate = this.start[0]
    } else {
      this.startDate = this.start
    }
    if (this.end && typeof this.end === 'object') {
      this.endDate = this.end[0]
    } else {
      this.endDate = this.end
    }
  },
  methods: {
    date2str (date) {
      var myDate = moment(date, 'YYYY-MM-DD')
      if (myDate.isValid()) {
        return myDate.format('ll')
      } else {
        console.log('invalide date')
        return this.$i18n.t('now')
      }
    }
  }
}
</script>