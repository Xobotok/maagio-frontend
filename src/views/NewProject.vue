<template>
    <div class="new-project-page">
        <div class="new-project-progress">
            <div class="progress-tab" v-for="(progress, key) in progresses"
                 :class="{inactive: progress.active != true}">
                <div class="progress-name" v-on:click="makeActive(key + 1)">{{key + 1}} {{progress.name}}</div>
                <div class="progress-arrow" v-if="progress.arrow"></div>
            </div>
        </div>
        <div class="project-page-content">
            <ProjectOverview v-bind:name="project.name" v-show="activeTab == 1"></ProjectOverview>
        </div>
        <div class="project-page-controls" v-if="!published">
            <div class="project-page-button" :class="{invisible: activeTab == 1}">Back</div>
            <div class="project-page-subcontrols" v-if="project.name.length > 0">
                <div class="project-page-button">Save Draft</div>
                <div class="project-page-button blue-button" v-if="activeTab != 6">Next</div>
                <div class="project-page-button blue-button" v-if="activeTab == 6">Publish</div>
            </div>
        </div>
        <div class="project-page-publish" v-if="published">
            <div class="publish-button">
                <span class="publish-icon"></span>
                Published
            </div>
        </div>
    </div>
</template>

<script>
  import ProjectOverview from '@/components/project/ProjectOverview.vue'
  export default {
    name: 'newproject',
    components: {
      ProjectOverview,
    },
    mounted() {
      var tabs = document.getElementsByClassName('progress-tab');
      tabs[this.activeTab - 1].classList.add('active');
    },
    methods: {
      makeActive(e) {
        if (this.progresses[e - 1].active === true) {
          this.activeTab = e;
          var tabs = document.getElementsByClassName('progress-tab');
          for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.remove('active');
          }
          tabs[this.activeTab - 1].classList.add('active');
        }
      }
    },
    data: ()=>({
      activeTab: 1,
      tabsCount: 1,
      published: false,
      progresses: [
        {
          name: 'Overview',
          arrow: true,
          active: true,
        },
        {
          name: 'Floor Plates',
          arrow: true,
          active: false,
        },
        {
          name: 'Units',
          arrow: true,
          active: false,
        },
        {
          name: 'Maps',
          arrow: true,
          active: false,
        },
        {
          name: 'Galleries',
          arrow: true,
          active: false,
        },
        {
          name: 'Publish',
          arrow: false,
          active: false,
        },
      ],
      project: {
        name: 'Васян',
        logo: '',
      },
    }),
  }
</script>
