<i18n>
{
  "en": {
    "access_rights": "Your access rights",
    "access_request": "Access request",
    "access_to_formater": "To be able to access some data, you must select it and make a request by clicking on <b>&laquo;Access request&raquo;</b>.",
    "account": "Your account",
    "add_message": "Add message to your request",
    "at_least_3": "At least 3 characters",
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
    "required": "Required",
    "to_collection": "to this collection",
    "wait_validation": "Your request has been registered with our services. An email has been sent to you. It will be treated as quickly as possible"
  },
  "fr": {
    "access_rights": "Vos droits d'accès",
    "access_request": "Demande d'accès",
    "access_to_formater": "Pour pouvoir accéder à certaines données, vous devez les sélectionner et faire une demande en cliquant sur <b>&laquo;Demande d'accès&raquo;</b>.",
    "account": "Votre compte",
    "add_message": "Ajoutez un message à votre demande",
    "at_least_3": "Au moins 3 caractères",
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
    "required": "Obligatoire",
    "to_collection": "à cette collection",
    "wait_validation": "Votre demande a bien été enregistrée auprès de nos services. Un email vous a été envoyé. Elle sera traitée le plus rapidement possible."
  }
}
</i18n>
<template>
 <span class="mtdt-user">
 <div class="mtdt-user-box" v-show="show" @mousedown="movestart">
 <div  style="float:right;margin-right:-20px;" @click="close">
    <span @click="close" style="cursor: pointer;">
       <i class="fa fa-close" style="cursor: pointer;"></i>
    </span>
 </div>
 <div v-show="(show && !show.client) || !user.organization"  class="mtdt-msg-title" :style="{color: $store.state.style.primary, paddingTop: '10px'}"> 
	 <i class="fa fa-user" style="font-size:1em;vertical-align:baseline;"></i>
	 {{$t('account')}}
 </div>
 <div style="height:auto;overflow-y:auto;overflow-x:hidden;" :style="{maxHeight: height + 'px'}">
	 <div  v-show="(show && !show.client) || !user.organization" class="mtdt-user-info" >
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
	     <form class="form-organization v-form">
	     <div >
	           <label>{{$t('organization')}}</label>
	             <input style="line-height:normal;min-width:350px;" v-model="organization" list="organizations" required 
	             @mousedown="$event.stopPropagation()" @input="updateType($event)" > *
	             <em v-if="showOrganizationMessage" style="color:darkred;">{{$t('at_least_3')}}</em>
	             <datalist id="organizations">
	                <option v-for="org in organizations" :data-value="org.o_uid" >{{org.o_name}}<span v-if="org.o_short"> ({{org.o_short}})</span></option>
	             </datalist>
	         </div>
	         <div  >
	           <label>Type</label>
	           <select v-model="organizationType" :disabled="organizationId" required >
	             <option style="min-width:325px;" value="">---</option>
	             <option v-for="type in organizationTypes" :value="type.t_id">{{type.t_name}}</option>
	           </select> *
	         </div>
	         <div><label></label><em style="margin-left:10px;">* {{$t('required')}}</em></div>
	     </form>
	   </div>
	  </div>
	  <h3 style="font-weight: 700;" :style="{color:$store.state.style.primary, paddingTop: '10px'}">
	     <span class="fa fa-key"></span> {{$t('access_rights')}} <span v-if="show && show.client">{{$t('to_collection')}}</span>
	  </h3>
	  
	  <div style="margin-left:30px;padding-bottom:5px;">
	   <!--   <div v-for="key in ['username', 'givenName', 'lastname', 'email']">
	    <label :style="{color: $store.state.style.primary}">{{$t(key)}}:</label> {{user[key]}}
	    </div>
	   <h4 :style="{color: $store.state.style.primary, fontWeight: 800}">
	   
	   </h4>-->
	   <div class="role-line" style="font-weight:700;background:#e3e3e3;" >
	     <div></div>
	     <div></div>
	     <div >{{$t('preview')}}</div>
	     <div >{{$t('download')}}</div>
	     <div></div>
	     <div></div>
	   </div>
	   <div class="role-line full" v-show="!show || !show.client">
		   <div>
		   {{$t('public_data')}}
		   </div>
		   <div></div>
		   <div class="fmt-center">
		     <i class="fa fa-check" style="color:green;"></i>
		   </div>
	     <div class="fmt-center">
	       <i class="fa fa-check" style="color:green;"></i>
	     </div>
		   <div v-if="canAsk"></div>
		   <div></div>
	   </div>
	   <!-- GLOBAL ROLES -->
	   <div v-if="clients.global" v-show=" !show || !show.client" style="border-top: 1px dotted black;padding:0px;">
	      <formater-client :client="clients.global" name="global" :checked-roles="checkedRoles" @roleChange="selectRole"></formater-client>
	   </div>
	   <!--  CLIENT ROLES -->
	   <div v-for="(client,clientName) in clients"  v-if="clientName !== 'global'"
	   v-show="!show || !show.client || show.client === clientName" style="border-top: 1px dotted black;padding:0px;">
	     <formater-client :client="client" :name="clientName" :checked-roles="checkedRoles" @roleChange="selectRole"></formater-client>
	   </div>
	   <div v-if="canAsk">
	   <p  v-html="$t('access_to_formater')" style="font-size:0.9em;font-style:italic;line-height:1;"></p>
	   <div style="position:relative;">
	     <div v-if="asking" style="position:absolute;left:50%;top:10%;font-size:30px;">
	       <span class="fa fa-spinner animated"></span>
	     </div>
	     <textarea style="width:100%" v-model="message" :placeholder="$t('add_message')"></textarea>
	   </div>
	   <span  class="fmt-button" :class="{disabled: checkedRoles.length === 0 || asking}" :style="{background: $store.state.style.primary}" @click="accessRequest">{{$t('access_request')}}</span>
	   </div>
	   <p v-if="displayWait" v-html="$t('wait_validation')" style="font-size:0.9em;color:green;line-height:1;"></p>
	   <p v-if="errorAsk" style="color:darkred;">Erreur : {{errorAsk}}</p>
	    </div>
   </div>
 </div>
 <a  @click="changeShow" :style="{'--color': $store.state.style.primary}" :title="$t('access_rights')">
 <i class="fa fa-user" style="margin-right:3px;"></i> {{$t('account')}} |
  
