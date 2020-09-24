<template>
    <div class="project-card">
        <div class="project-content">
            <div class="image-container">
                <div class="project-image" :style="{ backgroundImage: 'url('+getImgUrl()+')' }"></div>
            </div>
            <div class="project-name">
                {{project.name}}
            </div>
            <div class="project-menu">
                <router-link :to="{path: 'edit', query: {project_id: project.id}}" class="project-menu-text">EDIT</router-link>
                <div class="menu-delimiter"></div>
                <router-link :to="{path: 'show', query: {project: project.special_link}}"><div class="project-menu-text">
                    PREVIEW
                    <span class="menu-link"></span>
                </div></router-link>

                <div class="menu-delimiter"></div>
                <div class="project-menu-icons">
                    <div class="menu-share"></div>
                    <div class="menu-delete" @click="deleteProject = true"></div>
                </div>
                <div class="delete-confirmation" v-if="deleteProject === true">
                    Are you sure you want to delete the project?
                    <div class="delete-buttons">
                        <div class="menu-confirm delete-button" @click="removeProject">Yes</div>
                        <div class="menu-decline delete-button" @click="deleteProject = false">No</div>
                    </div>
                </div>
                <div class="delete-process" v-if="deleteProcess === true">
                    The project is being deleted
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import constants from "../../Constants";

  export default {
    'name': 'ProjectCard',
    props: ['project'],
    data: ()=>({
      deleteProject: false,
      deleteProcess: false,
    }),
    methods: {
      getImgUrl() {
        if (this._props.project.project_logo == null) {
          return require('../../assets/img/default_logo.jpg');
        } else {
          return this._props.project.project_logo;
        }
      },
      removeProject(){
        this.deleteProcess = true;
        this.deleteProject = false;
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        this.token = localStorage.getItem('token');
        this.user_id = user.uid;
        let data = { user_id: this.user_id, token: this.token, project_id: this.project.id };
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'project/delete',
          type: 'POST',
          data: data,
          dataType: 'json',
          success: function (respond, status, jqXHR) {
            obj.deleteProcess = false;
            if (respond.ok === 1) {
              let projects = obj.$parent.projects;
              for(var i = 0; i < projects.length; i++) {
                if(projects[i].id == respond.project_id) {
                  projects.splice(i, 1);
                  break;
                }
              }
            }
          },
          error: function (jqXHR, status, errorThrown) {
            obj.deleteProcess = false;
            obj.deleteProject = false;
          }
        });
      },
    },
    mounted: function () {
    }
  }
</script>