<template>
  <div class="new-project-page">
    <div class="new-project-progress">
      <div class="progress-tab" v-for="(progress, key) in progresses">
        <div class="progress-name active" :class="{'done': progress.done && progress.active}" v-if="progress.active == true" v-on:click="makeActive(key + 1)">{{key + 1}}
          <span v-if="progress.name == 'Units' && project.house_type == '2'">Lot Info</span>
          <span v-else>{{progress.name}}</span></div>
        <div class="progress-name inactive" v-if="progress.active != true">{{key + 1}}
          <span v-if="progress.name == 'Units' && project.house_type == '2'">Lot Info</span>
          <span v-else>{{progress.name}}</span></div>
        <div class="progress-arrow" v-if="progress.arrow"></div>
      </div>
    </div>
    <div class="project-page-content">
      <ProjectOverview v-bind:name="project.name" v-show="activeTab == 1"></ProjectOverview>
      <ProjectFloors v-show="activeTab == 2"></ProjectFloors>
      <ProjectUnits v-if="activeTab == 3"></ProjectUnits>
      <ProjectMap v-show="activeTab == 4"></ProjectMap>
      <ProjectGalleries v-show="activeTab == 5"></ProjectGalleries>
      <ProjectPublish v-show="activeTab == 6"></ProjectPublish>
    </div>
    <div class="project-page-controls" v-if="!loaded">
      <div class="project-page-button" :class="{invisible: activeTab == 1}" @click="goBack()">Back</div>
      <div class="project-page-warnings" v-show="activeTab == 6">
        <div class="warning-item red" v-for="warning in publishWarnings">{{warning.text}}</div>
      </div>
      <div class="project-page-subcontrols">
        <div class="project-page-button" @click="publish" v-if="this.project.published == true">Unpublish</div>
        <div class="project-page-button blue-button" v-if="checkNext()" @click="goNext">Next</div>
        <div class="project-page-button inactive-button" v-if="!checkNext() && activeTab !== 6">Next</div>
        <div class="project-page-button blue-button" @click="publish" v-if="this.publishWarnings.length === 0 && activeTab == 6 && this.project.published != true">Publish</div>
        <div class="project-page-button inactive-button" v-if="this.publishWarnings.length > 0 && activeTab == 6 && this.project.published != true">Publish</div>
      </div>
    </div>
    <div class="project-page-publish" v-if="loaded && !published">
      <div class="publish-button">
        Loading
      </div>
    </div>
  </div>
</template>

