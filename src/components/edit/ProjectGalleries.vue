<template>
    <div class="project-galleries">
        <div class="galleries-container">
            <div class="gallery-item" v-for="gallery in this.$parent.project.galleries">
                <div class="photo-container">
                    <img :src="gallery['previews'][0].image_link" alt="">
                </div>
                <div class="gallery-panel">
                    <div class="gallery-name">{{gallery.name}}</div>
                    <div class="gallery-controls">
                        <div class="gallery-edit" @click="editGallery(gallery)"></div>
                        <div class="gallery-remove" @click="prepareToRemove"></div>
                        <div class="delete-controls" style="display: none" data-id="delete-controls">
                            <div class="delete-message">Do you really want to delete a gallery?</div>
                            <div class="control-buttons">
                                <div class="delete-accept control-button" @click="removeGallery(gallery); cancelGalleryDelete">Yes</div>
                                <div class="delete-decline control-button" @click="cancelGalleryDelete">No</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="empty-floor" @click="createNewGallery"><div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div></div>
        </div>
        <NewGalleryModal v-if="openModal === true"></NewGalleryModal>
    </div>
</template>

<script>
  import NewGalleryModal from '@/components/edit/NewGalleryModal.vue'
  import constants from "../../Constants";
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
      prepareToRemove(e) {
        let container = e.target.parentNode;
        container = container.querySelector('[data-id="delete-controls"]');
        container.style.display = 'flex';
      },
      cancelGalleryDelete(e){
        let container = e.target.parentNode.parentNode.parentNode;
        container = container.querySelector('[data-id="delete-controls"]');
        container.style.display = 'none';
      },
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
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('project_id', this.$parent.project.id);
        data.append('gallery_id', gallery.id);
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'gallery/remove-gallery',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            obj.stopSave = false;
            if (respond.ok === 1) {
              for(let i = 0; i < obj.$parent.project.galleries.length; i++) {
                if(obj.$parent.project.galleries[i] === gallery) {
                  obj.$parent.project.galleries.splice(i, 1);
                }
              }
            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.stopSave = false;
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
    },
    mounted(){

    }
  }
</script>