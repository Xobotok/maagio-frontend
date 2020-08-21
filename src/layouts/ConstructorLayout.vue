<template>
    <div class="app-constructor-layout">
        <Navbar />
        <main class="app-content">
            <div class="app-page">
                <router-view/>
            </div>
        </main>
    </div>
</template>

<style lang="less">
    @import '../assets/main.less';
</style>

<script>
    import Navbar from '@/components/app/Navbar.vue'
    export default {
      name: 'constructor-layout',
      components: {
        Navbar
      }
    }
</script>