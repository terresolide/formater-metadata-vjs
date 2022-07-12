<i18n>
{
  "en": {
    "access_token": "Acess token",
    "all_access": "All access",
    "copied_to_clipboard": "The token &laquo;{client}&raquo; has been copied in clipboard.",
    "copy_in_clipboard": "Copy the access token in clipboard",
    "select_all": "Select all",
    "WAITING": "Waiting for treatment",
    "REJECTED": "Rejected",
    "ACCEPTED": "Accepted"
  },
  "fr": {
    "access_token": "token d'accès",
    "all_access": "Tout accès",
    "copied_to_clipboard": "Le token &laquo;{client}&raquo; a été copié dans le presse-papier.",
    "copy_in_clipboard": "Copier le token d'accès dans le presse-papier",
    "select_all": "Tout sélectionner",
    "WAITING": "En attente de traitement",
    "REJECTED": "Refusé",
    "ACCEPTED": "Accepté"
  }
}
</i18n>
<template>
<span>
  <div class="role-line"  v-if="(client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1)"> 
       <div class="title-client" style="cursor:pointer;text-align:left;"  @click="toggleClient($event)">
         <span style="font-weight:800;">{{title(client)}}</span> <em style="float:right;font-size:0.9rem;">({{$t('all_access')}})</em>
        </div>
        <div class="fmt-center" style="clear:both;">
            <formater-tooltip :description="description(client)"></formater-tooltip>
        </div>
        <div class="fmt-center" >
          <span v-if="client.groups && Object.keys(client.groups).length > 1" >
            <input v-if="selectedClients.indexOf(name + '.1') >=0" 
            type="checkbox"  :title="$t('select_all')" :checked="true" disabled value="no" />
            <input v-else :disabled="!canAskClient.view" type="checkbox"
             v-model="selectedClients" :title="$t('select_all')" @change="toggleAll($event)" :value="name + '.0'"/>
         </span>
        </div>
        <div class="fmt-center" >
          <span v-if="client.groups && Object.keys(client.groups).length > 1" >
           <input :disabled="!canAskClient.download" type="checkbox"
             v-model="selectedClients" :title="$t('select_all')" @change="toggleAll($event)" :value="name + '.1'"/>
          </span>
        </div>
        <div class="fmt-center">
         <span v-if="client.token" class="copy-clipboard" :title="$t('copy_in_clipboard')">
               <span @click="copyClipboard($event, name)" class="fmt-button small fa fa-clipboard" :style="{background: $store.state.style.primary}">
                 {{$t('access_token')}}
               </span>
              <div class="clipboard-tooltip"  @click="removeTooltip($event)" v-html="$t('copied_to_clipboard', {client: name})"></div>
           </span> 
        </div>
       </div> 
       <div :class="{'client-content': (client.groups && Object.keys(client.groups).length > 1) || (client.roles && client.roles.length > 1) }">
		     <div  class="role-line"  v-for="(role, index) in client.roles" >
		            <div>{{title(role)}}</div>
		            <div class="fmt-center">
		            <formater-tooltip :description="description(role)"></formater-tooltip>
		            </div>
		            <div class="fmt-center">
		             <span v-if="Object.keys(role.parameters).length === 0 || role.parameters.view">
		              <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
		              <!--  <i v-if="role.parameters.view" class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
		              --> 
		              <input v-if="!role.access && !role.status" type="checkbox"  :value="name + '.' + role.name"
		               :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)"/>
		             </span>
		            </div>
		            <div class="fmt-center">
		               <span v-if="Object.keys(role.parameters).length === 0 || role.parameters.download">
		             <!--   <i v-if="role.parameters.download" class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
		              --> 
			              <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
			              <input v-if="!role.access && !role.status" type="checkbox" :value="name + '.' + role.name"
		              :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)" />
		              </span>
		            </div>
		  </div>
	   <div class="role-line" v-if="client.groups" v-for="group, key in client.groups">
	      <div>{{title(group[0], key)}}</div>
	      <div class="fmt-center">
	         <formater-tooltip :description="description(group[0])"></formater-tooltip>
	      </div>
	      <div v-for="role, index in group" class="fmt-center">
	         <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
	         <span v-else>
	           <span v-if="role.status === 'WAITING'" :title="$t('WAITING')">
	             <i class="fa fa-clock-o"></i>
	           </span>
	            <span v-if="role.status === 'REJECTED'" :title="$t('REJECTED')">
	             <i class="fa fa-close" style="color:darkred;"></i>
	           </span>
	           <span v-if="!role.status">
	              <input v-if="index === 1 || checkedRoles.indexOf(name + '.' + group[1].name) < 0" type="checkbox" :value="name + '.' + role.name" 
	              :checked="checkedRoles.indexOf(name + '.' + role.name) >= 0" @click="changeRole($event)"/>
	              <input v-if="index === 0 && checkedRoles.indexOf(name + '.' + group[1].name) >=0"  type="checkbox"  :checked="true" disabled value="no" />
	
	           </span>
	         </span>
	      </div>
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
           console.log(key)
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
    lang () {
      return this.$store.state.lang
    }
  },
  data () {
    return {
      selectedClients: []
    }
  },
  created () {
    console.log(this.client)
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
      console.log(event)
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
  grid-template-columns: minmax(100px,180px) 50px minmax(50px, 120px) minmax(50px, 120px) minmax(50px, 120px);
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