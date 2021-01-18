<script src="../../prod/img/service-worker.js"></script>
<template>
    <div class="show-project" :class="{no__padding: this.$parent.activeTab == 'home'}">
        <div class="app-head" v-if="this.$parent.activeTab !== 'home'">
            <div class="app-head-name">{{project.name}}</div>
            <div class="app-head-tab" v-if="this.project.house_type == 2 && this.$parent.activeTab == 'Floor plates'">
                Lot Info</div>
            <div class="app-head-tab" v-else>
                {{this.$parent.activeTab}}</div>
            <div></div>
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
    data: ()=>({
      project: {
        galleries: [],
        project_logo: '',
        house_type: '',
        map: '',
        markers: [],
        name: '',
        floors: [],
        published: true,
        special_link: '',
        id: '',
        user_id: '',
        lot_info: {image: ''},
      },
      tabsName:[]
    }),
    methods: {
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
      },
      checkTabStatus(){
        this.$parent.tabs.home = true;
        if(this.project.floors.length > 0) {
          this.$parent.tabs.floors = true;
        }
        if(this.project.galleries.length > 0) {
          this.$parent.tabs.galleries = true;
        }
       if(this.project.house_type == 1) {
         this.$parent.tabs.units = true;
       }
        if(this.project.map != '') {
          this.$parent.tabs.map = true;
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
      let project = document.location.href.split('/');
      let data = {project: project[project.length - 1]};
      let obj = this;
      $.ajax({
        url         : constants.BACKEND_URL + 'project/show',
        type        : 'GET',
        data        : data,
        dataType    : 'json',
        success     : function( respond, status, jqXHR ){
          if(respond !== null) {
            if(respond.ok === 1) {
              console.log(this);
              for(var i = 0; i < respond.data.floors.length; i++){
                for(var n = 0; n < respond.data.floors[i].units.length; n++) {
                  if(respond.data.floors[i].units[n].unit_mark != null) {
                    respond.data.floors[i].units[n].show = true;
                    respond.data.floors[i].units[n].bedShow = true;
                    respond.data.floors[i].units[n].statusShow = true;
                    respond.data.floors[i].units[n].unit_mark.natural_width = 0;
                    respond.data.floors[i].units[n].unit_mark.natural_height = 0;
                  }
                }
              }
              console.log(respond.data);
              for(var i = 0; i < respond.data.galleries.length; i++) {
                obj.project.galleries.push(respond.data.galleries[i]);
              }
              if(respond.data.house_type == 2) {
                obj.project.lot_info = respond.data.lot_info;
              }
              obj.project.floors = respond.data.floors;
              obj.project.house_type = respond.data.house_type;
              obj.project.map = respond.data.map;
              obj.project.markers = respond.data.markers;
              obj.project.name = respond.data.name;
              obj.project.project_logo = respond.data.project_logo;
              obj.project.published = respond.data.published;
              obj.project.special_link = respond.data.special_link;
              obj.project.id = respond.data.id;
              obj.project.user_id = respond.data.user_id;
              obj.project.markers.culture = [];
              obj.project.markers.restaurant = [];
              obj.project.markers.sport = [];
              obj.project.markers.nature = [];
              obj.checkTabStatus();
              window.db.getAllValues('project', function (e) {
                var projects = e;
                if(projects.length > 20) {
                    projects.sort(function(a, b) {
                      return a.value.date - b.value.date;
                    });
                  window.db.delValue('project', projects[0].id)
                }
              });
              var proj =JSON.parse(JSON.stringify(obj.project));
              proj.date = new Date().getTime();
              window.db.setValue('project', Number.parseInt(obj.project.id), proj);
            } else {

            }
          } else {

          }

        },
        error: function( jqXHR, status, errorThrown ){
          let project_link = window.location.href.split('/');
          project_link = project_link[project_link.length - 1];
          window.db.getAllValues('project', function (e) {
            var projects = e;
            for(var i = 0; i < projects.length; i++) {
              var proj = projects[i].value;
              if(proj.special_link == project_link) {
                window.db.getValue('project', Number.parseInt(proj.id), function (e) {
                  var project_template = e.value;
                  project_template.markers.culture = [];
                  project_template.markers.restaurant = [];
                  project_template.markers.sport = [];
                  project_template.markers.nature = [];
                  for(var i = 0; i < project_template.floors.length; i++){
                    for(var n = 0; n < project_template.floors[i].units.length; n++) {
                      if(project_template.floors[i].units[n].unit_mark != null) {
                        project_template.floors[i].units[n].show = true;
                        project_template.floors[i].units[n].unit_mark.natural_width = 0;
                        project_template.floors[i].units[n].unit_mark.natural_height = 0;
                      }
                    }
                  }
                  obj.project = project_template;
                  obj.checkTabStatus();
                })
              }
            }
          });
        }
      });
    },
  }
</script>
