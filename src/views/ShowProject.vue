<template>
    <div class="show-project" :class="{no__padding: this.$parent.activeTab == 'home'}">
        <div class="app-menu-button"  v-if="this.$parent.activeTab !== 'home'">
            <div class="menu-button" @click="openBrownMenu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="menu-header">{{project.name}}</div>
        </div>
        <div class="app-head" v-if="this.$parent.activeTab != 'home'">
            <div class="app-open-menu">
                <div class="menu-icon"></div>
                <div class="project-name">{{project.name}}</div>
            </div>
            <div class="app-head-name">{{project.name}}</div>
            <div class="app-head-tab" v-if="this.project.house_type == 2 && this.$parent.activeTab == 'Floor plates'">
                Lot Info</div>
            <div class="app-head-tab" v-else>
                {{this.$parent.activeTab}}
            </div>
          <div class="update-container" style="justify-content: flex-end" data-id="update-container">
            <div class="dots-icon" v-if="$store.getters.needUpdate == 0" @click="updateOpen = !updateOpen" style="width: 40px;"></div>
            <div class="update-icon" v-if="$store.getters.needUpdate == 1" @click="updateOpen = !updateOpen"></div>
            <div class="update-list" v-show="updateOpen" style="width: 150px; right: 10px;">
              <div class="update-item" v-if="$store.getters.needUpdate == 1"  @click="update">Update application</div>
              <div class="update-item" @click="updateContent">Update content</div>
            </div>
          </div>
        </div>
            <ShowHome v-if="this.$parent.activeTab === 'home'"></ShowHome>
            <Floors v-if="project.floors.length > 0" v-show="this.$parent.activeTab === 'Floor plates'"></Floors>
            <ShowUnits v-show="this.$parent.activeTab === 'Units' && project.house_type == 1"></ShowUnits>
            <Gallery v-if="project.galleries.length > 0" v-show="this.$parent.activeTab === 'Gallery'"></Gallery>
            <ShowMap v-if="this.$parent.activeTab === 'Contact'"></ShowMap>
    </div>
</template>

<script>
  import constants from '../Constants';
  import ShowHome from '@/components/show/ShowHome.vue'
  import Floors from '@/components/show/ShowFloors.vue'
  import Gallery from '@/components/show/ShowGallery.vue'
  import ShowMap from '@/components/show/ShowMap.vue'
  import ShowUnits from '@/components/show/ShowUnits.vue'
  export default {
    components: {
      ShowHome,Floors, Gallery, ShowMap, ShowUnits
    },
    name: 'show',
    data () {
      return {
        forced_key: 0,
        project: this.$parent.project,
        tabsName:[],
        updateOpen: false,
      }
    },
    methods: {
      update() {
       this.$store.dispatch('updateVersion');
      },
      updateContent() {
        this.$parent.$parent.forced_key = !this.$parent.$parent.forced_key;
      },
      openBrownMenu() {
        $('#brown-hidden-menu').css({'left': '0'})
      },
      openUpdateList(evt) {
        var path = (evt.composedPath && evt.composedPath()) || evt.path;
        for(var i = 0; i < path.length; i++) {
          var dataId = $(path[i]).attr('data-id');
          if(dataId === 'update-container') {
            return;
          }
        }
        this.updateOpen = false;
      },
      actualizeMarkers(){
        var obj = this;
        $(document).ready(()=> {
          for(var i = 0; i < obj.project.floors.length; i++) {
            var floor = obj.project.floors[i];
            var container = $('#floor-image' + floor.id);
            var height = container.parent().height();
            container.height(height);
            for(var n = 0; n < obj.project.floors[i].units.length; n++) {
              var unit = obj.project.floors[i].units[n];
              if(unit.mark == 1) {
                unit.unit_mark.natural_width = container.width() / 100 * unit.unit_mark.width;
                unit.unit_mark.natural_height = container.height() / 100 * unit.unit_mark.height;
                let fontSize = unit.unit_mark.natural_height / 3 / 2;
                let fontSize2 = unit.unit_mark.natural_width / 8;
                if (fontSize < fontSize2) {
                  var min = fontSize;
                } else {
                  var min = fontSize2;
                }
                if (min > 5) {
                  unit.unit_mark.font_size = Number.parseInt(min);
                } else {
                  unit.unit_mark.font_size = 5;
                }
              }
            }
          }
        });
        window.onresize = function () {
          for(var i = 0; i < obj.project.floors.length; i++) {
            var floor = obj.project.floors[i];
            var container = $('#floor-image' + floor.id);
            var height = container.parent().height();
            container.height(height);
            for(var n = 0; n < obj.project.floors[i].units.length; n++) {
              var unit = obj.project.floors[i].units[n];
              if(unit.mark == 1) {
                unit.unit_mark.natural_width = container.width() / 100 * unit.unit_mark.width;
                unit.unit_mark.natural_height = container.height() / 100 * unit.unit_mark.height;
                let fontSize = unit.unit_mark.natural_height / 3 / 2;
                let fontSize2 = unit.unit_mark.natural_width / 8;
                if (fontSize < fontSize2) {
                  var min = fontSize;
                } else {
                  var min = fontSize2;
                }
                if (min > 5) {
                  unit.unit_mark.font_size = Number.parseInt(min);
                } else {
                  unit.unit_mark.font_size = 5;
                }
              }
            }
          }
        }
      },
      startShow() {
        if(this.$parent.tabs.floors === true) {
          this.$parent.activeTab = 'Floor plates';
          this.actualizeMarkers();
        } else if(this.$parent.tabs.units === true){
          this.$parent.activeTab = 'Units';
        } else if(this.$parent.tabs.galleries === true){
          this.$parent.activeTab = 'Gallery';
        } else if(this.$parent.tabs.map === true){
          this.$parent.activeTab = 'Contact';
        }
      }
    },
    mounted(){
      document.addEventListener('click', this.openUpdateList)
      var obj = this;
      console.log('Show project remount')
      $(document).ready(()=> {
        for(var i = 0; i < obj.project.floors.length; i++) {
          var floor = obj.project.floors[i];
          var container = $('#floor-image' + floor.id);
          var height = container.parent().height();
          container.height(height);
          for(var n = 0; n < obj.project.floors[i].units.length; n++) {
            var unit = obj.project.floors[i].units[n];
            if(unit.mark == 1) {
              unit.unit_mark.natural_width = container.width() / 100 * unit.unit_mark.width;
              unit.unit_mark.natural_height = container.height() / 100 * unit.unit_mark.height;
              let fontSize = unit.unit_mark.natural_height / 3 / 2;
              let fontSize2 = unit.unit_mark.natural_width / 8;
              if (fontSize < fontSize2) {
                var min = fontSize;
              } else {
                var min = fontSize2;
              }
              if (min > 5) {
                unit.unit_mark.font_size = Number.parseInt(min);
              } else {
                unit.unit_mark.font_size = 5;
              }
            }
          }
        }
      })
    },
  }
</script>
