<template>
    <div class="projects">
        <ProjectEmptyCard />
        <ProjectEmptyCard />
        <ProjectEmptyCard />
        <ProjectEmptyCard />
    </div>
</template>

<script>
    import ProjectEmptyCard from '@/components/project/ProjectEmptyCard.vue'
  export default {
    name: 'myprojects',
    components: {
      ProjectEmptyCard,
    }
  }
</script>
