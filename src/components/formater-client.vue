<i18n>
{
  "en": {
    "access_token": "Acess token",
    "all_access": "All access",
    "copied_to_clipboard": "The token &laquo;{client}&raquo; has been copied in clipboard.",
    "copy_in_clipboard": "Copy the access token in clipboard",
    "no_charter": "No charter",
    "select_all": "Select all",
    "signed": "Signed",
    "WAITING": "Waiting for treatment",
    "REJECTED": "Rejected",
    "ACCEPTED": "Accepted",
    "CONDITION": "Waiting your signature"
  },
  "fr": {
    "access_token": "token d'accès",
    "all_access": "Tout accès",
    "copied_to_clipboard": "Le token &laquo;{client}&raquo; a été copié dans le presse-papier.",
    "copy_in_clipboard": "Copier le token d'accès dans le presse-papier",
    "no_charter": "Aucune charte",
    "select_all": "Tout sélectionner",
    "signed": "Signée",
    "WAITING": "En attente de traitement",
    "REJECTED": "Refusé",
    "ACCEPTED": "Accepté",
    "CONDITION": "En attente de votre signature"
  }
}
</i18n>
<template>
<span>
  <div v-if="show && show.client" class="role-line deployed" >
      <div  class="title-client" style="cursor:pointer;text-align:left;"  >
         <span style="font-weight:800;">{{title(client)}}</span> 
      </div>
  </div>
  <div v-else-if="(client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1)" class="role-line">
  <!--  <div    v-if="(client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1)"> -->
       <div  class="title-client" style="cursor:pointer;text-align:left;"  @click="toggleClient($event)">
         <span style="font-weight:800;">{{title(client)}}</span> 
        </div>
        <div class="fmt-center" style="clear:both;">
            <formater-tooltip :description="description(client)"></formater-tooltip>
        </div>
        <div class="fmt-center" >
         
        </div>
        <div class="fmt-center" >
         
        </div>
        <div class="fmt-center">
         <span v-if="client.token" class="copy-clipboard" :title="$t('copy_in_clipboard')">
               <span @click="copyClipboard($event, name)" class="fmt-button small fa fa-clipboard" :style="{background: $store.state.style.primary}">
                 {{$t('access_token')}}
               </span>
              <div class="clipboard-tooltip"  @click="removeTooltip($event)" v-html="$t('copied_to_clipboard', {client: name})"></div>
           </span> 
        </div>
      <!--  </div> --> 
    </div>

       <div :class="{'client-content': (client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1) }">
		     <div class="role-line" v-if="showRole(null) && client.groups && Object.keys(client.groups).length > 1">
				   <!--  <div>
		         <span style="font-size:1.2rem;">{{$t('select_all')}}</span>
		        </div>
		        <div class="fmt-center" style="clear:both;">
		            
		        </div>
		        <div class="fmt-center" >
		          <span  >
		            <input v-if="selectedClients.indexOf(name + '.1') >=0" 
		            type="checkbox"  :title="$t('select_all')" :checked="true" disabled value="no" />
		            <input v-else :disabled="!canAskClient.view" type="checkbox"
		             v-model="selectedClients" :title="$t('select_all')" @change="toggleAll($event)" :value="name + '.0'"/>
		         </span>
		        </div>
		        <div class="fmt-center" >
		          <span >
		           <input :disabled="!canAskClient.download" type="checkbox"
		             v-model="selectedClients" :title="$t('select_all')" @change="toggleAll($event)" :value="name + '.1'"/>
		          </span>
		        </div>-->
		     </div>
		     <div  class="role-line"  v-for="(role, index) in client.roles" v-show='showRole(role.name)'>
		            <div>{{title(role)}}</div>
		            <div class="fmt-center">
		            <formater-tooltip :description="description(role)"></formater-tooltip>
		            </div>
		            <div v-for="key in ['view', 'download']" class="fmt-center">
		              <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
                  <!--  <i v-if="role.parameters.view" class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
                  --> 
                  <span v-else-if="role.status">
		                  <span v-if="role.status === 'WAITING'">
		                    <i class="fa fa-clock-o" ></i>
		                  </span>
		                  <span v-else-if="role.status && role.status === 'REJECTED'">
		                    <i class="fa fa-close" style="color:darkred;"></i>
		                  </span>
		                  <span v-if="role.status === 'CONDITION'" :title="$t('CONDITION')">
		                       <router-link :to="{name:'Charter', params: {id: role.charterId}}">
		                           <i class="fa fa-pencil" ></i>
		                       </router-link>
		                  </span>
                 </span>
                 <span v-else-if="(Object.keys(role.parameters).length === 0 || !role.parameters.charter)">
			              <input  type="checkbox" :value="name + '.' + role.name" 
		              :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)" />
		             </span>
		             <span v-else-if="role.charterId" :title="$t('CONDITION')" >
		                  <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                               <i class="fa fa-pencil" ></i>
                       </router-link>
		             </span>
		            </div>
		            <div class="fmt-center">
		              <span v-if="role.charterId">
		               <router-link v-if="role.charterId" :to="{name: 'Charter', params: {id: role.charterId}}">
                      <span v-if="$store.getters['charters/isSigned'](role.charterId)">
                        {{$t('signed')}}
                       </span>
			                <span  v-else :title="$t('CONDITION')">
			                 <i class="fa fa-pencil"></i>
			                </span>
                   </router-link>
                  </span>
                  <span v-else><em>{{$t('no_charter')}}</em></span>
                </div>
		  </div>
	   <div class="role-line" v-if="client.groups" v-show="showGroup(key)" v-for="group, key in client.groups">
	      <div>{{title(group[0], key)}}</div>
	      <div class="fmt-center">
	         <formater-tooltip :description="description(group[0])"></formater-tooltip>
	      </div>
	      <div v-for="role, index in group" class="fmt-center">
	         <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
	         <span v-else-if="role.status">
	           <span v-if="role.status === 'WAITING'" :title="$t('WAITING')">
	             <i class="fa fa-clock-o"></i>
	           </span>
	            <span v-if="role.status === 'REJECTED'" :title="$t('REJECTED')">
	             <i class="fa fa-close" style="color:darkred;"></i>
	           </span>
	             <span v-if="role.status === 'CONDITION'" :title="$t('CONDITION')">
               <router-link :to="{name:'Charter', params: {id: role.charterId}}">
                 <i class="fa fa-pencil" ></i>
               </router-link>
             </span>
             </span>
           <span v-else="!role.status">
              <input v-if="index === 1 || checkedRoles.indexOf(name + '.' + group[1].name) < 0" type="checkbox" :value="name + '.' + role.name" 
              :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)" />
              <input v-if="index === 0 && checkedRoles.indexOf(name + '.' + group[1].name) >=0"  type="checkbox"  :checked="true" disabled value="no" />

           </span>
	         
	      </div>
	      <div>
	         <span v-if="group[0].charterId">
		         <router-link :to="{name:'Charter', params: {id: group[0].charterId}}">
	                <span v-if="$store.getters['charters/isSigned'](group[0].charterId)">
	                   {{$t('signed')}}
	                </span>
	                <span :title="$t('CONDITION')" v-else>
	                 <i class="fa fa-pencil"></i>
	                </span>
	            </router-link>
           </span>
           <span v-else><em>{{$t('no_charter')}}</em></span>
        </div>
     </div>
   </div>
 </span>
