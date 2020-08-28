<template>
    <div class="fullscreen-modal">
        <div class="new-gallery">
            <div class="unit-create-header">Album Info</div>
            <div class="gallery-create">
                <div class="gallery-name">
                    <div class="gallery-header">
                        <span>Name*</span>
                    </div>
                    <div class=""><input type="text" class="project-input" v-model="gallery.name">
                    </div>
                </div>
                <div class="photos-container">
                    <div class="gallery-header"><span>Photos</span> Please add at least one photo.</div>
                    <div class="gallery-photos">
                        <div class="gallery-photo" v-for="photo in gallery.photos">
                            <img :src="photo.link" alt="">
                            <div class="photo-controls">
                                <div class="photo-controls-button">REPLACE</div>
                                <div class="photo-controls-button" @click="removePhoto(photo)">REMOVE</div>
                            </div>
                        </div>
                        <div class="empty-floor" onclick="document.getElementById('photo-upload').click()"><div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div></div>
                        <input type="file" style="display: none" multiple accept="image/png, image/jpeg" id="photo-upload">
                    </div>
                </div>
            </div>
            <div class="unit-create-controls">
                <div class="project-page-button blue-button" @click="saveGallery" v-if="checkSave()">Save</div>
                <div class="project-page-button inactive-button" v-if="!checkSave()">Save</div>
                <div class="project-page-button" @click="closeModal">Cancel</div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'NewGalleryModal',
    data: ()=>({
      gallery: {
        photos: [
          {
            link: require('../../assets/img/no-image-project.png'),
            number: 1,
          },
          {
            link: require('../../assets/img/no-image-project.png'),
            number: 2,
          },
          {
            link: require('../../assets/img/no-image-project.png'),
            number: 3,
          }
        ],
        name: '',
      },
    }),
    methods: {
      checkSave() {
        if(this.gallery.photos.length > 0 && this.gallery.name !== '') {
          return true;
        } else {
          return false;
        }
      },
      closeModal() {
        this.$parent.openModal = false;
        console.log(this.$parent.galleries);
      },
      saveGallery() {
        if(this.checkSave()) {
          let flag = false;
          for(var i = 0; i < this.$parent.galleries.length; i++) {
            if(this.$parent.galleries[i] === this.gallery) {
              this.$parent.galleries[i] = this.gallery;
              flag = true;
            }
          }
          if(!flag) {
            this.$parent.galleries.push({name: this.gallery.name, photos: this.gallery.photos});
          }

        }
        this.closeModal();
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
    },
  }
</script>