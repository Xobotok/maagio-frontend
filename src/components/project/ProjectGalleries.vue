<template>
    <div class="project-galleries">
        <div class="galleries-container">
            <div class="gallery-item" v-for="gallery in galleries">
                <div class="photo-container">
                    <img :src="gallery.previews[0].data" alt="">
                </div>
                <div class="gallery-panel">
                    <div class="gallery-name">{{gallery.name}}</div>
                    <div class="gallery-controls">
                        <div class="gallery-edit" @click="editGallery(gallery)"></div>
                        <div class="gallery-remove" @click="removeGallery(gallery)"></div>
                    </div>
                </div>
            </div>
            <div class="empty-floor" @click="createNewGallery"><div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div></div>
        </div>
        <NewGalleryModal v-if="openModal === true"></NewGalleryModal>
    </div>
</template>

<script>
  import NewGalleryModal from '@/components/project/NewGalleryModal.vue'
  export default {
    name: 'ProjectGalleries',
    components: {
      NewGalleryModal
    },
    data:()=>({
      galleries: [],
      openModal: false,
      tempGallery: {
        photos: [],
        name: '',
        previews: [],
        changed: false,
      },
    }),
    methods: {
      createNewGallery() {
        this.tempGallery = {
          photos: [
          ],
          previews: [],
          name: '',
          changed: false,
        };
        this.openModal = true;
      },
      editGallery(gallery) {

        this.tempGallery = gallery;
        this.openModal = true;
      },
      removeGallery(gallery) {
        for(let i = 0; i < this.galleries.length; i++) {
          if(this.galleries[i] === gallery) {
            this.galleries.splice(i, 1);
          }
        }
      },
    }
  }
</script>