</template>
<script>
const FormaterTooltip = () => import('@/components/formater-tooltip.vue')
export default {
  name: 'FormaterClient',
  components: {
    FormaterTooltip
  },
  props: {
    name: {
      type: String,
      default: null
    },
    client: {
      type: Object,
      default: null
    },
    checkedRoles: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    canAskClient () {
       var canAskView = false
       var canAskDownload = false
       if (this.client.groups) {
         for (var key in this.client.groups) {
           if (!this.client.groups[key][0].access && !this.client.groups[key][0].status) {
             canAskView = true
           }
           if (!this.client.groups[key][1].access && !this.client.groups[key][1].status) {
             canAskDownload = true
           }
         }
       }
       return {view: canAskView, download: canAskDownload}
    },
//     disabled () {
      
//       var user = this.$store.getters['user/get']
//       if (!user) {
//         return null
//       }
//       return !user.identityProvider
//     },
    lang () {
      return this.$store.state.lang
    },
    show () {
      return this.$store.getters['user/show']
    }
  },
  data () {
    return {
      selectedClients: []
    }
  },
  created () {
//     console.log(this.client)
  },
  methods: {
    title (role, group) {
      if (role.title) {
        if (role.title[this.lang] && this.lang !== 'en') {
          return role.title[this.lang]
        } else if (role.title.en) {
          return role.title.en
        }
      }
      if (group) {
        return group
      }
      return role.name
    },
    description (role) {
      if (role.description && role.description[this.lang]) {
        return role.description[this.lang]
      } else if (role.description) {
        return role.description[Object.keys(role.description)[0]]
      }
      return null
    },
    copyClipboard (event) {
      var _this = this
      var target = event.target
      navigator.clipboard.writeText(this.client.token).then(function() {
        /* clipboard successfully set */
        target.classList.add('tooltip-show')
        setTimeout(function () {
          target.classList.remove('tooltip-show')
        }, 6000)
      }, function() {
        alert(_this.$i18n.t('unauthorized_clipboard'))
      }); var _this = this
    },
    removeTooltip (event)
    {
      var node = event.target
      node.previousElementSibling.classList.remove('tooltip-show')
    },
    showRole (roleName) {
      if (!this.show || !this.show.roles) {
        return true
      } else {
        return this.show.roles.indexOf(roleName) >= 0
      }
    },
    showGroup (key) {
      if (!this.show || !this.show.roles) {
        return true
      } else {
        var intersection = this.client.groups[key].filter(role => this.show.roles.includes(role.name))
        return intersection.length > 0
      }
    },
    toggleAll(event) {
      var value = event.target.value
      var values = value.split('.')
      var index = parseInt(values[1])
      var view = true
      var download = false
      if (index === 1) {
        download = true
      }
      var checked = event.target.checked
      if (this.client.groups) {
        for (var key in this.client.groups) {
          var role = this.client.groups[key][index]
          var roleName = this.name + '.' + role.name
          if (checked && this.checkedRoles.indexOf(roleName) < 0 && !role.access && !role.status) {
            this.emitChange(roleName, true)
          }
          if (!checked) {
            this.emitChange(roleName, false)
          }
        }
      }
      if (this.client.roles) {
        for (var i in this.client.roles) {
          var role = this.client.roles[i]
          var roleName = this.name + '.' + role.name
          if (checked && view && role.parameters.view && this.checkedRoles.indexOf(roleName) < 0) {
            if (!role.access && !role.status && role.parameters.display) {
             this.emitChanges(roleName, true)
            }
          }
          if (checked && download && role.parameters.download && this.checkedRoles.indexOf(roleName) < 0) {
            if (!role.access && !role.status && role.parameters.display) {
              this.emitChanges(roleName, true)
            }
          }
          if (!checked) {
            this.emitChange(roleName, false)

          }
        }
      }
    },
    toggleClient (event) {
      var target = event.target
      while (!target.classList.contains('role-line')) {
        target = target.parentNode
      }
      target.classList.toggle('deployed')
    },
    emitChange(roleName, value) {
      this.$emit('roleChange', {role: roleName, checked: value})
    },
    changeRole (event) {
      var target = event.target
      this.emitChange(target.value, target.checked)
    }
  }
}
</script>
<style>
 div.title-client::before {
  content: ' + ';
}
div.deployed div.title-client::before {
  content: ' - ';
}
div.client-content {
 display:none;
}
div.deployed + div.client-content {
  display:block;
}
div.role-line {
  display: grid;
  grid-template-columns: minmax(100px,180px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 150px);
  grid-gap: 5px;
  text-align:center;
}

div.client-content div.role-line:nth-child(2n + 1) {
  background: #f3f3f3;
}

div.role-line > div {

}
div.role-line > div:first-child {
  min-width: 100px;
  max-width: 180px;
  text-align: right;
}
.clipboard-tooltip {
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

.copy-clipboard {
  position: relative;
}
span div.clipboard-tooltip  {
  display:none;
  cursor: pointer;
  font-size:0.8rem;
  left:0;
}
.tooltip-show + div.clipboard-tooltip {
  display:block;
}
</style>