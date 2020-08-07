<template>
   <div class="page-login">
  </div>
  </template>
  <script>
 
  
  export default {
    name: 'FormaterLogin',
    mounted () {
      if (window.parent) {
        window.parent.postMessage(document.location.href, document.location.origin)
      }
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
