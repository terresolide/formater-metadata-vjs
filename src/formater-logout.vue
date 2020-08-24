<template>
   <div class="page-logout">
  </div>
  </template>
  <script>
 
  
  export default {
    name: 'FormaterLogout',
    mounted () {
      var url = new URL(document.location.href)
      
      if (window.opener) {
          window.opener.postMessage('logout', document.location.origin)
      }
//       if (window.parent) {
//         window.parent.postMessage(document.location.href, document.location.origin)
//       }
      // window.close()
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
