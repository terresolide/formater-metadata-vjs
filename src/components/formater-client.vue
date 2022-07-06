<template>
<span>
 <div  class="role-line"  v-for="(role, index) in client.roles" >
            <div>{{title(role)}}</div>
            <div class="fmt-center">
            <formater-tooltip :description="description(role)"></formater-tooltip>
             <!--  <div v-if="role.description" style="position:relative;">
                 <span class="fa fa-info-circle" @click="showTooltip($event)"></span>
                 <div class="fmt-tooltip" @click="hideTooltip()" v-html="description(role)"></div>
              </div>   -->
            </div>
            <div class="fmt-center">
              <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
              <!--  <i v-if="role.parameters.view" class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
              --> 
              <input v-if="!role.access && !role.status && role.parameters.view" type="checkbox" v-model="checkedRoles" :value="clientName + '.' + role.name" />
            </div>
            <div class="fmt-center">
             <!--   <i v-if="role.parameters.download" class="fa" :class="{'fa-close': !role.access, 'fa-check': role.access} "></i>
              --> 
              <span v-if="role.access" :title="$t('ACCEPTED')"><i class="fa fa-check" style="color:green;"></i></span>
              <input v-if="!role.access && !role.status && role.parameters.download" type="checkbox" v-model="checkedRoles" :value="clientName + '.' + role.name" @click="changeRole($event)"/>
            </div>
       <!--      <div  v-if="canAsk" class="fmt-center">
             </div> --> 
            <div>
             </div>
  </div>
   <div class="role-line" v-if="client.groups" v-for="group, key in client.groups">
      <div>{{key}}</div>
      <div class="fmt-center">
        <div v-if="group[0].description" style="position:relative;">
           <span class="fa fa-info-circle" @click="showTooltip($event)"></span>
           <div class="fmt-tooltip" @click="hideTooltip()" v-html="description(group[0])"></div>
        </div> 
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
              <input v-if="index === 1 || checkedRoles.indexOf(clientName + '.' + group[1].name) < 0" type="checkbox" v-model="checkedRoles" :value="clientName + '.' + role.name" />
              <input v-if="index === 0 && checkedRoles.indexOf(clientName + '.' + group[1].name) >=0"  type="checkbox"  :checked="true" disabled value="no" />

           </span>
         </span>
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
    client: {
      type: Object,
      default: null
    },
    checkedRoles: {
      type: Array,
      default: () => []
    }
  },
  created () {
    console.log(this.client)
  },
  methods: {
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
    description (role) {
      if (role.description && role.description[this.lang]) {
        return role.description[this.lang]
      } else if (role.description) {
        return role.description[Object.keys(role.description)[0]]
      }
      return null
    },
    changeRole (event) {
      console.log(event)
    }
  }
}
</script>