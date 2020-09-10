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
