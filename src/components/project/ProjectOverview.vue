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
                    <input type="checkbox" v-on:change="changeMap()" v-model="showMap" id="show-map"
                           style="display: none">
                </div>
                <div class="overview-checkbox" :class="{active: showGallery}">
                    <label for="show-gallery">
                        <div class="overview-checkbox-mask">
                            <div class="overview-checkbox-icon"></div>
                        </div>
                        Galleries</label>
                    <input type="checkbox" v-on:change="changeGallery()" v-model="showGallery" id="show-gallery"
                           style="display: none">
                </div>
            </div>
        </div>
        <div class="overview-container">
            <div class="overview-header">
                PROJECT TITLE *
            </div>
            <div class="overview-description">This is the name that the user will see in the app.</div>
            <input class="overview-input" :class="{warning: projectName.length < 1}" type="text" v-model="projectName"
                   @keyup="enterName()">
            <div class="overview-logo">
                <div class="overview-header">
                    PROJECT LOGO
                </div>
                <div class="overview-description">The graphics will appear on the splash screen</div>
                <div class="logo-preview"><img v-if="this.$parent.logoPreview != ''" :src="this.$parent.logoPreview" alt=""></div>
                <div class="logo-upload" v-on:click="openPhotoUpload()">Click to upload</div>
                <input type="file" v-on:change="renderPreview" id="overview-logo" style="display: none"
                       accept="image/png, image/jpeg">
            </div>
        </div>
    </div>
</template>

<script>
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
      openPhotoUpload() {
        var container = document.getElementById('overview-logo');
        container.click();
      },
      renderPreview: function (e) {
        let reader  = new FileReader();
        reader.addEventListener("load", function () {
          this.$parent.logoPreview = reader.result;
          this.$parent.project.logo = e.target.files[0];
        }.bind(this), false);
        if( e.target.files[0] ){
          if ( /\.(jpe?g|png)$/i.test( e.target.files[0].name ) ) {
            reader.readAsDataURL( e.target.files[0] );
          }
        }
      },
      enterName() {
        this.$parent.project.name = this.projectName;
        if (this.projectName.length > 0) {
          this.$parent.progresses[5].active = true;
        } else {
          this.$parent.progresses[5].active = false;
        }
        if (this.projectName.length > 0) {
          this.$parent.progresses[1].active = true;
          if (this.$parent.project.floors.length > 0) {
            this.$parent.progresses[2].active = true;
          }
        } else {
          this.$parent.progresses[1].active = false;
          this.$parent.progresses[2].active = false;
        }
        if (this.showMap === true && this.projectName.length > 0) {
          this.$parent.progresses[3].active = true;
        } else {
          this.$parent.progresses[3].active = false;
        }
        if (this.showGallery === true && this.projectName.length > 0) {
          this.$parent.progresses[4].active = true;
        } else {
          this.$parent.progresses[4].active = false;
        }
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
      changeMap() {
        this.$parent.project.map = {lat: '', lng: '', address: ''};
        if (this.showMap === true && this.projectName.length > 0) {
          this.$parent.progresses[3].active = true;
        } else {
          this.$parent.progresses[3].active = false;
        }
      },
      changeGallery() {
        this.$parent.project.galleries = [];
        if (this.showGallery === true && this.projectName.length > 0) {
          this.$parent.progresses[4].active = true;
        } else {
          this.$parent.progresses[4].active = false;
        }
      },
    },
  }
</script>