<template>
    <div class="project-galleries">
        <div class="galleries-container">
            <div class="empty-floor" @click="openModal = true"><div class="empty-floor-text"><span class="empty-floor-plus">+</span> Add</div></div>
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
    }),
  }
</script>