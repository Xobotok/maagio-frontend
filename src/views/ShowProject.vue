<template>
    <div class="show-project">
        <div class="app-head" v-if="this.$parent.activeTab !== 'home'">
            <div class="app-head-name">{{project.name}}</div>
            <div class="app-head-tab">{{this.$parent.activeTab}}</div>
        </div>
        <ShowHome v-if="this.$parent.activeTab === 'home'"></ShowHome>
        <Floors v-if="this.$parent.activeTab === 'Floor plates'"></Floors>
        <Gallery v-if="this.$parent.activeTab === 'Gallery'"></Gallery>
        <ShowMap v-if="this.$parent.activeTab === 'Contact'"></ShowMap>
    </div>
</template>

<script>
  import constants from '../Constants';
  import ShowHome from '@/components/show/ShowHome.vue'
  import Floors from '@/components/show/ShowFloors.vue'
  import Gallery from '@/components/show/ShowGallery.vue'
  import ShowMap from '@/components/show/ShowMap.vue'
  export default {
    components: {
      ShowHome,Floors, Gallery, ShowMap
    },
    name: 'show',
    data: ()=>({
      project: '',
      tabsName:[]
    }),
    methods: {
      checkTabStatus(){
        this.$parent.tabs.home = true;
        if(this.project.floors.length > 0) {
          this.$parent.tabs.floors = true;
        }
        if(this.project.galleries.length > 0) {
          this.$parent.tabs.galleries = true;
        }
        if(this.project.map != '') {
          this.$parent.tabs.map = true;
        }
      },
      startShow() {
        if(this.$parent.tabs.floors === true) {
          this.$parent.activeTab = 'Floor plates';
        } else if(this.$parent.tabs.galleries === true){
          this.$parent.activeTab = 'Gallery';
        } else if(this.$parent.tabs.map === true){
          this.$parent.activeTab = 'Contact';
        }
      }
    },
    mounted(){
      let project = document.location.href;
      let data = {project: project.split('project=')[1]};
      let obj = this;
      $.ajax({
        url         : constants.BACKEND_URL + 'project/show',
        type        : 'GET',
        data        : data,
        dataType    : 'json',
        success     : function( respond, status, jqXHR ){
          if(respond !== null) {
            if(respond.ok === 1) {
              obj.project = respond.data;
              obj.project.markers.culture = [];
              obj.project.markers.restaurant = [];
              obj.project.markers.sport = [];
              obj.project.markers.nature = [];
              obj.checkTabStatus();
            } else {

            }
          } else {

          }

        },

        error: function( jqXHR, status, errorThrown ){

        }
      });
    },
  }
</script>