</a>
{{user.email}}

</span>
</template>
<script>
const FormaterClient = () => import('@/components/formater-client.vue')
export default {
  name: 'FormaterUser',
  components: {
    FormaterClient
  },
  props: {
  },
  computed: {
    user () {
      return this.$store.getters['user/get']
    },
    hasCheckSSO () {
      return this.$store.state.checkSSO ? true: false
    },
    lang () {
      return this.$store.state.lang
    },
    clients () {
      return this.$store.getters['roles/getClients']
    },
    canAsk () {
      var can = false
      for (var client in this.clients) {
	      this.clients[client].roles.forEach(function (role) {
	        if (!role.access && !role.status) {
	          can = true
	        }
	      })
	      if (this.clients[client].groups) {
	        for (var key in this.clients[client].groups) {
	          var count = 0
	          this.clients[client].groups[key].forEach(function (role) {
	            if (!role.access && !role.status) {
	              can = true
	            }
	          })
	        }
	      }
      }
      return can
    },
    lightColor () {
      return this.$shadeColor(this.$store.state.style.emphasis, 0.8)
    }, 
    show () {
      return this.$store.getters['user/show']
    }
  },
  data() {
    return {
      displayWait: false,
      checkedRoles: [],
      message: null,
      organizationTypes: [],
      showOrganizationMessage: false,
      organization: '',
      organizations: [],
      organizationId: null,
      organizationType: null,
      selected: false,
      box:null,
      mousemoveListener: null,
      mouseupListener: null,
      resizeListener: null,
      selected: false,
      delta: {x: 0, y:0},
      pos: {x:0, y:0},
      errorAsk: null,
      asking: false,
      height: 750
    }
  },
  created () {
   // if (!this.isFormater) {
      this.checkAccessRequest()
      this.getOrganizationTypes()
      if (!this.user.organization) {
        var domain = this.user.username.substring(this.user.username.indexOf('@') + 1)
        this.getOrganizations(domain)
      }
      this.resizeListener = this.resize.bind(this)
      window.addEventListener('resize', this.resizeListener)
      this.mousemoveListener = this.move.bind(this)
      document.addEventListener('mousemove', this.mousemoveListener)
      this.mouseupListener = this.moveEnd.bind(this)
      document.addEventListener('mouseup', this.mouseupListener)
   // }
  },
  mounted () {
    if (this.$el && this.$el !== 'undefined') {
	    var position = this.$el.getBoundingClientRect()
	    this.$el.querySelector('.mtdt-user-box').style.top = (position.top + 30) + 'px'
    }
    this.resize()
  },
  destroyed () {
    window.addEventListener('resize', this.resizeListener)
    this.resizeListener = null
    document.removeEventListener('mousemove', this.mousemoveListener)
    this.mousemoveListener = null
    document.removeEventListener('mouseup', this.mouseupListener)
    this.mouseupListener = null
  },
  methods: {
    changeShow () {
      console.log('Dans formater-user')
      this.$store.commit('user/toggleShow', {client: null, access: null})
    },
    resize () {
      this.height = window.innerHeight - 90
    },
    accessRequest () {
      if (this.checkedRoles.length === 0) {
        return
      }
      if (!this.user.organization) {
        var node = this.$el.querySelector('form.form-organization')
        if (!node.checkValidity())
        {
          return
        }
      }
      this.asking = true
      var toRemove = []
      var _this = this
      // remove role "view" if there is role "view download"
      var location = this.$custURL(window.location.href)
      this.checkedRoles = this.checkedRoles.filter(role => _this.checkedRoles.indexOf(role + 'D') < 0)
      var postdata = {
          userId: this.user.id,
          email: this.user.email,
          app: this.$store.state.app,
          domain: location.base + '#/',
          realm: this.$store.getters['user/realm'],
          message: this.message,
          role: this.checkedRoles,
          lang: this.$store.state.lang
      }
      if (!this.user.organization) {
        if (this.organizationId) {
          postdata.organizationId = this.organizationId
        } else if (this.organization) {
          postdata.organization = this.organization
          postdata.organizationType = this.organizationType
        }
      }
      var url = this.$store.state.checkSSO + '/requests/ask'
      this.$http.post(url, postdata, {emulateJSON: true})
      .then(resp => {
        if (resp.body.success) {
          var _this = this
          this.checkedRoles.forEach(function (role) {
              var partrole = role.split('.')
              _this.$store.commit('roles/setStatus', {client: partrole[0], name: partrole[1], status: 'WAITING'})
          })
          if (this.organization) {
            this.$store.commit('user/setOrganization', {organization: this.organization, organizationType: this.organizationType})
          }
          this.checkedRoles = []
          this.displayWait = true
          this.errorAsk = null
        } else {
          this.errorAsk = resp.body.error || 'SERVER ERROR'
        }
        this.asking = false
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
          this.$store.commit('roles/set', {clients: resp.body.roles, roles: this.$store.getters['user/roles']})
          this.$store.commit('services/initialize', resp.body.clients)
        }
//         if (this.canAsk) {
//           this.$store.commit('user/toggleShow', {client: null, access: null})
//         }
      })
    },
    getOrganizations (domain) {
      var url = this.$store.state.checkSSO + '/api/organizations?nb=500&orderBy=' + encodeURIComponent('o_name ASC');
      if (this.organization) {
        url += '&q=' + this.organization
      }
      if (domain) {
        url += '&domain=' + domain
      }
      this.$http.get(url)
      .then(resp => {
        if (resp.body.organizations) {
          this.organizations = resp.body.organizations
          if (domain && this.organizations.length === 1) {
            this.organization = this.organizations[0].o_name
            this.organizationId = this.organizations[0].o_uid
            this.organizationType = this.organizations[0].o_fk_type_id
          }
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
    selectRole (e) {
      if (e.checked) {
        this.checkedRoles.push(e.role)
      } else {
        var j = this.checkedRoles.indexOf(e.role)
		     if (j >= 0) {
		       this.checkedRoles.splice(j, 1)
		     }
      }
    },
    updateType (event) 
    {
      this.organizationId = null
      this.organizationType = null
      
      if (this.organization.length <= 1) {
        this.organizations = []
      }
      if (event.inputType && event.inputType.indexOf('delete') >=0)
      {
        return
      }
      if (this.organization.length === 2) {
        this.getOrganizations()
      }
      if (this.organization.length < 5) {
        return
      }
      
     // this.info.message = null
      
        // valid organism
      this.showOrganismMessage = false
      var regex = new RegExp(/^[A-z0-9À-ž\s\-'@()]{5,300}$/)
      if (regex.test(this.organization)) {
        var organism = this.organization.trim().toLowerCase()
        var find = this.organizations.find(org => organism.indexOf(org.o_name.toLowerCase()) >= 0 )
        if (find) {
          this.organizationId = find.o_uid
          this.organizationType = find.o_fk_type_id
        } else {
          this.organizationId = null
        }
      } else {
        this.showOrganismMessage = true
      }     
    },
    close () {
      this.$store.commit('user/toggleShow', null)
    },
    hasRole (client, name) {
      return this.$store.getters['user/hasRole'](client, name)
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

form.form-organization input:invalid {
  border-color: red;
}
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
span.fmt-button.small {
  font-size: 0.9rem;
  padding: 2px 3px;
  display: inline-block;
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
z-index:100;
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
datalist {
    max-height: 500px;
    overflow-y: auto;
}

</style>
