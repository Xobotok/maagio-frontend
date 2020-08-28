<template>
    <div class="fullscreen-modal">
        <div class="new-gallery">
            <div class="unit-create-header">Album Info</div>
            <div class="gallery-create">
                <div class="gallery-name">
                    <div class="gallery-header">
                        <span>Name*</span>
                    </div>
                    <div class=""><input type="text" class="project-input">
                    </div>
                </div>
                <div class="photos-container">
                    <div class="gallery-header"><span>Photos</span> Please add at least one photo.</div>
                    <div class="gallery-photos">
                        <div class="gallery-photo" v-for="photo in photos">
                            <img src="../../assets/img/no-image-project.png" alt="">
                            <div class="photo-controls">
                                <div class="photo-controls-button">REPLACE</div>
                                <div class="photo-controls-button" @click="removePhoto(photo)">REMOVE</div>
                            </div>
                        </div>
                        <div class="gallery-photo">
                            <img src="../../assets/img/no-image-project.png" alt="">
                        </div>
                        <div class="gallery-photo">
                            <img src="../../assets/img/no-image-project.png" alt="">
                        </div>
                        <div class="empty-floor" onclick="document.getElementById('photo-upload').click()"><div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div></div>
                        <input type="file" style="display: none" multiple accept="image/png, image/jpeg" id="photo-upload">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'NewGalleryModal',
    data: ()=>({
      photos: [
        {
          link: '',
          number: 1,
        },
        {
          link: '',
          number: 2,
        },
        {
          link: '',
          number: 3,
        }
      ],
    }),
    methods: {
      removePhoto(el) {
        for(let i = 0; i < this.photos.length; i++) {
          if(el === this.photos[i]) {
            this.photos.splice(i, 1);
          }
        }
        console.log(el);
      }
    },
  }
</script>