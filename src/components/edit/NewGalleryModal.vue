<template>
    <div class="fullscreen-modal">
        <div class="new-gallery">
            <div class="unit-create-header">Album Info</div>
            <div class="gallery-create">
                <div class="gallery-name">
                    <div class="gallery-header">
                        <span>Name*</span>
                        <span style="color: red; display: block; font-size: 12px;" v-if="!checkName()">Name already exist. Choose another name</span>
                    </div>
                    <div class=""><input type="text" class="project-input" v-model="gallery.name">
                    </div>
                </div>
                <div class="photos-container">
                    <div class="gallery-header"><span>Photos</span> Please add at least one photo.</div>
                    <div class="gallery-photos">
                        <div class="gallery-photo" v-for="preview in gallery.previews">
                            <img :src="preview.image_link" alt="">
                            <div class="photo-controls">
                                <div class="photo-controls-button">REPLACE</div>
                                <div class="photo-controls-button" @click="removePreview(preview)">REMOVE</div>
                            </div>
                        </div>
                        <div class="empty-floor" onclick="document.getElementById('image').click()"><div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div></div>
                        <form id="upload-image" enctype="multipart/form-data">
                            <div class="form-group">
                                <input type="file" name="image" @change="uploadImage" style="display: none" multiple accept="image/png, image/jpeg" id="image">
                            </div>
                            <input type="submit" style="display: none" class="btn btn-default">
                        </form>
                    </div>
                </div>
            </div>
            <div class="unit-create-controls">
                <div class="project-page-button blue-button" @click="saveGallery" v-if="checkSave() && stopSave == false">Save</div>
                <div class="project-page-button inactive-button" v-if="!checkSave() || stopSave == true">Save</div>
                <div class="project-page-button" @click="cancel">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants';
  export default {
    name: 'NewGalleryModal',
    data: ()=>({
      upload: false,
      uploadedFiles: [],
      stopSave: false,
      oldGallery: {},
      gallery: {
        changed: false,
        previews: [],
        photos: [

        ],
        name: '',
      },
    }),
    methods: {
      checkSave() {
        if(this.checkName() !== false && this.gallery.photos.length > 0 && this.gallery.name !== '') {
          return true;
        } else {
          return false;
        }
      },
      checkName() {
        let galleries = this.$parent.galleries;
        let flag = true;
        for(let i = 0; i < galleries.length; i++) {
          if(this.gallery !== galleries[i]) {
            if(this.gallery.name.toLowerCase() === galleries[i].name.toLowerCase()) {
              flag = false;
            }
          }
        }
       return flag;
      },
      uploadImage(e) {
        for(let i = 0; i < e.target.files.length; i++) {
          this.file = e.target.files[i];
          let reader  = new FileReader();
          reader.addEventListener("load", function () {
            this.gallery.previews.push({number: this.gallery.previews.length, image_link: reader.result, name: e.target.files[i].name});
            this.gallery.photos.push(e.target.files[i]);
          }.bind(this), false);
          if( this.file ){
            if ( /\.(jpe?g|png)$/i.test( this.file.name ) ) {
              reader.readAsDataURL( this.file );
            }
          }
        }
      },
      removePreview(preview) {
        for(let i = 0; i < this.gallery.previews.length; i++) {
          if(this.gallery.previews[i] === preview) {
            this.gallery.photos.splice(i, 1);
            this.gallery.previews.splice(i, 1);
          }
        }
      },
      cancel() {
        for(let i = 0; i < this.$parent.$parent.project.galleries.length; i++) {
          if(this.$parent.$parent.project.galleries[i] === this.gallery) {
            this.$parent.$parent.project.galleries[i] = this.oldGallery;
            break;
          }
        }
        this.gallery = this.oldGallery;
        this.$parent.tempGallery = this.oldGallery;
        this.$parent.openModal = false;
      },
      closeModal() {
        this.$parent.openModal = false;
      },
      saveGallery() {
        if(this.checkSave()) {
          this.stopSave = true;
          let data = new FormData();
          let user = JSON.parse(localStorage.getItem('maagio_user'));
          let token = localStorage.getItem('token');
          data.append('user_id', user.uid);
          data.append('token', token);
          data.append('project_id', this.$parent.$parent.project.id);
          let gallery = JSON.parse(JSON.stringify(this.gallery));
          gallery.previews = '';
          for(var i = 0; i < gallery.photos.length; i++) {
            if(gallery.photos[i].id == undefined && gallery.photos[i].image_link != '') {
              data.append(''+i,this.gallery.photos[i]);
            }
          }
          data.append('gallery', JSON.stringify(gallery));
          let obj = this;
          $.ajax({
            url: constants.BACKEND_URL + 'gallery/update-gallery',
            type: 'POST', // важно!
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (respond, status, jqXHR) {
              obj.stopSave = false;
              obj.$parent.openModal = false;
              if (respond.ok === 1) {
                if(respond.gallery.id) {
                  obj.gallery.id = respond.gallery.id;
                }
                for(var i =0; i < obj.$parent.$parent.project.galleries.length; i++) {
                  if(obj.$parent.$parent.project.galleries[i].id == respond.gallery.id) {
                    return;
                  }
                }
                obj.$parent.$parent.project.galleries.push(obj.gallery);
              } else {
                console.log('ОШИБКА: ' + respond.data);
              }
            },
            error: function (jqXHR, status, errorThrown) {
              obj.stopSave = false;
              console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
            }
          });
        }
      },
      removePhoto(el) {
        for(let i = 0; i < this.gallery.photos.length; i++) {
          if(el === this.gallery.photos[i]) {
            this.gallery.photos.splice(i, 1);
          }
        }
      }
    },
    mounted() {
        this.gallery = this.$parent.tempGallery;
        this.oldGallery = JSON.parse(JSON.stringify(this.$parent.tempGallery));
    },
  }
</script>