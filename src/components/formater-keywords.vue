
<template>
  <span class="mtdt-keywords" >
  <span>
    <span :class="{disable: (!cat || !name || selected===item)}" class="mtdt-keyword" v-for="(item, key) in words" @click="input(item)">{{item.split('|')[0]}}</span>

  </span>
  </span>
</template>
<script>
export default{
  props: {
    keywords: {
      type: Array,
      default: () => []
    },
    name: {
      type: String,
      default: null
    }
  },
  watch: {
    $route (newroute) {
      var query = newroute.query
      if (query.cat) {
        this.selected = query.cat
      } else {
        this.selected = null
      }
    }
  },
  data () {
    { 
      return {
        selected: null
      }
    }
  },
  computed: {
    words () {
      var list = []
      this.keywords.forEach(function (item) {
        var tab = item.split('|')
        list.push(tab[tab.length - 1])
      })
      return list
    }
  },
  methods: {
    input (value) {
      if (value === this.selected) {
        return
      }
      var query = this.$route.query
      if (query.cat === value) {
        delete query.cat
      } else {
        query.cat = value
      }
    
      var route = {name: this.$route.name, params: this.$route.params, query: query }
      console.log(route)
      this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
      .catch(error => {console.log(error)})
      // this.$router.push({name: this.$route.name, params: this.$route.params, query: query})
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
  opacity:0.8;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.4);
   cursor: pointer;
  pointer-events: auto;
}

.mtdt-keyword:hover {
  opacity:1;
  
}
.mtdt-keyword.disable {
  pointer-events: none;
}
</style>