<template>
    <div class="project-publish">
        <div class="publish-header">
            <span>MAGGIO LINK</span> This is your link of the app. Until you publish the app, this link will remain private.
        </div>
        <div class="publish-container">
            <div class="personal-link" id="personal-link" v-if="$parent.personalLink !== ''">{{$parent.personalLink}}</div>
            <div class="personal-link red" v-if="$parent.personalLink == ''">Press Publish to get the link </div>
            <div class="copy-link" v-if="$parent.personalLink != ''" :class="{copied: linkCopied == true}" @click="copyLink"><span v-show="linkCopied == false">Copy link</span>
                <span v-show="linkCopied == true">Link copied</span>
            </div>
        </div>

    </div>
</template>

<script>
  export default {
    'name': 'ProjectPublish',
    data: ()=>({
        speicalLink: '',
      linkCopied: false,
    }),
    mounted() {

    },
    methods: {
        copyLink: function () {
          if(this.linkCopied === true) {
            return;
          }
          var $tmp = $("<textarea>");
          $("body").append($tmp);
          $tmp.val($('#personal-link').text()).select();
          document.execCommand("copy");
          $tmp.remove();
          this.linkCopied = true;
          let obj = this;
          setTimeout(function () {
            obj.linkCopied = false;
          }, 1000)
        }
    }
  }
</script>
