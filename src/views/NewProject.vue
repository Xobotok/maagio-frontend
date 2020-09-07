<template>
    <div class="new-project-page">
        <div class="new-project-progress">
            <div class="progress-tab" v-for="(progress, key) in progresses"
                 :class="{inactive: progress.active != true || published === true}">
                <div class="progress-name" v-on:click="makeActive(key + 1)">{{key + 1}} {{progress.name}}</div>
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
                <div class="project-page-button">Save Draft</div>
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
  import ProjectOverview from '@/components/project/ProjectOverview.vue'
  import ProjectFloors from '@/components/project/ProjectFloors.vue'
  import ProjectUnits from '@/components/project/ProjectUnits.vue'
  import ProjectMap from '@/components/project/ProjectMap.vue'
  import ProjectGalleries from '@/components/project/ProjectGalleries.vue'
  import ProjectPublish from '@/components/project/ProjectPublish.vue'
  import constants from '../Constants'
  export default {
    name: 'newproject',
    components: {
      ProjectOverview, ProjectFloors, ProjectUnits, ProjectMap, ProjectGalleries, ProjectPublish
    },
    mounted() {
      let tabs = document.getElementsByClassName('progress-tab');
      tabs[this.activeTab - 1].classList.add('active');
      this.checkActive();
    },
    methods: {
      goNext(){
        let currentTab = this.activeTab;
        for(let i = currentTab; i < this.progresses.length; i++) {
          if(this.progresses[i].active === true) {
            this.activeTab = i + 1;
            this.makeActive(this.activeTab);
            break;
          }
        }
      },
      goBack() {
        let currentTab = this.activeTab;
        for(let i = currentTab - 1; i > 0; i--) {
          if(this.progresses[i - 1].active === true) {
            this.activeTab = i;
            this.makeActive(this.activeTab);
            break;
          }
        }
      },
      makeActive(e) {
        if(this.published === true) {
          return false;
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
        this.uploadFiles();

      },
      saveDraft() {

      },
      checkActive() {
        if(this.project.floors.length > 0) {
          this.progresses[2].active = true;
        } else {
          this.progresses[2].active = false;
        }
      },
      checkPublish() {
        if(this.published === true) {
          return false;
        }
        let unitsFlag = true;
        for (let i = 0; i < this.project.floors.length; i++) {
          if(this.project.floors[i].units.length > 0) {
            unitsFlag = false;
          }
        }
        if(this.activeTab === 6) {
          if((this.progresses[1].active === true && this.project.floors.length < 1) ||
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
      uploadFiles() {
        this.loaded = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        for(let i = 0; i < this.project.floors.length; i++) {
          if(this.project.floors[i].image !== '') {
            data.append( 'floor-'+i, this.project.floors[i].image );
          }
        }
        for(let i = 0; i < this.project.galleries.length; i++) {
          for(let n = 0; n < this.project.galleries[i].photos.length; n++) {
            data.append( 'gallery-'+i + '_photo-' + n, this.project.galleries[i].photos[n] );
          }

        }
        data.append('my_file_upload', 1);
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('project', JSON.stringify(this.project));
        data.append('logo', this.project.logo);
        let obj = this;
        $.ajax({
          url         : constants.BACKEND_URL + 'project/save-new-project',
          type        : 'POST', // важно!
          data        : data,
          cache       : false,
          dataType    : 'json',
          // отключаем обработку передаваемых данных, пусть передаются как есть
          processData : false,
          // отключаем установку заголовка типа запроса. Так jQuery скажет серверу что это строковой запрос
          contentType : false,
          // функция успешного ответа сервера
          success     : function( respond, status, jqXHR ){
            console.log(obj);
            if(respond.ok === 1) {
              obj.published = true;
                $('#personal-link').text(document.location.protocol +'//' + document.location.host +'/#/show?project=' + respond.project_link);
            }
            // ОК - файлы загружены
            if( typeof respond.error === 'undefined' ){
              // выведем пути загруженных файлов в блок '.ajax-reply'
              var files_path = respond.files;
              var html = '';
              $.each( files_path, function( key, val ){
                html += val +'<br>';
              } )

              $('.ajax-reply').html( html );
            }
            // ошибка
            else {
              console.log('ОШИБКА: ' + respond.data );
            }
          },
          // функция ошибки ответа сервера
          error: function( jqXHR, status, errorThrown ){
            console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
          }
        });
      },

      checkNext() {
        if(this.published === true) {
          return false;
        }
        if(this.activeTab === 1) {
          if(this.project.name.length > 0) {
            return true;
          } else {
            return false;
          }
        }
        if(this.activeTab === 2) {
            if(this.project.floors.length > 0) {
              return true;
            } else {
              return false;
            }
        }
        if(this.activeTab === 3) {
          let flag = false;
          for(let i = 0; i < this.project.floors.length; i++) {
            if(this.project.floors[i].units.length > 0) {
              flag = true;
            }
          }
          return flag;
        }
        if(this.activeTab === 4) {
          if(!this.project.mapActivate || (this.project.mapActivate === true && this.project.map !== '')) {
            return true;
          } else {
            return false;
          }
        }
        if(this.activeTab === 5) {
          if(this.progresses[4].active === true && (this.project.galleries.length > 0)) {
            return true;
          } else {
            return false;
          }
        }
        if(this.activeTab === 6) {
          return false;
        }
      },
    },
    data: ()=>({
      activeTab: 1,
      tabsCount: 1,
      published: false,
      loaded: false,
      logoPreview: '',
      personalLink: '',
      progresses: [
        {
          name: 'Overview',
          arrow: true,
          active: true,
        },
        {
          name: 'Floor Plates',
          arrow: true,
          active: false,
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
        units: [],
        mapActivate: true,
        map: '',
        galleries: [],
      },
    }),
  }
</script>
