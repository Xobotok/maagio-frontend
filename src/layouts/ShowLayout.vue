<template>
    <div class="app-show-layout" :class="project.template.template_class">
        <main class="app-content">
            <div class="app-page">
                <div class="hidden-menu" id="brown-hidden-menu" v-if="activeTab != 'home'">
                    <div class="app-head-name"><span class="close-menu" @click="closeMenu">+</span><span class="project-name">{{project.name}}</span></div>
                    <div class="show-nav-tab" @click="activeTab = 'home'"> <div class="home-icon"></div><span class="home-text">Home</span></div>
                    <!--<div class="show-nav-tab"> <div class="welcome-icon"></div></div>-->
                    <div class="show-nav-tab" v-if="tabs.floors === true" @click="openFloors" :class="{active: activeTab === 'Floor plates'}"><div class="floor-icon"></div><span class="home-text">Floor plates</span></div>
                    <div class="show-nav-tab inactive" v-if="tabs.floors !== true"> <svg class="floor-icon"></svg><span class="home-text">Floor plates</span></div>
                    <div class="show-nav-tab" v-if="tabs.units === true" @click="activeTab = 'Units'" :class="{active: activeTab === 'Units'}"><div class="floor-icon reverse"></div><span class="home-text">Units</span></div>
                    <div class="show-nav-tab" v-if="tabs.galleries === true" @click="activeTab = 'Gallery'" :class="{active: activeTab === 'Gallery'}"> <div class="image-icon"></div><span class="home-text">Gallery</span></div>
                    <div class="show-nav-tab inactive" v-if="tabs.galleries !== true"> <div class="image-icon"></div><span class="home-text">Gallery</span></div>
                    <div class="show-nav-tab" v-if="tabs.map === true" @click="activeTab = 'Contact'" :class="{active: activeTab === 'Contact'}"> <div class="map-icon"></div><span class="home-text">Address</span></div>
                    <div class="show-nav-tab inactive" v-if="tabs.map !== true"> <div class="map-icon"></div><span class="home-text">Address</span></div>
                </div>
                <div class="show-nav" v-if="activeTab != 'home'">
                    <div class="show-nav-tab" @click="activeTab = 'home'"> <div class="home-icon"></div></div>
                    <!--<div class="show-nav-tab"> <div class="welcome-icon"></div></div>-->
                    <div class="show-nav-tab" v-if="tabs.floors === true" @click="openFloors" :class="{active: activeTab === 'Floor plates'}"> <div class="floor-icon"></div></div>
                    <div class="show-nav-tab inactive" v-if="tabs.floors !== true"> <div class="floor-icon"></div></div>
                    <div class="show-nav-tab" v-if="tabs.units === true" @click="activeTab = 'Units'" :class="{active: activeTab === 'Units'}"> <div class="floor-icon reverse"></div></div>
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
  import constants from '../Constants';
  export default {
    name: 'show-layout',
    data: ()=>({
      project: {
        galleries: [],
        project_logo: '',
        house_type: '',
        map: '',
        markers: [],
        template: {},
        name: '',
        floors: [],
        published: true,
        special_link: '',
        id: '',
        user_id: '',
        lot_info: {image: ''},
      },
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
              obj.project.template = respond.data.template;
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
    methods: {
      closeMenu(e) {
        console.log(e);
        e.target.parentNode.parentNode.style.left = '-33%';
      },
      checkTabStatus(){
        this.tabs.home = true;
        if(this.project.floors.length > 0) {
          this.tabs.floors = true;
        }
        if(this.project.galleries.length > 0) {
          this.tabs.galleries = true;
        }
        if(this.project.house_type == 1) {
          this.tabs.units = true;
        }
        if(this.project.map != '') {
          this.tabs.map = true;
        }
      },
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
