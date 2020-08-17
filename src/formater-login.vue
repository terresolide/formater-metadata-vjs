<template>
   <div class="page-login">
  </div>
  </template>
  <script>
 
  
  export default {
    name: 'FormaterLogin',
    mounted () {
      // var url = new URL(document.location.href)
      var split = window.location.href.split(/\&|\?/)
      var result = []
      split.forEach(function(tab) {
        var value = tab.split('=')
        if (value.length > 1) {
          result[value[0]] = value[1]
        }
      })
      if (window.opener) {
          window.opener.postMessage({code:result['code'], app: result['state']}, document.location.origin)
      }
//       if (window.parent) {
//         window.parent.postMessage(document.location.href, document.location.origin)
//       }
       window.close()
    }
  }
  </script>
  <style scoped>
  div.page-login {
    width:100%;
    height:100vh;
    background:red;
  }
  </style>
