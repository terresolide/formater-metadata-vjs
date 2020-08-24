<template>
   <div class="page-login">
     <h1>WELCOME !</h1>
  </div>
  </template>
  <script>
 
  
  export default {
    name: 'FormaterLogin',
    mounted () {
      var location = this.$custURL(window.location.href)
      if (window.opener) {
        window.opener.postMessage(
          {
            code:location.authParams['code'],
            state: location.authParams['state'],
            url: window.location.href
          },
          document.location.origin
        )
      }

      window.close()
    }
  }
  </script>
  <style scoped>
  div.page-login {
    width:100%;
    height:100vh;
  }
  </style>
