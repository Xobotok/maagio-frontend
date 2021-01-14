<template>
    <div class="fullscreen-modal unit-gallery-modal">
        <div class="new-gallery">
            <div>
                <div class="unit-create-header">Unit Photos</div>
                <div class="gallery-create" style="padding-top: 0;">
                    <div class="photos-container">
                        <div class="gallery-header"><span>Photos</span> Please add at least one photo.</div>
                        <div class="gallery-photos">
                            <div class="gallery-photo" v-for="(preview, key) in this.previews">
                                <img :src="preview.image_link" alt="">
                                <div class="photo-controls">
                                    <div class="photo-controls-button" @click="removePreview(key)">REMOVE</div>
                                </div>
                            </div>
                            <div class="empty-floor" onclick="document.getElementById('unit-images').click()">
                                <div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div>
                            </div>
                            <form id="units-image" enctype="multipart/form-data">
                                <div class="form-group">
                                    <input type="file" name="image" @change="uploadImage" style="display: none" multiple
                                           accept="image/png, image/jpeg" id="unit-images">
                                </div>
                                <input type="submit" style="display: none" class="btn btn-default">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div class="unit-create-controls">
                <div class="project-page-button blue-button" @click="saveGallery" v-if="stopSave == false">Save</div>
                <div class="project-page-button inactive-button" v-if="stopSave == true">Save</div>
                <div class="project-page-button" @click="cancel">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants';
  export default {
    'name': 'UnitGalleryModal',
    data: ()=>({
      stopSave: false,
      photos: [],
      previews: [],
    }),
    beforeMount() {
      this.photos = JSON.parse(JSON.stringify(this.$parent.templateUnit.photos)) || [];
      this.previews = JSON.parse(JSON.stringify(this.$parent.templateUnit.photos)) || [];
    },
    methods: {
      checkSave() {
        if (this.photos.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      uploadImage(e) {
        console.log(e.target.files);
        for (let i = 0; i < e.target.files.length; i++) {
          this.file = e.target.files[i];
          let reader = new FileReader();
          reader.addEventListener("load", function () {
            this.previews.push({ image_link: reader.result });
            this.photos.push(e.target.files[i]);
          }.bind(this), false);
          if (this.file) {
            if (/\.(jpe?g|png)$/i.test(this.file.name)) {
              reader.readAsDataURL(this.file);
            }
          }
        }
      },
      removePreview(number) {
        this.photos.splice(number, 1);
        this.previews.splice(number, 1);
      },
      cancel() {
        this.photos = [];
        this.previews = [];
        this.$parent.unitGalleryModal = false;
      },
      saveGallery() {
        this.stopSave = true;
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('unit_id', this.$parent.templateUnit.id);
        data.append('project_id', this.$parent.$parent.$parent.project.id);
        data.append('photos', JSON.stringify(this.photos));
        for (var i = 0; i < this.photos.length; i++) {
          if (this.photos[i].id == undefined && this.photos[i].image_link != '') {
            data.append('' + i, this.photos[i]);
          }
        }
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'unit/update-photos',
          type: 'POST',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            if (respond.ok == 1) {
              obj.photos = respond.unit_photos;
              obj.$parent.templateUnit.photos = respond.unit_photos;
              obj.$parent.unitGalleryModal = false;
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.stopSave = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
    },
  }
</script>