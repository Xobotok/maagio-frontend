<template>
    <div class="units-list">
        <div class="units-list-blocks">
            <div class="units-list-header" v-if="$parent.project.house_type == 1">Unit Number</div>
            <div class="units-list-header" v-else>House Number</div>
            <div class="units-list-header">Status</div>
            <div class="units-list-header">Price</div>
            <div class="units-list-header" v-if="$parent.project.house_type == 1">Floor</div>
            <div class="units-list-header">Sq.ft (int.)</div>
            <div class="units-list-header">Sq.ft (ext.)</div>
            <div class="units-list-header">Bed</div>
            <div class="units-list-header">Bath</div>
            <div class="units-list-header">BMR</div>
            <div class="units-list-header"></div>
        </div>
        <div class="" v-for="(floor, index) in this.$parent.project.floors" v-if="$parent.project.house_type == 1">
            <div class="units-list-blocks" v-for="unit in floor.units">
                <div class="units-list-value">{{unit.unit_number}}</div>
                <div class="units-list-value">{{statusNames[unit.status].name}}</div>
                <div class="units-list-value">{{unit.price}} $</div>
                <div class="units-list-value">{{index+ 1}}</div>
                <div class="units-list-value">{{unit.int_sq}}</div>
                <div class="units-list-value">{{unit.ext_sq}}</div>
                <div class="units-list-value">{{unit.bad}}</div>
                <div class="units-list-value">{{unit.bath}}</div>
                <div class="units-list-value" v-if="unit.bmr == 1">Yes</div>
                <div class="units-list-value" v-if="unit.bmr == 0">No</div>
                <div class="units-list-value units-icons">
                    <div class="show-button" @click="openedUnit = unit, openUnit = true">Show</div>
                </div>
            </div>
        </div>
        <OpenedUnitShow v-if="openUnit"
        :unit="openedUnit"
        :callback="closeUnitShow"
        :project="$parent.project"></OpenedUnitShow>
    </div>
</template>

<script>
  import constants from '../../Constants';
  import OpenedUnitShow from '../project/OpenedUnitShow.vue'
  export default {
    components: {OpenedUnitShow},
    name: 'Units',
    data: ()=>({
      statusNames: constants.STATUS_OPTIONS,
      openedUnit: {},
      openUnit: false,
    }),
    mounted(){

    },
    methods: {
      closeUnitShow: function () {
        this.openUnit = false;
      }
    }
  }
</script>
