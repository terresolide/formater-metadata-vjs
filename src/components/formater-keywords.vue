
<template>
  <span class="mtdt-keywords" >
  <span>
    <span class="mtdt-keyword" v-for="(item, key) in keywords">{{item}}</span>
  </span>
  </span>
</template>
<script>
export default{
  props: {
    keywords: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style>
.mtdt-keywords > span{
  margin-left:-6px;
}
.mtdt-keyword{
  display: inline;
  float:left;
  margin: 3px 10px 3px 0;
  padding:3px 6px;
  border-radius:4px;
  font-size: 1rem;
  background: #ddd;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.4);
}
</style>