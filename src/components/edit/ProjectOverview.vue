<template>
    <div class="project-overview">
        <div class="overview-container">
            <div class="overview-header">
                PLEASE CHECK THE CATEGORIES
                YOU WANT TO SHOW
            </div>
            <div class="overview-checkboxes">
                <div class="overview-checkbox" :class="{active: showUnits}">
                    <label for="show-units">
                        <div class="overview-checkbox-mask">
                            <div class="overview-checkbox-icon"></div>
                        </div>
                        Floor Plates and Units</label>
                    <input type="checkbox" v-on:change="changeUnits" v-model="showUnits" id="show-units"
                           style="display: none">
                </div>
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
        </div>
        <div class="overview-container">
            <div class="overview-header">
                PROJECT TITLE *
            </div>
            <div class="overview-description">This is the name that the user will see in the app.</div>
            <input class="overview-input" :class="{warning: this.$parent.project.name.length < 1}" type="text" v-model="$parent.project.name"
                   @keyup="enterName()">
            <div class="overview-logo">
                <div class="overview-header">
                    PROJECT LOGO
                </div>
                <div class="overview-description">The graphics will appear on the splash screen</div>
                <div class="logo-preview"><img :src="this.$parent.logoPreview" alt=""></div>
                <div class="logo-upload" v-on:click="openPhotoUpload()">Click to upload</div>
                <input type="file" v-on:change="renderPreview" id="overview-logo" style="display: none"
                       accept="image/png, image/jpeg">
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants'
  export default {
    'name': 'ProjectOverview',
    data: ()=>({
      projectName: '',
      projectLogo: '',
      showUnits: true,
      showMap: true,
      showGallery: true,
      logoPreview: '',
    }),
    mounted() {
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
            obj.$parent.oldProject = JSON.parse(JSON.stringify(obj.$parent.project));
            if(obj.$parent.project.floors.length === 0) {
             obj.showUnits = false;
            }
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
      loadMap(){
        let lat = this.$parent.project.map.lat;
        let lng = this.$parent.project.map.lng;
        window.map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: lat, lng: lng },
          zoom: 18,
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });
        var marker = new google.maps.Marker({
          position: {lat: lat, lng: lng},
          map: map,
        });
        this.mapMarker = {lat: lat, lng: lng};
        this.$parent.project.map = {lat: lat, lng: lng};
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
        if (this.showUnits === true && this.$parent.project.name.length > 0) {
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
      },
      changeUnits() {
        if(this.showUnits === false) {
          this.$parent.oldFloors = JSON.parse(JSON.stringify(this.$parent.project.floors));
        }
        this.$parent.project.floors = [];
        if(this.showUnits === true && this.$parent.oldFloors != undefined) {
          this.$parent.project.floors = JSON.parse(JSON.stringify(this.$parent.oldFloors));
        }
        if (this.showUnits === true && this.$parent.project.name.length > 0) {
          this.$parent.progresses[1].active = true;
          if (this.$parent.project.floors.length > 0) {
            this.$parent.progresses[2].active = true;
          }
        } else {
          this.$parent.progresses[1].active = false;
          this.$parent.progresses[2].active = false;
        }
      },
      changeMap() {
        this.$parent.project.map = '';
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