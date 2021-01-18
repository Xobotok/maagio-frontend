<template>
    <div class="app-show-layout">
        <main class="app-content">
            <div class="app-page">
                <div class="show-nav" v-if="activeTab != 'home'">
                    <div class="show-nav-tab" @click="activeTab = 'home'"> <div class="home-icon"></div></div>
                    <!--<div class="show-nav-tab"> <div class="welcome-icon"></div></div>-->
                    <div class="show-nav-tab" v-if="tabs.floors === true" @click="openFloors" :class="{active: activeTab === 'Floor plates'}"> <div class="floor-icon"></div></div>
                    <div class="show-nav-tab inactive" v-if="tabs.floors !== true"> <div class="floor-icon"></div></div>
                    <div class="show-nav-tab" v-if="tabs.units === true" @click="activeTab = 'Units'" :class="{active: activeTab === 'Units'}"> <div class="info-icon"></div></div>
                    <div class="show-nav-tab" v-if="tabs.galleries === true" @click="activeTab = 'Gallery'" :class="{active: activeTab === 'Gallery'}"> <div class="image-icon"></div></div>
                    <div class="show-nav-tab inactive" v-if="tabs.galleries !== true"> <div class="image-icon"></div></div>
                    <div class="show-nav-tab" v-if="tabs.map === true" @click="activeTab = 'Contact'" :class="{active: activeTab === 'Contact'}"> <div class="map-icon"></div></div>
                    <div class="show-nav-tab inactive" v-if="tabs.map !== true"> <div class="map-icon"></div></div>
                </div>
                <router-view />
            </div>
        </main>
    </div>
</template>

<script>
  export default {
    name: 'show-layout',
    data: ()=>({
      tabs: {
        home: false,
          /*welcome: false,*/
          units: false,
        floors: false,
        galleries: false,
        map: false,
      },
      activeTab: 'home',
    }),
    mounted(){

    },
    methods: {
      openFloors() {
        this.activeTab = 'Floor plates';
        $(document).ready(function () {
          $('#floor-image').css('display', 'none');
          $('#floor-image').css('display', 'inline-block');
        })
      }
    }
  }
</script>

<style lang="less">
    @import '../assets/show.less';
</style>
