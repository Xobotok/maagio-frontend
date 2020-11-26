<template>
  <div id="app">
    <component :is="layout">
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
  export default {
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
  @import 'assets/normalize.css';
</style>
