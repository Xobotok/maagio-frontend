<template>
    <div class="project-overview">
        <div class="overview-container">
            <div class="overview-header">
                PLEASE SELECT THEME FOR YOUR PROJECT
            </div>
            <div class="overview-checkboxes">
                <dropdown v-if="$parent.project.template.id != undefined"
                          :options="$parent.project.all_templates"
                          :selected="{val: $parent.project.template.id, name: $parent.project.template.name}"
                          v-on:updateOption="selectNewTemplate"
                          :placeholder="'Select theme'"
                          :closeOnOutsideClick="true"></dropdown>
            </div>
            <div class="overview-header" style="margin-top: 30px;">
                PLEASE CHECK THE CATEGORIES
                YOU WANT TO SHOW
            </div>
            <div class="overview-checkboxes">
                <div class="overview-checkbox" :class="{active: showMap}">
                    <label for="show-map">
                        <div class="overview-checkbox-mask">
                            <div class="overview-checkbox-icon"></div>
                        </div>
                        Neighborhood Maps</label>
                    <input type="checkbox" v-on:change="changeMap" v-model="showMap" id="show-map"
                           style="display: none">
                </div>
                <div class="overview-checkbox" :class="{active: showGallery}">
                    <label for="show-gallery">
                        <div class="overview-checkbox-mask">
                            <div class="overview-checkbox-icon"></div>
                        </div>
                        Galleries</label>
                    <input type="checkbox" v-on:change="changeGallery" v-model="showGallery" id="show-gallery"
                           style="display: none">
                </div>
            </div>
            <div class="overview-header" style="margin-top: 30px">
                PLEASE CHECK YOUR PROJECT TYPE
            </div>
            <form action="">
                <div class="overview-checkboxes">
                    <div class="overview-checkbox" :class="{active: $parent.project.house_type == 1}">
                        <label for="projectType1">
                            <div class="overview-checkbox-mask radio-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Apartments</label>
                        <input type="radio" name="projectType" value="1" id="projectType1" v-model="$parent.project.house_type"
                               style="display: none">
                    </div>
                    <div class="overview-checkbox" :class="{active: $parent.project.house_type == 2}">
                        <label for="projectType2">
                            <div class="overview-checkbox-mask radio-mask">
                                <div class="overview-checkbox-icon"></div>
                            </div>
                            Single family house</label>
                        <input type="radio" name="projectType" value="2" id="projectType2"
                               v-model="$parent.project.house_type"
                               style="display: none">
                    </div>
                </div>
            </form>
        </div>
        <div class="overview-container">
            <div class="overview-header">
                PROJECT TITLE *
            </div>
            <div class="overview-description">This is the name that the user will see in the app.</div>
            <input class="overview-input" :class="{warning: this.$parent.project.name.length < 1}" type="text" v-model="projectName"
                   @keyup="enterName()">
            <div class="overview-logo">
                <div class="overview-header">
                    PROJECT LOGO
                </div>
                <div class="overview-description">The graphics will appear on the splash screen</div>
                <div class="logo-preview"><img v-if="this.$parent.logoPreview != '' && this.$parent.logoPreview != 'unknown'" :src="this.$parent.logoPreview" alt=""></div>
                <div class="logo-upload" v-on:click="openPhotoUpload()">Click to upload</div>
                <input type="file" v-on:change="renderPreview" id="overview-logo" style="display: none"
                       accept="image/png, image/jpeg">
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants'
  import MarkerClusterer from "@googlemaps/markerclustererplus/dist/index.esm";
  import dropdown from '@/components/simple/dropdown.vue'

  export default {
    'name': 'ProjectOverview',
    components: {
      dropdown,
    },
    data: ()=>({
      projectName: '',
      projectLogo: '',
      showMap: true,
      showGallery: true,
      logoPreview: '',
    }),
    watch: {
      projectName: function (val) {
        this.projectName = window.VueHelper.stableInput(val);
        this.$parent.project.name = this.projectName;
      },
    },
    mounted() {
      var href = window.location.href;
      href = href.split('/');
      href = href[href.length - 1];
      if(href != 'new') {
        this.takeProject();
      } else {
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'template/take-templates',
          type: 'GET', // важно!
          cache: false,
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            if (respond.ok === 1) {
              if(obj.$parent.project.template.id == undefined) {
                obj.$parent.project.template = respond.templates[0];
              }
              obj.$parent.project.all_templates = respond.templates;
            }
          },
          // функция ошибки ответа сервера
          error: function (jqXHR, status, errorThrown) {
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      }
      this.projectName = this.$parent.project.name;
      this.projectLogo = this.$parent.project.logo;
      if (this.projectName.length > 0) {
        this.$parent.progresses[5].active = true;
      } else {
        this.$parent.progresses[5].active = false;
      }
      this.changeUnits();
      this.changeMap();
      this.changeGallery();
    },
    methods: {
      selectNewTemplate(e) {
        this.$parent.project.template = e;
      },
      changeUnits() {
        this.$parent.project.floors = [];
        if (this.projectName.length > 0) {
          this.$parent.progresses[1].active = true;
          if (this.$parent.project.floors.length > 0) {
            this.$parent.progresses[2].active = true;
          }
        } else {
          this.$parent.progresses[1].active = false;
          this.$parent.progresses[2].active = false;
        }
      },
      takeProject(){
        let obj = this;
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        let project_id  = window.location.href.split('project_id=');
        project_id = project_id[project_id.length - 1];
        let data = {
          user_id: user.uid,
          token: token,
          project_id: project_id,
        };

        $.ajax({
          url         : constants.BACKEND_URL + 'project/take',
          type        : 'GET', // важно!
          data        : data,
          cache       : false,
          dataType    : 'json',
          success     : function( respond, status, jqXHR ){
            if(respond.ok === 1) {
              obj.$parent.project = respond.data;
              obj.projectName = obj.$parent.project.name;
              obj.$parent.oldProject = JSON.parse(JSON.stringify(obj.$parent.project));
              if(!obj.$parent.project.map || obj.$parent.project.map == '') {
                obj.showMap = false;
              }
              if(obj.$parent.project.galleries.length === 0) {
                obj.showGallery = false;
              }
              if(obj.$parent.project.logo != null) {
                obj.$parent.logoPreview = obj.$parent.project.logo;
              }
              obj.enterName();
              obj.loadMap();
              obj.$parent.checkPublish();
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
            let project_id  = window.location.href.split('project_id=');
            project_id = project_id[project_id.length - 1];
            console.log( 'ОШИБКА AJAX запроса: ' + status, jqXHR );
          }
        });
      },
      loadMap(){
        if(this.$parent.project.map.lng != undefined && this.$parent.project.map.lat != undefined) {
          var center = new google.maps.LatLng(this.$parent.project.map.lat, this.$parent.project.map.lng);
          window.map.panTo(center);
          var marker = new google.maps.Marker({
            position: {lat: this.$parent.project.map.lat, lng: this.$parent.project.map.lng},
            map: window.map,
            icon: constants.BACKEND_URL + '/img/Home.png'
          });
          this.$parent.project.map.marker = marker;
        }
        for(var i = 0; i < this.$parent.project.markers.user_markers.length; i++) {
          this.$parent.project.markers.user_markers[i] = this.$parent.createMarker(this.$parent.project.markers.user_markers[i]);
        }
        new MarkerClusterer(window.map, this.$parent.project.markers.user_markers, {
          imagePath:
            "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
      },
      openPhotoUpload() {
        var container = document.getElementById('overview-logo');
        container.click();
      },
      renderPreview: function (e) {
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
          this.$parent.logoPreview = reader.result;
          this.$parent.project.logo = e.target.files[0];
          this.$parent.project.project_logo = '';
        }.bind(this), false);
        if( e.target.files[0] ){
          if ( /\.(jpe?g|png)$/i.test( e.target.files[0].name ) ) {
            reader.readAsDataURL( e.target.files[0] );
          }
        }
      },
      enterName() {
        if (this.$parent.project.name.length > 0) {
          this.$parent.progresses[5].active = true;
        } else {
          this.$parent.progresses[5].active = false;
        }
        if (this.$parent.project.name.length > 0) {
          this.$parent.progresses[1].active = true;
          if (this.$parent.project.floors.length > 0) {
            this.$parent.progresses[2].active = true;
          }
        } else {
          this.$parent.progresses[1].active = false;
          this.$parent.progresses[2].active = false;
        }
        if (this.showMap === true && this.$parent.project.name.length > 0) {
          this.$parent.progresses[3].active = true;
        } else {
          this.$parent.progresses[3].active = false;
        }
        if (this.showGallery === true && this.$parent.project.name.length > 0) {
          this.$parent.progresses[4].active = true;
        } else {
          this.$parent.progresses[4].active = false;
        }
        this.$parent.checkPublish()
      },
      changeMap() {
        this.$parent.project.map = {lat: '', lng: '', address: ''};
        if (this.showMap === true && this.$parent.project.name.length > 0) {
          this.$parent.progresses[3].active = true;
        } else {
          this.$parent.progresses[3].active = false;
        }
      },
      changeGallery() {
        if(this.showGallery === false) {
          this.$parent.oldGalleries = JSON.parse(JSON.stringify(this.$parent.project.galleries));
        }
        this.$parent.project.galleries = [];
        if(this.showGallery === true && this.$parent.oldGalleries != undefined) {
          this.$parent.project.galleries = JSON.parse(JSON.stringify(this.$parent.oldGalleries));
        }
        if (this.showGallery === true && this.$parent.project.name.length > 0) {
          this.$parent.progresses[4].active = true;
        } else {
          this.$parent.progresses[4].active = false;
        }
      },
    },
  }
</script>