<script>
import ProjectOverview from '@/components/edit/ProjectOverview.vue'
import ProjectFloors from '@/components/edit/ProjectFloors.vue'
import ProjectUnits from '@/components/edit/ProjectUnits.vue'
import ProjectMap from '@/components/edit/ProjectMap.vue'
import ProjectGalleries from '@/components/edit/ProjectGalleries.vue'
import ProjectPublish from '@/components/edit/ProjectPublish.vue'
import constants from "../Constants";
export default {
  name: 'editproject',
  components: {
    ProjectOverview, ProjectFloors, ProjectUnits, ProjectMap, ProjectGalleries, ProjectPublish
  },
  data: ()=>({
    activeTab: 1,
    publishWarnings: [],
    tabsCount: 1,
    published: false,
    loaded: false,
    logoPreview: '',
    personalLink: '',
    units: [],
    oldProject: {},
    progresses: [
      {
        name: 'Overview',
        arrow: true,
        active: true,
        done: false,
      },
      {
        name: 'Floor Plates',
        arrow: true,
        active: true,
        done: false,
      },
      {
        name: 'Units',
        arrow: true,
        active: true,
        done: false,
      },
      {
        name: 'Maps',
        arrow: true,
        active: false,
        done: false,
      },
      {
        name: 'Galleries',
        arrow: true,
        active: false,
        done: false,
      },
      {
        name: 'Publish',
        arrow: false,
        active: false,
        done: false,
      },
    ],
    project: {
      name: '',
      logo: '',
      floors: [],
      unfloor_units: [],
      units: [],
      template: {},
      published: false,
      all_templates: [],
      lot_info: null,
      mapActivate: true,
      map: {
        address: '',
        lat: '',
        lng: '',
      },
      galleries: [],
      house_type: 1,
      markers: {
        user_markers: [],
        culture: [],
        sport: [],
        nature: [],
        restaurant: [],
      }
    },
  }),
  computed: {
    publishWarns() {
      this.publishWarnings = [];
      for(var i = 0; i < this.progresses.length; i++) {
        this.progresses[i].done = true;
      }
      let unitsFlag = true;
      if(this.project.floors != undefined) {
        for (let i = 0; i < this.project.floors.length; i++) {
          if (this.project.floors[i].units.length > 0) {
            unitsFlag = false;
          }
        }
      }
      if(this.project.house_type == 2 && this.project.lot_info != '') {
        unitsFlag = false;
      }
      if (this.progresses[1].active === true && this.project.floors.length < 1) {
        this.progresses[1].done = false;
        this.publishWarnings.push({tab: 1, text: 'Add floors to your project'})
      } else if (this.progresses[2].active === true && unitsFlag) {
        this.progresses[2].done = false;
        this.publishWarnings.push({tab: 2, text: 'Add units or lot info to your project'})
      } else if (this.progresses[4].active === true && this.project.galleries.length < 1) {
        this.progresses[4].done = false;
        this.publishWarnings.push({tab: 2, text: 'Add or disabled your gallery'})
      }
      console.log(this.project);
      if(this.publishWarnings.length > 0 && this.project.published == 1) {
        this.publish();
      }
    }
  },
  mounted() {
    let tabs = document.getElementsByClassName('progress-tab');
    tabs[this.activeTab - 1].classList.add('active');
    this.checkPublish();
  },
  methods: {
    deleteMarker(e) {
      let obj = this;
      let marker_id = e.target.getAttribute('marker-id');
      let user = JSON.parse(localStorage.getItem('maagio_user'));
      let token = localStorage.getItem('token');
      let project_id = window.location.href.split('project_id=');
      project_id = project_id[project_id.length - 1];
      let data = {
        user_id: user.uid,
        token: token,
        project_id: project_id,
        marker_id: marker_id,
      };

      $.ajax({
        url: constants.BACKEND_URL + 'marker/delete-marker',
        type: 'POST', // важно!
        data: data,
        cache: false,
        dataType: 'json',
        success: function (respond, status, jqXHR) {
          if (respond.ok === 1) {
            for (var i = 0; i < obj.project.markers.user_markers.length; i++) {
              if (obj.project.markers.user_markers[i].id == marker_id) {
                obj.project.markers.user_markers[i].setMap(null);
              }
            }
          }
        },
        // функция ошибки ответа сервера
        error: function (jqXHR, status, errorThrown) {
          console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
        }
      });
    },
    goNext(){
      if (this.activeTab == 1) {
        this.saveOverview();
      }
      let obj = this;
      let currentTab = obj.activeTab;
      for (let i = currentTab; i < obj.progresses.length; i++) {
        if (obj.progresses[i].active === true) {
          obj.activeTab = i + 1;
          obj.makeActive(obj.activeTab);
          break;
        }
      }
      this.checkPublish();
    },
    saveDraft(){
      if (this.activeTab == 1) {
        this.saveOverview();
      }
    },
    checkActive() {
      if (this.project.floors != undefined && this.project.floors.length > 0) {
        this.progresses[2].active = true;
      } else {
        this.progresses[2].active = false;
      }
    },
    saveOverview() {
      let obj = this;
      if (this.oldProject.name != this.project.name || this.oldProject.logo != this.project.logo
        || this.oldProject.house_type != this.project.house_type || this.project.template.id != this.oldProject.template.id) {
        this.loaded = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        if(this.project.id != '' && this.project.id != undefined) {
          data.append('project_id', this.project.id);
        }
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('name', this.project.name);
        data.append('logo', this.project.logo);
        data.append('house_type', this.project.house_type);
        data.append('template_id', this.project.template.id);
        $.ajax({
          url: constants.BACKEND_URL + 'project/update-overview',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          // отключаем обработку передаваемых данных, пусть передаются как есть
          processData: false,
          // отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
          contentType: false,
          // функция успешного ответа сервера
          success: function (respond, status, jqXHR) {
            obj.loaded = false;
            if (respond.ok === 1) {
              /*obj.published = true;*/
              obj.project.id = respond.project.id;
              obj.project.logo = respond.project.logo_link;
              obj.oldProject.logo = respond.project.logo_link;
              obj.project.project_logo = respond.project.project_logo;
              obj.oldProject.project_logo = respond.project.project_logo;
              obj.oldProject.name = respond.project.name;
              obj.oldProject.id = respond.project.id;
              obj.oldProject.house_type = respond.project.house_type;
              obj.oldProject.template = {};
              obj.oldProject.template.id = respond.project.template_id;
              if(respond.project.published == null) {
                obj.project.published = false;
              }

            }
            // ОК - файлы загружены
            if (typeof respond.error === 'undefined') {
              // выведем пути загруженных файлов в блок '.ajax-reply'
              var files_path = respond.files;
              var html = '';
              $.each(files_path, function (key, val) {
                html += val + '<br>';
              })

              $('.ajax-reply').html(html);
            }
            // ошибка
            else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          // функция ошибки ответа сервера
          error: function (jqXHR, status, errorThrown) {
            obj.loaded = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      } else {
        obj.loaded = false;
      }
    },
    saveUnits(){

    },
    saveMaps(){

    },
    saveGalleries(){

    },
    goBack() {
      let currentTab = this.activeTab;
      for (let i = currentTab - 1; i > 0; i--) {
        if (this.progresses[i - 1].active === true) {
          this.activeTab = i;
          this.makeActive(this.activeTab);
          break;
        }
      }
      this.checkPublish();
    },
    makeActive(e) {
      this.saveDraft();
      if(e == 6){
        let protocol = document.location.protocol;
        let host =  document.location.host;
        console.log(this.project.special_link);
        if(this.project.published == 1 && this.project.special_link != undefined) {
          this.personalLink = protocol + '//' + host+'/show/' + this.project.special_link;
        } else {
          this.personalLink = '';
        }
      }
      if (this.progresses[e - 1].active === true) {
        this.activeTab = e;
        var tabs = document.getElementsByClassName('progress-tab');
        for (var i = 0; i < tabs.length; i++) {
          tabs[i].classList.remove('active');
        }
        tabs[this.activeTab - 1].classList.add('active');
      }
      this.checkPublish();
    },
    publish(){
      let data = new FormData();
      let user = JSON.parse(localStorage.getItem('maagio_user'));
      let token = localStorage.getItem('token');
      data.append('user_id', user.uid);
      data.append('token', token);
      data.append('project_id', this.project.id);
      let obj = this;
      $.ajax({
        url: constants.BACKEND_URL + 'project/publish',
        type: 'POST', // важно!
        data: data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (respond, status, jqXHR) {
          obj.stopSave = false;
          if (respond.ok === 1) {
            obj.project.published = respond.published;
            if(obj.project.published == 1) {
              let protocol = document.location.protocol;
              let host =  document.location.host;
              obj.personalLink = protocol + '//' + host+'/show/' + respond.personal_link;
              obj.project.published = true;
            } else {
              obj.project.published = false;
              obj.personalLink = '';
              console.log(obj);
            }
          } else {
            console.log('ОШИБКА: ' + respond.data);
          }
        },
        error: function (jqXHR, status, errorThrown) {
          obj.stopSave = false;
          console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
        }
      });

    },
    checkPublish() {
      this.publishWarnings = [];
      for(var i = 0; i < this.progresses.length; i++) {
        this.progresses[i].done = true;
      }
      let unitsFlag = true;
      if(this.project.floors != undefined && this.project.house_type == 1) {
        for (let i = 0; i < this.project.floors.length; i++) {
          if (this.project.floors[i].units.length > 0) {
            unitsFlag = false;
          }
        }
      }
      if(this.project.house_type == 2 && this.project.lot_info != '' && this.project.lot_info != null) {
        unitsFlag = false;
      }
      if (this.progresses[1].active === true && this.project.floors.length < 1) {
        this.progresses[1].done = false;
        this.publishWarnings.push({tab: 1, text: 'Add floors to your project'})
      } if (unitsFlag) {
        this.progresses[2].done = false;
        this.publishWarnings.push({tab: 2, text: 'Add units or lot info to your project'})
      } if (this.progresses[4].active === true && this.project.galleries.length < 1) {
        this.progresses[4].done = false;
        this.publishWarnings.push({tab: 2, text: 'Add or disabled your gallery'})
      } if(this.project.published != true) {
        this.progresses[5].done = false;
      } else {
        this.progresses[5].done = true;
      }
      console.log( this.progresses);
      if(this.publishWarnings.length > 0 && this.project.published == 1) {
        this.publish();
      }
      console.log(this);
    },
    checkNext() {
      if (this.activeTab === 1) {
        if (this.project.name.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      if (this.activeTab === 2) {
        if (this.project.floors.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      if (this.activeTab === 3) {
        let flag = false;
        if(this.project.house_type == 1) {
          for (let i = 0; i < this.project.floors.length; i++) {
            if (this.project.floors[i].units.length > 0) {
              flag = true;
            }
          }
        } else {
          if(this.project.lot_info != null) {
            flag = true;
          }
        }

        return flag;
      }
      if (this.activeTab === 4) {
        if (!this.project.mapActivate || (this.project.mapActivate === true && this.project.map.address !== '')) {
          return true;
        } else {
          return false;
        }
      }
      if (this.activeTab === 5) {
        if (this.progresses[4].active === true && (this.project.galleries.length > 0)) {
          return true;
        } else {
          return false;
        }
      }
      if (this.activeTab === 6) {
        return false;
      }
    },
    createInfoWindowDom(info) {
      var container = document.createElement('div');
      container.classList.add('custom-marker');
      var name = document.createElement('div');
      name.classList.add('map-info-name');
      name.textContent = info.name;
      var address = document.createElement('div');
      address.classList.add('map-info-address');
      address.textContent = info.address;
      var description = document.createElement('div');
      description.classList.add('map-info-description');
      description.textContent = info.description;
      container.appendChild(name);
      container.appendChild(address);
      container.appendChild(description);
      if(info.creator == 0) {
        var button = document.createElement('div');
        button.classList.add('map-info-button');
        button.textContent = 'Delete marker';
        button.setAttribute('marker-id', info.id);
        button.addEventListener('click', this.deleteMarker);
        container.appendChild(button);
      }
      return container;
    },
    createMarker(marker){
      var icon = '';
      switch(Number.parseInt(marker.type)) {
        case 1:
          icon = constants.BACKEND_URL +'/img/Cultural.png';
          break;
        case 2:
          icon = constants.BACKEND_URL +'/img/Restaurants.png';
          break;
        case 3:
          icon = constants.BACKEND_URL +'/img/Sports.png';
          break;
        case 4:
          icon = constants.BACKEND_URL +'/img/Nature.png';
          break;
      }
      var userMarker = new google.maps.Marker({
        position: { lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) },
        map: map,
        icon: icon,
      });
      if(marker.name == null) {
        marker.name = '';
      }
      if(marker.address == null) {
        marker.address = '';
      }
      if(marker.description == null) {
        marker.description = '';
      }
      window.infowindow = new google.maps.InfoWindow();
      userMarker.addListener("click", ()=> {
        window.infowindow.setContent(this.createInfoWindowDom(marker));
        window.infowindow.open(map, userMarker);
      });
      userMarker.id = marker.id;
      return userMarker;
    },
  },
}
</script>
