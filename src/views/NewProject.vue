<template>
    <div class="new-project-page">
        <div class="new-project-progress">
            <div class="progress-tab" v-for="(progress, key) in progresses">
                <div class="progress-name active" v-if="progress.active == true && published !== true" v-on:click="makeActive(key + 1)">{{key + 1}} {{progress.name}}</div>
                <div class="progress-name inactive" v-if="progress.active != true || published === true">{{key + 1}} {{progress.name}}</div>
                <div class="progress-arrow" v-if="progress.arrow"></div>
            </div>
        </div>
        <div class="project-page-content">
            <ProjectOverview v-bind:name="project.name" v-show="activeTab == 1"></ProjectOverview>
            <ProjectFloors v-show="activeTab == 2"></ProjectFloors>
            <ProjectUnits v-show="activeTab == 3"></ProjectUnits>
            <ProjectMap v-show="activeTab == 4"></ProjectMap>
            <ProjectGalleries v-show="activeTab == 5"></ProjectGalleries>
            <ProjectPublish v-show="activeTab == 6"></ProjectPublish>
        </div>
        <div class="project-page-controls" v-if="!published && !loaded">
            <div class="project-page-button" :class="{invisible: activeTab == 1}" @click="goBack()">Back</div>
            <div class="project-page-subcontrols">
                <div class="project-page-button" @click="publish" v-if="project.published == 1">Unpublish</div>
                <div class="project-page-button blue-button" v-if="checkNext()" @click="goNext">Next</div>
                <div class="project-page-button inactive-button" v-if="!checkNext() && activeTab !== 6">Next</div>
                <div class="project-page-button blue-button" @click="publish" v-if="checkPublish()">Publish</div>
                <div class="project-page-button inactive-button" v-if="!checkPublish() && activeTab === 6">Publish</div>
            </div>
        </div>
        <div class="project-page-publish" v-if="published">
            <div class="publish-button">
                <span class="publish-icon"></span>
                Published
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
    name: 'newproject',
    components: {
      ProjectOverview, ProjectFloors, ProjectUnits, ProjectMap, ProjectGalleries, ProjectPublish
    },
    data: ()=>({
      activeTab: 1,
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
        },
        {
          name: 'Floor Plates',
          arrow: true,
          active: true,
        },
        {
          name: 'Units',
          arrow: true,
          active: false,
        },
        {
          name: 'Maps',
          arrow: true,
          active: false,
        },
        {
          name: 'Galleries',
          arrow: true,
          active: false,
        },
        {
          name: 'Publish',
          arrow: false,
          active: false,
        },
      ],
      project: {
        name: '',
        logo: '',
        floors: [],
        unfloor_units: [],
        units: [],
        mapActivate: true,
        house_type: 1,
        map: {
          address: '',
          lat: '',
          lng: '',
        },
        galleries: [],
        markers: {
          user_markers: [],
          culture: [],
          sport: [],
          nature: [],
          restaurant: [],
        },
      },
    }),
    mounted() {
      let tabs = document.getElementsByClassName('progress-tab');
      tabs[this.activeTab - 1].classList.add('active');
      this.checkActive();

    },
    methods: {
      goNext(){
        let obj = this;
        let currentTab = obj.activeTab;
        for (let i = currentTab; i < obj.progresses.length; i++) {
          if (obj.progresses[i].active === true) {
            if(obj.activeTab == 1) {
              this.saveOverview();
            }
            obj.activeTab = i + 1;

            obj.makeActive(obj.activeTab);
            break;
          }
        }
      },
      saveDraft(){
        if (this.activeTab == 1) {
          this.saveOverview();
        }
      },
      saveOverview() {
        let obj = this;
        if (this.oldProject.name != this.project.name || this.oldProject.logo != this.project.logo) {
          this.loaded = true;
          let data = new FormData();
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          data.append('user_id', user.uid);
          data.append('token', token);
          if(this.project.id != null) {
            data.append('project_id', this.project.id);
          }
          data.append('name', this.project.name);
          data.append('logo', this.project.logo);
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
                obj.project.logo = respond.project_logo;
                obj.oldProject = JSON.parse(JSON.stringify(obj.project))
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
      },
      makeActive(e) {
        this.saveDraft();
        if (this.published === true) {
          return false;
        }
        if(e == 6){
          let protocol = document.location.protocol;
          let host =  document.location.host;
          if(this.project.special_link != undefined) {
            this.personalLink = protocol + '//' + host+'/#/show?project=' + this.project.special_link;
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
                obj.personalLink = protocol + '//' + host+'/#/show?project=' + respond.personal_link;
                obj.published = true;
              } else {
                obj.published = false;
                obj.personalLink = '';
              }
              console.log(obj);
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
      checkActive() {
        if (this.project.floors != undefined && this.project.floors.length > 0) {
          this.progresses[2].active = true;
        } else {
          this.progresses[2].active = false;
        }
      },
      checkPublish() {
        if (this.published === true) {
          return false;
        }
        let unitsFlag = true;
        if(this.project.floors != undefined) {
          for (let i = 0; i < this.project.floors.length; i++) {
            if (this.project.floors[i].units.length > 0) {
              unitsFlag = false;
            }
          }
        }

        if (this.activeTab === 6) {
          if ((this.progresses[1].active === true && this.project.floors.length < 1) ||
            (this.progresses[2].active === true && unitsFlag) ||
            (this.progresses[3].active === true && (!this.project.map.lat || !this.project.map.lng)) ||
            (this.progresses[4].active === true && this.project.galleries.length < 1)) {
            return false;
          }
          return true;
        } else {
          return false;
        }
      },
      checkNext() {
        if (this.published === true) {
          return false;
        }
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
          for (let i = 0; i < this.project.floors.length; i++) {
            if (this.project.floors[i].units.length > 0) {
              flag = true;
            }
          }
          return flag;
        }
        if (this.activeTab === 4) {
          if (!this.project.mapActivate || (this.project.mapActivate === true && this.project.map !== '')) {
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
        if(info.creator == 0) {
          var button = document.createElement('div');
          button.classList.add('map-info-button');
          button.textContent = 'Delete marker';
          button.setAttribute('marker-id', info.id);
          button.addEventListener('click', this.deleteMarker);
          container.appendChild(button);
        }
        container.appendChild(name);
        container.appendChild(address);
        container.appendChild(description);

        return container;
      },
      createMarker(marker){
        var userMarker = new google.maps.Marker({
          position: { lat: parseFloat(marker.lat), lng: parseFloat(marker.lng) },
          map: map,
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
        let infowindow = new google.maps.InfoWindow();
        userMarker.addListener("click", ()=> {
          infowindow.setContent(this.createInfoWindowDom(marker));
          infowindow.open(map, userMarker);
        });
        userMarker.id = marker.id;
        return userMarker;
      },
    },
  }
</script>
