<i18n>
{
  "fr": {
    "authorize": "Autoriser"
  },
  "en": {
    "authorize": "Authorize"
  }
}
</i18n>
<template>
 <span class="mtdt-user">
 <div class="mtdt-user-box" v-if="show" >
 <div  style="text-align:right;" ><i class="fa fa-close" style="cursor: pointer;" @click="close"></i></div>
 <div class="mtdt-msg-title fa fa-user" :style="{color: $store.state.style.primary}"> Your account</div>
 
  <div style="margin-left:30px;">
    <div><label>Username:</label> {{user.username}}</div>
    <div><label>GivenName:</label> {{user.givenName}}</div>
    <div><label>Lastname:</label> {{user.familyName}}</div>
    <div><label>Email:</label> {{user.email}}</div>
    <div>Rights and access</div>
    
  </div>
   <div class="mtdt-service-button"  >
   <span>OK</span>
</div>
 </div>
 <a class="fa fa-user" @click="show=true" :style="{'--color': $store.state.style.primary}" title="Your account">
  {{user.email}}
</a>

</span>
</template>
<script>

export default {
  name: 'FormaterUser',
  components: {
  },
  props: {
  },
  computed: {
    user () {
      return this.$store.getters['user/get']
    },
    isFormater () {
      return this.$store.getters['user/isFormater']
    }
  },
  data() {
    return {
      show: false
    }
  },
  created () {
  },
  destroyed () {
  },
  methods: {
    accessRequest () {
      var postdata = {
          email: this.email,
          app: null,
          role: this.$store.getters['user/formaterRole']
      }
    },
    checkAccessRequest () {
      
    },
    close () {
      this.show = false
    }
  }
}
</script>
<style >

.mtdt-user-box {
background: #fefefe;
min-width: 300px;
max-width: 450px;
padding: 0 10px 20px 20px;
border-radius: 5px;
position: fixed; 
top:30%; 
left:30%;
z-index:10;
text-align: left;
box-shadow: 2px 3px 3px 3px rgba(0, 0, 0, 0.5);
}
div.mtdt-msg-title {
  font-size: 1.5rem;
  font-weight:800;
  margin-bottom:10px;
}

</style>
