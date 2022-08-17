<i18n>{
   "en":{
   },
   "fr":{
      
   }
}
</i18n>
<template>
 <span class="formater-contact" v-if="fields">
   <address>
     <div class="formater-organism">
       <span v-if="fields[8]">
         <a :href="fields[8]" target="_blank"> <i class="fa fa-link"></i>{{fields[2]}}</a>
       </span>
       <span v-else class="tabulate">{{fields[2]}}</span>
     </div>
     <div class="formater-name" v-if="fields[3]">
        <span v-if="fields[9]">
           <a :href="fields[9]" target="_blank"><i class="fa fa-link"></i>{{fields[3]}}</a>
        </span>
        <span v-else class="tabulate">{{fields[3]}}</span>
     </div>
     <div class="tabulate" v-for="(line,index) in address">{{line}}</div>
     <div class="tabulate" style="margin-top:4px;"><a :href="'mailto:'+ fields[4]">{{fields[4]}}</a></div>

    <!--   <div class="formater-address" v-if="addresse"></div>-->
   </address>
 </span>
</template>
<script>
/**
 * contact is an array 
 * 0: role,
 * 1: resource or metadata
 * 2: organisation name
 * 3: individual name
 * 4: email address
 * 5: ?
 * 6: 
 * 7: postal address format with | separator
 * 8: organisation link identifier ror
 * 9: individu link identifier orcid
 */
export default {
  name: 'FormaterContact',
  components: {
  },
  props: {
    contact: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
     fields: null,
     address: []
    }
  },
  
  mounted () {
    console.log(this.contact)
    this.fields = this.contact
    this.extractAddress()
  },
  methods: {
    extractAddress() {
      if (this.fields[7]) {
        this.address = this.fields[7].split(',')
      }
    }

  }
}
</script>
<style>
.formater-contact{
  font-size: 1em;
  max-width:300px;
  min-width:250px;
  margin: 5px 20px 5px 0;
  float:left;
  vertical-align:text-top;
}
.formater-contact div.formater-organism a,
.formater-contact div.formater-name a {
  color: black;
}
.formater-contact .tabulate {
  margin-left: 17px;
  display: inline-block;
}
.formater-contact i.fa.fa-link {
  margin-right:2px;
  max-width:15px;
  min-width:15px;
}
.formater-contact div.formater-organism a:hover,
.formater-contact div.formater-name a:hover {
  color: darkred;
}
.formater-contact h3 {
	margin-bottom: 0px;
}
.formater-contact h3 + div {
  margin-left:24px;
  margin-bottom: 5px;
}
.formater-contact address{
  margin-left:5px;
}
.formater-contact .formater-organism{
  font-weight: 800;
}
</style>