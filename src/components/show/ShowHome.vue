<template>
    <div class="start-show">
        <div class="start-show-content">
            <img v-if="$parent.project.project_logo" :src="$parent.project.project_logo" alt="">
            <div class="start-button" @click="this.$parent.startShow">
                START
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants';
  import {precacheAndRoute} from 'workbox-precaching';
  import { register } from 'register-service-worker'
  export default {
    name: 'show-home',
    data: ()=>({
      logo: '',
    }),
    beforeMount(){
     const manifest = document.querySelector('[rel="manifest"]');
     var src = window.location.href.split('project=');
     src = src[src.length - 1];
     src = constants.BACKEND_URL + 'manifests/' + src + '.json';
      const nextManifest = document.createElement('link');
      nextManifest.id = 'manifest';
      nextManifest.rel = 'manifest';
      nextManifest.href = src;
      manifest.parentNode.replaceChild(nextManifest, manifest);
    },
  }
</script>
