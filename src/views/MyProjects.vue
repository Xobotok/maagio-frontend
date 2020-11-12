<template>
    <div class="projects" id="projects">
        <ProjectEmptyCard v-if="published_projects.length == 0 && draft_projects.length == 0"></ProjectEmptyCard>
        <div class="project-header" v-if="published_projects.length != 0">Published</div>
        <div class="project-list" v-if="published_projects.length != 0">
            <ProjectCard v-for="project in published_projects" v-bind:project="project"></ProjectCard>
        </div>
        <div class="project-header" v-if="draft_projects.length != 0">Draft</div>
       <div class="project-list draft-list" v-if="draft_projects.length != 0">
           <DraftProjectCard v-for="project in draft_projects" v-bind:project="project"></DraftProjectCard>
       </div>


    </div>
</template>

<script>
    import ProjectEmptyCard from '@/components/project/ProjectEmptyCard.vue'
    import DraftProjectCard from '@/components/project/DraftProjectCard.vue'
    import ProjectCard from '@/components/project/ProjectCard.vue'
    import constants from "../Constants";
  export default {
    name: 'myprojects',
    components: {
      ProjectEmptyCard,ProjectCard, DraftProjectCard
    },
    data: ()=>({
        user_id: '',
        token: '',
      draft_projects: [],
      published_projects: [],
    }),
    methods: {

    },
    mounted() {
      let user = JSON.parse(localStorage.getItem('maagio_user'));
      this.token = localStorage.getItem('token');
      this.user_id = user.uid;
      let data = {user_id: this.user_id, token: this.token};
      let obj = this;
      $.ajax({
        url         : constants.BACKEND_URL + 'project/get-user-projects',
        type        : 'GET',
        data        : data,
        dataType    : 'json',
        success     : function( respond, status, jqXHR ){
          if(respond.ok === 1) {
            obj.published_projects = respond.published_projects;
            obj.draft_projects = respond.draft_projects;
            window.db.clearStore('published_projects');
            for(var i = 0; i < obj.published_projects.length; i++) {
              window.db.setValue('published_projects', Number.parseInt(obj.published_projects[i].id), obj.published_projects[i])
            }
            window.db.clearStore('draft_projects');
            for(var i = 0; i < obj.draft_projects.length; i++) {
              window.db.setValue('draft_projects', Number.parseInt(obj.draft_projects[i].id), obj.draft_projects[i])
            }
          }
        },

        error: function( jqXHR, status, errorThrown ){
          window.db.getAllValues('published_projects', function (e) {
            var tmp1 = [];
            for(var i = 0; i < e.length; i++) {
              tmp1.push(e[0].value)
            }
            obj.published_projects = tmp1;
          });
          window.db.getAllValues('draft_projects', function (e) {
            var tmp1 = [];
            for(var i = 0; i < e.length; i++) {
              tmp1.push(e[0].value)
            }
            obj.draft_projects = tmp1;
          });
        }
      });
    }
  }
</script>
