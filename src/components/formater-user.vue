<i18n>
{
  "en": {
    "access_rights": "Your access rights",
    "access_request": "Access request",
    "access_to_formater": "To be able to access some data, you must select it and make a request by clicking on <b>&laquo;Access request&raquo;</b>.",
    "add_message": "Add message to your request",
    "download": "Download",
    "email": "Email",
    "formater_data": "ForM@Ter data",
    "preview": "Preview",
    "public_data": "Public data",
    "register": "Register",
    "select_data": "Select",
    "wait_validation": "Your request has been registered with our services. An email has been sent to you. It will be treated as quickly as possible"
  },
  "fr": {
    "access_rights": "Vos droits d'accès",
    "access_request": "Demande d'accès",
    "access_to_formater": "Pour pouvoir accéder à certaines données, vous devez les sélectionner and faire une demande en cliquant sur <b>&laquo;Demande d'accès&raquo;</b>.",
    "add_message": "Ajoutez un message à votre demande",
    "download": "Téléchargement",
    "email": "Email",
    "formater_data": "Données ForM@Ter",
    "preview": "Visualisation",
    "public_data": "Données publiques",
    "register": "S'inscrire",
    "select_data": "Sélectionnez",
    "wait_validation": "Votre demande a bien été enregistrée auprès de nos services. Un email vous a été envoyé. Elle sera traitée le plus rapidement possible."
  }
}
</i18n>
<template>
 <span class="mtdt-user">
 <div class="mtdt-user-box" v-if="show" >
 <div  style="text-align:right;margin-right:-20px;" @click="close">
    <span @click="close" style="cursor: pointer;">
       <i class="fa fa-close" style="cursor: pointer;"></i>
    </span>
 </div>
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
   
   <table style="border:none;" cellspacing="0" cellpadding="5">
   <thead>
     <th colspan="2"></th>
     <th style="padding:0 4px;">{{$t('preview')}}</th>
     <th style="padding:0 4px;">{{$t('download')}}</th>
     <th v-if="canAsk">{{$t('select_data')}}</th>
   </thead>
   <tbody>
     <tr>
	     <td>
	     {{$t('public_data')}}
	     </td>
	     <td></td>
	     <td class="fmt-center">
	       <i class="fa fa-check"></i>
	     </td>
       <td class="fmt-center">
         <i class="fa fa-check"></i>
       </td>
	     <td v-if="canAsk"></td>
      </tr>
      <tr v-for="role in roles">
        <td>
         {{title(role)}}
        
        </td>
        <td class="fmt-center">
          <div v-if="role.description" style="position:relative;">
            <span class="fmt-button fa fa-info" @click="showTooltip($event)"></span>
            <div class="fmt-tooltip" @click="hideTooltip()" v-html="description(role)"></div>
          </div>
           
        </td>
        <td class="fmt-center">
          <i class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
        </td>
        <td class="fmt-center">
          <i class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
        </td>
        <td  v-if="canAsk" class="fmt-center">
           <input v-if="!role.access && !role.status" type="checkbox" v-model="checkedRoles" :value="role.name" /> 
        </td>
      </tr>
   </tbody>
   </table>
   <div v-if="canAsk">
   <p  v-html="$t('access_to_formater')" style="font-size:0.9em;font-style:italic;line-height:1;"></p>
   <textarea style="width:100%" v-model="message" :placeholder="$t('add_message')"></textarea>
   <span  class="fmt-button" :class="{disabled: checkedRoles.length === 0}" :style="{background: $store.state.style.primary}" @click="accessRequest">{{$t('access_request')}}</span>
   </div>
   <p v-if="displayWait" v-html="$t('wait_validation')" style="font-size:0.9em;color:green;line-height:1;"></p>
  
    </div>
 </div>
 <a  @click="show=true" :style="{'--color': $store.state.style.primary}" :title="$t('access_rights')">
 <i class="fa fa-user" style="margin-right:3px;"></i>
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
    },
    lang () {
      return this.$store.state.lang
    },
    roles () {
      var roles = this.$store.getters['roles/getAll']
      var _this = this
      roles.forEach(function (role) {
        role.access = _this.hasRole(role.name)
      })
      return roles
    },
    canAsk () {
      var can = false
      this.roles.forEach(function (role) {
        if (!role.access && !role.status) {
          can = true
          return can
        }
      })
      return can
    }
    
  },
  data() {
    return {
      show: false,
      displayWait: false,
      checkedRoles: [],
      message: null
    }
  },
  created () {
   // if (!this.isFormater) {
      this.checkAccessRequest()
   // }
  },
  destroyed () {
  },
  methods: {
    accessRequest () {
      if (this.checkedRoles.length === 0) {
        return
      }
      var postdata = {
          userId: this.user.id,
          email: this.user.email,
          app: null,
          realm: this.$store.getters['user/realm'],
          message: this.message,
          role: this.checkedRoles,
          lang: this.$store.state.lang
      }
      var url = this.$store.state.checkSSO + '/ask'
      this.$http.post(url, postdata, {emulateJSON: true})
      .then(resp => {
        if (resp.body.success) {
          var _this = this
          this.checkedRoles.forEach(function (role) {
              _this.$store.commit('roles/setStatus', {name: role, status: 'WAITING'})
          })
          this.checkedRoles = []
        }
        this.displayWait = true
      })
    },
    checkAccessRequest () {
//       if (!this.hasCheckSSO || this.isFormater) {
//         return
//       }
      var postdata = {
          userId: this.user.id,
          email: this.user.email,
          app: 'catalog',
          realm: this.$store.getters['user/realm']
      }
      var url = this.$store.state.checkSSO + '/check'
      this.$http.post(url, postdata, {emulateJSON: true})
      .then(resp => {
        if (resp.body.success) {
          this.$store.commit('roles/set', resp.body.roles)
        }
        if (this.canAsk) {
          this.show = true
        }
      })
    },
    close () {
      console.log('close')
      this.show = false
    },
    hasRole (name) {
      return this.$store.getters['user/hasRole'](name)
    },
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
      document.querySelectorAll('.tooltip-show').forEach(function (node) {
        node.classList.remove('tooltip-show')
      })
      event.target.classList.add('tooltip-show')
    },
    description (role) {
      if (role.description && role.description[this.lang]) {
        return role.description[this.lang]
      } else if (role.description) {
        return role.description[Object.keys(role.description)[0]]
      }
      return 'no description'
    },
    title (role) {
      if (role.title) {
        if (role.title[this.lang] && this.lang !== 'en') {
          return role.title[this.lang]
        } else if (role.title.en) {
          return role.title.en
        }
      }
      return role.name
    }
  }
}
</script>
<style >
.fmt-center {
  text-align:center;
}
span.fmt-fa-button {
  cursor: pointer;
  opacity: 0.9;
  text-shadow: 0 1px 5px rgba(0,0,0,.65);
}
span.fmt-button {
  background: darkred;
  color: white;
  padding: 5px 8px;
  border-radius:5px;
  cursor: pointer;
  opacity: 0.9;
  box-shadow: 0 1px 5px rgba(0,0,0,.65);
}
span.fmt-button:hover,
span.fmt-fa-button:hover {
  opacity:1;
}
span.fmt-button.disabled {
  opacity:0.5;
  pointer-events: none;
}
span.fmt-button.fa-info {
  background:#222;border-radius:10px;font-size:smaller;
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
  padding: 0 2px;
}
div.mtdt-user-box table td:nth-child(5) {
  border-left: 1px solid grey;
}
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

}
.tooltip-show + div.fmt-tooltip {
  display:block;
}
</style>
