<template>
    <div class="project-publish">
        <div class="publish-header">
            <span>MAGGIO LINK</span> This is your link of the app. Until you publish the app, this link will remain private.
        </div>
        <div id="personal-link">{{$parent.personalLink}}</div>
    </div>
</template>

<script>
  export default {
    'name': 'ProjectPublish',
    data: ()=>({
        speicalLink: '',
    }),
    mounted() {

    },
    methods: {

    }
  }
</script>