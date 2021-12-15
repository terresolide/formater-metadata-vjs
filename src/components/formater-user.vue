<i18n>
{
  "en": {
    "access_rights": "Your access rights",
    "access_request": "Access request",
    "access_to_formater": "To be able to access some data, you must select it and make a request by clicking on <b>&laquo;Access request&raquo;</b>.",
    "account": "Your account",
    "add_message": "Add message to your request",
    "download": "Download",
    "email": "Email",
    "firstname": "First Name",
    "formater_data": "ForM@Ter data",
    "lastname": "Last Name",
    "organization": "Organization",
    "organization_type": "Organization type",
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
    "account": "Votre compte",
    "add_message": "Ajoutez un message à votre demande",
    "download": "Téléchargement",
    "email": "Email",
    "firstname": "Prénom",
    "formater_data": "Données ForM@Ter",
    "lastname": "Nom",
    "organization": "Organisme",
    "organization_type": "Type d'organisme",
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
 <div class="mtdt-user-box" v-if="show" @mousedown="movestart">
 <div  style="float:right;margin-right:-20px;" @click="close">
    <span @click="close" style="cursor: pointer;">
       <i class="fa fa-close" style="cursor: pointer;"></i>
    </span>
 </div>
 <div class="mtdt-msg-title" :style="{color: $store.state.style.primary}"> 
	 <i class="fa fa-user" style="font-size:1em;vertical-align:baseline;"></i>
	 {{$t('account')}}
 </div>
 <div class="mtdt-user-info">
   <div>
     <label>Id</label> {{user.username}}
   </div>
   <div>
      <label>{{$t('firstname')}}</label> {{user.givenName }}
   </div>
   <div>
     <label>{{$t('lastname')}}</label> {{user.familyName}}
   </div>
   <div v-if="user.organization">
	    <div>
	     <label>{{$t('organization')}}</label>  {{user.organization}}
	   </div>
	    <div>
	     <label>{{$t('organization_type')}}</label>  {{getTypeName(user.organizationType)}}
	   </div>
   </div>
   <div v-else>
     <div >
           <label>{{$t('organization')}}</label>
             <input style="line-height:normal;min-width:350px;" v-model="organization" list="organizations" required 
             @mousedown="$event.stopPropagation()" @input="updateType()" > *
             <em v-if="showOrganizationMessage" style="color:darkred;">{{$t('at_least_3')}}</em>
             <datalist id="organizations">
                <option v-for="org in organizations" :data-value="org.o_uid" >{{org.o_name}}<span v-if="org.o_short"> ({{org.o_short}})</span></option>
             </datalist>
         </div>
         <div  >
           <label>Type</label>
           <select v-model="organizationType" :disabled="organizationId" required >
             <option value="">---</option>
             <option v-for="type in organizationTypes" :value="type.t_id">{{type.t_name}}</option>
           </select> *
         </div>
         <div><label></label><em style="margin-left:10px;">* {{$t('required')}}</em></div>
   </div>
  </div>
   <h3 :style="{color:$store.state.style.primary}">{{$t('access_rights')}}</h3>
  
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
 <i class="fa fa-user" style="margin-right:3px;"></i> {{$t('account')}} |
  
</a>
{{user.email}}

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
      message: null,
      organizationTypes: null,
      showOrganizationMessage: false,
      organization: '',
      organizations: [],
      organizationId: null,
      organizationType: null,
      selected: false,
      box:null,
      mousemoveListener: null,
      mouseupListener: null,
      selected: false,
      delta: {x: 0, y:0},
      pos: {x:0, y:0},
    }
  },
  created () {
   // if (!this.isFormater) {
      this.checkAccessRequest()
      
      this.getOrganizationTypes()
      if (!this.user.organization) {
        this.getOrganizations()
      }
      this.mousemoveListener = this.move.bind(this)
      document.addEventListener('mousemove', this.mousemoveListener)
      this.mouseupListener = this.moveEnd.bind(this)
      document.addEventListener('mouseup', this.mouseupListener)
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
      var url = this.$store.state.checkSSO + '/requests/ask'
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
    getTypeName (typeId)
    {
      var find = this.organizationTypes.find(t => t.t_id===typeId)
      if (find) {
        return find.t_name  
      }
      return null
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
      var url = this.$store.state.checkSSO + '/requests/check'
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
    getOrganizations () {
      var url = this.$store.state.checkSSO + '/api/organizations?nb=500&begin=' + this.organization
      this.$http.get(url)
      .then(resp => {
        if (resp.body.organizations) {
          this.organizations = resp.body.organizations
        }
      })
    },
    getOrganizationTypes () {
      var url = this.$store.state.checkSSO + '/api/types?lang=' + this.$store.state.lang
      this.$http.get(url)
      .then(resp => {
        if (resp.body.types) {
          this.organizationTypes = resp.body.types
        }
      })
    },
    updateType () 
    {
      if (this.organization.length === 1) {
        this.organizations = []
      }
      if (this.organization.length === 2) {
        this.getOrganizations()
      }
      if (this.organization.length < 5) {
        return
      }
     // this.info.message = null
      this.organizationId = null
      this.organizationType = null
        // valid organism
      this.showOrganismMessage = false
      var regex = new RegExp(/^[A-z0-9À-ž\s\-'@()]{5,300}$/)
      if (regex.test(this.organization)) {
        var organism = this.organization.trim().toLowerCase()
        var find = this.organizations.find(org => organism.indexOf(org.o_name.toLowerCase()) >= 0 )
        if (find) {
          this.organizationId = find.o_uid
          console.log(this.organizationId)
          this.organizationType = find.o_fk_type_id
        } else {
          this.organizationId = null
        }
      } else {
        this.showOrganismMessage = true
      }
      
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
    },
    movestart (evt) {
      this.box = this.$el.querySelector('.mtdt-user-box')

      this.selected = true
      this.delta = {
          x: this.pos.x - this.box.offsetLeft,
          y: this.pos.y - this.box.offsetTop
      }
    },
    move (evt) {
      this.pos.x = evt.clientX
      this.pos.y = evt.clientY
      if (this.selected) {
        this.box.style.left = (this.pos.x - this.delta.x) + 'px'
        this.box.style.top = (this.pos.y - this.delta.y) + 'px'
      }
    },
    moveEnd () {
      this.selected = false
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
top: calc(50% - 150px);
left:calc(50% - 310px);
z-index:10;
text-align: left;
cursor: move;
box-shadow: 2px 3px 3px 3px rgba(0, 0, 0, 0.5);
}
div.mtdt-msg-title {
  font-size: 1.5rem;
  font-weight:800;
  margin-bottom:10px;
}
div.mtdt-user-box label {
  min-width: 150px;
  text-align:right;
  margin-right:10px;
  display:inline-block;
  font-weight:800;
}
div.mtdt-user-info > div {
  line-height:1.1rem;
}
div.mtdt-user-info {
  margin-bottom:20px;
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
  z-index:1;
}
.tooltip-show + div.fmt-tooltip {
  display:block;
}
</style>
