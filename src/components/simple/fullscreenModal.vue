<template>
    <div class="fullscreen-modal">
        <div class="project-unit-create">
            <div class="unit-create-header">Unit Info</div>
            <div class="project-unit-left">

            </div>
            <div class="project-unit-right">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
      name: 'fullscreenModal',
      data: ()=>({
        templateUnit: {
          unitNumber: '',
          floor: 1,
          bedroom: '',
          bathroom: '',
          price: '',
          status: '',
          HOA: '',
          interiorFootage: '',
          exteriorFootage: '',
          brm: false,
          parking: false,
          floorplan: '',
        },
      }),
    }
</script>