<i18n>
{
  "en": {
    "keywords": "Keywords"
   },
   "fr": {
     "keywords": "Mots-clés"
   }
}
</i18n>
<template>
  <span class="mtdt-keywords" v-if="keywords.length > 0">
  <h2 :style="{color:$store.state.style.primary}"><i class="fa fa-key"></i>{{$t('keywords')}}</h2>
  <div>
    <div class="mtdt-keyword" v-for="(item, key) in keywords">{{item}}</div>
  </div>
  </span>
</template>
<script>
export default{
  props: {
    keywords: {
      type: Array,
      default: () => []
    }
  },
  created () {
    console.log(this.keywords)
  }
}
</script>
<style>
.mtdt-keywords > div{
  margin-left:30px;
}
.mtdt-keyword{
  display: inline-block;
  margin: 3px 5px;
  padding:3px 5px;
  border-radius:3px;
  font-size: 1rem;
  background: #ccc;
}
</style>
