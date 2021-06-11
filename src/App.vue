<template>
  <div id="app">
    <component :is="layout" :key="forced_key">
      <router-view/>
    </component>
  </div>
</template>
<script>
  import ConstructorLayout from '@/layouts/ConstructorLayout';
  import EmptyLayout from '@/layouts/EmptyLayout';
  import ShowLayout from '@/layouts/ShowLayout';
  import db from './IndexedDbHelper.js'
  import helper from './VueHelper.js'

  var script = document.createElement('script');
  script.src = 'https://js.stripe.com/v3/';
  script.defer = true;
  document.head.appendChild(script);
  var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDEzKHEUbk3ocLvIgBGMOsJjguHEj0LR4s';
  script.defer = true;
  document.head.appendChild(script);
  var script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js';
  script.defer = true;
  document.head.appendChild(script);
  export default {
    data: function () {
      return {
        forced_key: 0,
      }
    },
    computed: {
      layout() {
       return (this.$route.meta.layout || 'empty') + '-layout'
      }
    },
    components: {
      EmptyLayout, ConstructorLayout, ShowLayout
    },
  }
</script>

<style lang="less">
  @import 'assets/green_template.less';
</style>
<style lang="less">
  @import 'assets/normalize.css';
  @import 'assets/brown_template.less';

  @import 'assets/blue_template.less';
</style>
