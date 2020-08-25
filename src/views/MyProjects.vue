<template>
    <div class="projects" id="projects">
        <ProjectEmptyCard v-if="projects.length == 0"></ProjectEmptyCard>
        <ProjectCard v-for="project in projects" v-bind:project="project"></ProjectCard>
    </div>
</template>

<script>
    import ProjectEmptyCard from '@/components/project/ProjectEmptyCard.vue'
    import ProjectCard from '@/components/project/ProjectCard.vue'
  export default {
    name: 'myprojects',
    components: {
      ProjectEmptyCard,ProjectCard
    },
    data: ()=>({
        projects: [

          ],
    }),
    methods: {
    },
  }
</script>
