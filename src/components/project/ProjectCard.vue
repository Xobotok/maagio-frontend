<template>
    <div class="project-card">
        <div class="project-content">
            <div class="image-container">
                <div class="project-image"  :style="{ backgroundImage: 'url('+getImgUrl()+')' }"></div>
            </div>
            <div class="project-name">
                {{project.name}}
            </div>
            <div class="project-menu">
                <div class="project-menu-text">EDIT</div>
                <div class="menu-delimiter"></div>
                <div class="project-menu-text">
                    PREVIEW
                    <span class="menu-link"></span>
                </div>
                <div class="menu-delimiter"></div>
                <div class="project-menu-icons">
                    <div class="menu-share"></div>
                    <div class="menu-delete"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    'name': 'ProjectCard',
    props: ['project'],
    methods: {
      getImgUrl() {
        return require('../../assets/'+this._props.project.img);
      }
    },
    mounted: function () {
    }
  }
</script>