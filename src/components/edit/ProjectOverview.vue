<template>
    <div class="project-overview">
        <div class="overview-container">
            <div class="overview-header">
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
  export default {
    'name': 'ProjectOverview',
    data: ()=>({
      projectName: '',
      projectLogo: '',
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
            window.db.setValue('project', Number.parseInt(respond.data.id), JSON.stringify(respond.data));
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
          window.db.getValue('project', Number.parseInt(project_id), function (e) {
            obj.$parent.project = JSON.parse(e.value);
            obj.$parent.oldProject = JSON.parse(e.value);
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
          });
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
      this.changeMap();
      this.changeGallery();
    },
    methods: {
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
        for(var i = 0; i < this.$parent.project.markers.culture.length; i++) {
          this.$parent.project.markers.culture[i] = this.$parent.createMarker(this.$parent.project.markers.culture[i]);
        }
        for(var i = 0; i < this.$parent.project.markers.sport.length; i++) {
          this.$parent.project.markers.sport[i] = this.$parent.createMarker(this.$parent.project.markers.sport[i]);
        }
        for(var i = 0; i < this.$parent.project.markers.nature.length; i++) {
          this.$parent.project.markers.nature[i] = this.$parent.createMarker(this.$parent.project.markers.nature[i]);
        }
        for(var i = 0; i < this.$parent.project.markers.restaurant.length; i++) {
          this.$parent.project.markers.restaurant[i] = this.$parent.createMarker(this.$parent.project.markers.restaurant[i]);
        }
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