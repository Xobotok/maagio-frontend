<template>
    <div class="new-project-page">
        <div class="new-project-progress">
            <div class="progress-tab" v-for="(progress, key) in progresses"
                 :class="{inactive: progress.active != true}">
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
        </div>
        <div class="project-page-controls" v-if="!published">
            <div class="project-page-button" :class="{invisible: activeTab == 1}" @click="activeTab--; makeActive(activeTab);">Back</div>
            <div class="project-page-subcontrols">
                <div class="project-page-button">Save Draft</div>
                <div class="project-page-button blue-button" v-if="checkNext()" @click="activeTab++; makeActive(activeTab);">Next</div>
                <div class="project-page-button inactive-button" v-if="!checkNext()">Next</div>
                <div class="project-page-button blue-button" @click="publish" v-if="checkPublish()">Publish</div>
            </div>
        </div>
        <div class="project-page-publish" v-if="published">
            <div class="publish-button">
                <span class="publish-icon"></span>
                Published
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
  import constants from '../Constants'
  export default {
    name: 'newproject',
    components: {
      ProjectOverview, ProjectFloors, ProjectUnits, ProjectMap, ProjectGalleries
    },
    mounted() {
      var tabs = document.getElementsByClassName('progress-tab');
      tabs[this.activeTab - 1].classList.add('active');
      this.checkActive();
    },
    methods: {
      makeActive(e) {
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
      checkActive() {
        if(this.project.floors.length > 0) {
          this.progresses[2].active = true;
        } else {
          this.progresses[2].active = false;
        }
      },
      checkPublish() {
        if(this.activeTab === 6) {
          return true;
        } else {
          return false;
        }
      },
      uploadFiles() {
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
          if(this.project.units.length > 0) {
            return true;
          } else {
            return false;
          }
        }
        if(this.activeTab === 4) {
          if(!this.project.mapActivate || (this.project.mapActivate === true && this.project.map !== '')) {
            return true;
          } else {
            return false;
          }
        }
      },
    },
    data: ()=>({
      activeTab: 1,
      tabsCount: 1,
      published: false,
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
        name: 'Васян',
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
