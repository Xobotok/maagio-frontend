<template>
    <div class="projects" id="projects">
        <ProjectEmptyCard v-if="projects.length == 0"></ProjectEmptyCard>
        <ProjectCard v-for="project in projects" v-bind:project="project"></ProjectCard>
    </div>
</template>

<script>
    import ProjectEmptyCard from '@/components/project/ProjectEmptyCard.vue'
    import ProjectCard from '@/components/project/ProjectCard.vue'
    import constants from "../Constants";
  export default {
    name: 'myprojects',
    components: {
      ProjectEmptyCard,ProjectCard
    },
    data: ()=>({
        user_id: '',
        token: '',
        projects: [

          ],
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
            obj.projects = respond.data;
            console.log(respond.data);
          }

        },

        error: function( jqXHR, status, errorThrown ){

        }
      });
    }
  }
</script>
