<i18n>
{
  "en": {
    "access_rights": "Your access rights",
    "access_to_formater": "Access to ForM@Ter data is reserved for the <b>French scientific community</b>. To be able to access it, you must make a request by clicking on <b> register </b> above",
    "download": "Download",
    "email": "Email",
    "formater_data": "ForM@Ter data",
    "preview": "Preview",
    "public_data": "Public data",
    "wait_validation": "Your request has been registered with our services. An email has been sent to you. It will be treated as quickly as possible"
  },
  "fr": {
    "access_rights": "Vos droits d'accès",
    "access_to_formater": "L'accès aux données dites ForM@Ter est réservé à la <b>communauté scientifique française</b>. Pour pouvoir y accéder, vous devez faire une demande en cliquant sur <b>s'inscrire</b> ci-dessus.",
    "download": "Téléchargement",
    "email": "Email",
    "formater_data": "Données ForM@Ter",
    "preview": "Visualisation",
    "public_data": "Données publiques",
    "wait_validation": "Votre demande a bien été enregistrée auprès de nos services. Un email vous a été envoyé. Elle sera traité le plus rapidement possible."
  }
}
</i18n>
<template>
 <span class="mtdt-user">
 <div class="mtdt-user-box" v-if="show" >
 <div  style="text-align:right;margin-right:-20px;" ><i class="fa fa-close" style="cursor: pointer;" @click="close"></i></div>
 <div class="mtdt-msg-title" :style="{color: $store.state.style.primary}"> 
	 <i class="fa fa-user" style="font-size:1em;vertical-align:baseline;"></i>
	 {{$t('access_rights')}}
 </div>
 
  <div style="margin-left:30px;">
   <!--   <div v-for="key in ['username', 'givenName', 'lastname', 'email']">
    <label :style="{color: $store.state.style.primary}">{{$t(key)}}:</label> {{user[key]}}
    </div>
   <h4 :style="{color: $store.state.style.primary, fontWeight: 800}">
   
   </h4>-->
   
   <table style="border:none;" cellspacing="0" cellpadding="0">
   <thead>
     <th></th>
     <th>{{$t('preview')}}</th>
     <th>{{$t('download')}}</th>
     <th></th>
   </thead>
   <tbody>
     <tr>
	     <td>
	     {{$t('public_data')}}
	     </td>
	     <td class="fmt-center">
	       <i class="fa fa-check-square-o"></i>
	     </td>
       <td class="fmt-center">
         <i class="fa fa-check-square-o"></i>
       </td>
	     <td></td>
      </tr>
      <tr>
        <td>
         {{$t('formater_data')}}
        </td>
        <td class="fmt-center">
          <i class="fa" :class="{'fa-square-o': !isFormater, 'fa-check-square-o': isFormater} "></i>
        </td>
        <td class="fmt-center">
          <i class="fa" :class="{'fa-square-o': !isFormater, 'fa-check-square-o': isFormater} "></i>
        </td>
        <td><span v-if="!isFormater && !alreadyAsk && hasCheckSSO" @click="accessRequest">S'inscrire</span></td>
      </tr>
   </tbody>
   </table>
    <p v-if="displayWait" v-html="$t('wait_validation')" style="font-size:0.9em;color:green;line-height:1;"></p>
  
   <p v-if="!isFormater && !alreadyAsk" v-html="$t('access_to_formater')" style="font-size:0.9em;font-style:italic;line-height:1;"></p>
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
    },
    hasCheckSSO () {
      return this.$store.state.checkSSO ? true: false
    }
  },
  data() {
    return {
      show: false,
      alreadyAsk: false,
      displayWait: false
    }
  },
  created () {
    if (!this.isFormater) {
      this.checkAccessRequest()
    }
  },
  destroyed () {
  },
  methods: {
    accessRequest () {
      if (!this.hasCheckSSO) {
        return
      }
      var postdata = {
          email: this.user.email,
          app: null,
          realm: this.$store.getters['user/realm'],
          role: this.$store.getters['user/formaterRole']
      }
      var url = this.$store.state.checkSSO + '/ask.php'
      this.$http.post(url, postdata, {emulateJSON: true})
      .then(resp => {
        if (resp.body.success) {
          this.alreadyAsk = true
        }
        this.displayWait = true
        console.log(this.alreadyAsk)
      })
    },
    checkAccessRequest () {
      if (!this.hasCheckSSO) {
        return
      }
      var postdata = {
          email: this.user.email,
          app: null,
          realm: this.$store.getters['user/realm'],
          role: this.$store.getters['user/formaterRole']
      }
      var url = this.$store.state.checkSSO + '/check.php'
      this.$http.post(url, postdata, {emulateJSON: true})
      .then(resp => {
        if (resp.body.success) {
          this.alreadyAsk = resp.body.exists
        }
      })
    },
    close () {
      this.show = false
    }
  }
}
</script>
<style >
.fmt-center {
  text-align:center;
}
.mtdt-user-box {
background: #fefefe;
min-width: 300px;
max-width: 650px;
padding: 0 30px 20px 20px;
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
div.mtdt-user-box label {
  min-width: 120px;
  text-align:right;
  margin-right:10px;
  display:inline-block;
  font-weight:800;
}
div.mtdt-user-box table th, 
div.mtdt-user-box table td {
  border: none;
}
</style>
