<template>
    <router-link to="/new" class="project-empty-card">
        <div class="project-empty-content">
            <div class="project-empty-plus">+</div>
            <div class="project-empty-text">
                You don’t have any apps yet <br>
                Click to start a new one.
            </div>
        </div>
    </router-link>
</template>

<script>
  export default {
    'name': 'ProjectEmptyCard',
  }
</script>