<i18n>{
  "fr": {
     "command_to_execute": "Commande curl à executer pour télécharger cette archive",
     "copied_clipboard": "La commande a été enregistrée dans votre presse-papier.",
     "copy_clipboard": "Copier la commande dans le presse-papier",
     "title": "Télécharger en ligne de commande avec curl"
  },
  "en": {
     "command_to_execute": "Curl command to execute to download this archive",
     "copied_clipboard": "The command has been copied in clipboard.",
     "copy_clipboard": "Copy the command in clipboard",
     "title": "Download from command line with curl"
  }
}</i18n>
<template>
<div v-show="href" class="fmt-console">
  <div @click="close" class="fmt-close" style="position:absolute;right:5px;top:3px;"></div>
  <h3>{{$t('title')}}</h3>
  <div >
    <div><b>Archive</b>: {{file}}</div>
    <div><b>{{$t('command_to_execute')}}:</b></div>
	  <div style="display:inline-block;font-family: monospace;max-height:200px;overflow:scroll;padding:3px;width:calc(100% - 100px);color:#5ddc5d;background:#333;">
	  curl {{href}}?_bearer={{token}} -o {{file}}
	  </div>
	  <div style="display:inline-block;vertical-align:top;max-width:90px">
	  <a class="fmt-button fa fa-clipboard" @click="copy2clipboard($event)" :title="$t('copy_clipboard')"> Copier</a>
    <div class="clipboard-tooltip" @click="removeTooltip">{{$t('copied_clipboard')}}</div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: 'FormaterCommandLine',
  data () {
    return {
      href: null,
      token: null,
      file: null,
      commandEventListener: null
    }
  },
  created () {
    this.commandEventListener = this.receiveEvent.bind(this)
    document.addEventListener('fmt:commandEvent', this.commandEventListener)
  },
  destroyed () {
    document.removeEventListener('fmt:commandEvent', this.commandEventListener)
    this.commandEventListener = null
  },
  methods: {
    close () {
      this.href = null
      this.token = null
      this.file = null
    },
    copy2clipboard (e) {
      console.log('copy to clipboard')
      var target = e.target
      var text = 'curl ' + this.href + '?_bearer=' + this.token + ' -o ' + this.file
      navigator.clipboard.writeText(text).then(function() {
        /* clipboard successfully set */
        target.classList.add('tooltip-show')
        setTimeout(function () {
          target.classList.remove('tooltip-show')
        }, 6000)
      }, function() {
        alert(_this.$i18n.t('unauthorized_clipboard'))
      }); var _this = this
    },
    receiveEvent(e) {
      this.href = e.detail.href
      this.token = e.detail.token
      this.file = e.detail.title + '.zip'
    },
    removeTooltip ()
    {
      var node = this.$el.querySelector('.tooltip-show')
      if (node) {
        node.classList.remove('tooltip-show')
      }
    }
  }
}
</script>
<style scoped>
.fmt-console {
   position: fixed;
   top: 50%;
   left: 50%;
   z-index:3;
   background: white;
   width:90%;
   max-width: 900px;
   padding:10px;
   word-break: break-all;
   transform: translate(-50%, -50%);
   border-radius: 3px;
   box-shadow: 2px 3px 3px 3px rgba(0, 0, 0, 0.5);
}
.fmt-close {
  border:1px dotted white;
  padding: 3px;
  border-radius:3px;
  cursor: pointer;
}
.fmt-close:hover {
  border-color:black;
}
a.tooltip-show + .clipboard-tooltip {
  display:block;
}
</style>