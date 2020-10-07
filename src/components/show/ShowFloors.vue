<template>
    <div class="show-floors">
        <div class="unit-content" v-if="openUnitPage">
            <div class="unit-info">
                <div class="unit-back" @click="closeUnitPage"></div>
                <div class="unit-common-info">
                    <div class="unit-header">{{this.$parent.project.name}}</div>
                    <div class="unit-number">{{this.openedUnit.unit_number}}</div>
                    <div class="unit-number">Floor {{this.activeFloor + 1}}</div>
                    <div class="unit-extra-info"  style="padding-bottom: 20px; padding-top: 20px;">{{this.openedUnit.int_sq}} Sq.Ft. Interior</div>
                    <div class="unit-extra-info" v-if="this.openedUnit.ext_sq != null">{{this.openedUnit.ext_sq}} Sq.Ft.
                        Exterior
                    </div>
                    <div class="unit-extra-info" v-if="this.openedUnit.bad != 0">{{this.openedUnit.bad}} Bedroom</div>
                    <div class="unit-extra-info" v-if="this.openedUnit.bad == 0">STUDIO</div>
                    <div class="unit-extra-info">{{this.openedUnit.bath}} Bathroom</div>
                    <div class="unit-extra-info" v-if="this.openedUnit.parking == 1">Parking</div>
                </div>
                <div class="unit-status-info">
                    <div class="unit-status-text">{{this.statuses[this.openedUnit.status]}}</div>
                    <div class="unit-status-text">$ {{this.openedUnit.price}}</div>
                </div>
            </div>
            <div class="unit-image">
                <img :src="this.openedUnit.image" alt="">
            </div>
        </div>
        <div class="floors-content">
            <div class="floor-image">
                <div class="units-list" v-if="floorImage == ''">
                    <div class="no-units" v-if="this.floor != '' && this.floor.units.length === 0">No units</div>
                   <div class="units-item"  v-for="unit in this.floor.units" @click="openUnit(unit)">Unit number {{unit.unit_number}} </div>
                </div>
                <div class="image-container" v-if="floorImage != ''">
                    <img :src="floorImage" alt="">
                    <div v-for="unit in this.floor.units" @click="openUnit(unit)" class="unit-point"
                         v-if="(unit.mark_x != '' && unit.mark_x != null) && (unit.mark_y != '' && unit.mark_y != null)"
                         :style="{left: 'calc(' + unit.mark_x + '% - 50px)', top: 'calc(' + unit.mark_y + '% - 30px)'}">
                        <div class="unit-point-bedrooms" v-if="unit.bad > 0 && unit.bad != ''">{{unit.bad}} bedroom
                        </div>
                        <div class="unit-point-bedrooms" v-if="unit.bad == 0 ">STUDIO</div>
                        <div class="unit-point-number">
                            {{unit.unit_number}}
                        </div>
                        <div class="unit-point-status" v-if="unit.status !== ''">{{statuses[unit.status]}}</div>
                    </div>
                </div>
            </div>
            <div class="floor-navigation">
                <div class="floor-navigation-tab" @click="openFloor(index)"
                     :class="{active: index === activeFloor}" v-for="(floor, index) in this.$parent.project.floors">
                    {{(index + 1)}}
                </div>
            </div>
            <div class="show-floors-footer">
                <div class="bedrooms-list">
                    <div class="bedrooms-list-item" v-for="(bedroom, key) in bedroomList">
                        <input checked type="checkbox" style="display: none" @change="makeBedFilter"
                               :id="bedroom.bed+'_'+key">
                        <label :for="bedroom.bed+'_'+key" v-if="bedroom.bed != 0">{{bedroom.bed}} bedroom</label>
                        <label :for="bedroom.bed+'_'+key" v-if="bedroom.bed == 0">STUDIO</label>
                    </div>

                </div>
                <div class="status-list">
                    <div class="status-item" v-for="(status, key) in statusList">
                        <input checked type="checkbox" style="display: none" @change="makeStatusFilter"
                               :id="key+'_status'">
                        <label :for="key+'_status'" class="status-item-title"
                               v-if="status !== false">{{statuses[key]}}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import constants from '../../Constants';
  export default {
    name: 'show-floors',
    data: ()=>({
      activeFloor: 0,
      floor: '',
      reserveFloor: '',
      floorImage: '',
      bedroomList: [],
      statuses: ['Available', 'Reserved', 'Sold', 'Unreleased'],
      statusList: [],
      openedUnit: '',
      openUnitPage: false,
      filters: {
        bed: [],
        status: [],
      },
      activeFilters: {
        bed: [],
        status: [],
      },
    }),
    mounted(){
      this.floor = JSON.parse(JSON.stringify(this.$parent.project.floors[0]));
      this.reserveFloor = this.$parent.project.floors[0];
      if(this.$parent.project.floors[0].image != '' && this.$parent.project.floors[0].image != null) {
        this.floorImage = this.$parent.project.floors[0].image.image_link;
      }

      for (let i = 0; i < this.floor.units.length; i++) {
        let flag = true;
        this.floor.units[i].visible = true;
        for (let n = 0; n < this.bedroomList.length; n++) {
          if (this.bedroomList[n].bed === this.floor.units[i].bad) {
            flag = false;
          }
        }
        if (flag) {
          this.bedroomList.push({ bed: this.floor.units[i].bad });
          this.activeFilters.bed.push(this.floor.units[i].bad);
        }
        this.statusList[i] = false;
        this.statusList[this.floor.units[i].status] = true;
      }
    },
    methods: {
      openFloor(index) {
        this.activeFloor = index;
        this.floor = JSON.parse(JSON.stringify(this.$parent.project.floors[index]));
        this.reserveFloor = this.$parent.project.floors[index];
        if(this.$parent.project.floors[index].image != '' && this.$parent.project.floors[index].image != null) {
          this.floorImage = this.$parent.project.floors[index].image.image_link;
        }
        this.renderFilters();
      },
      renderFilters(){
        this.bedroomList = [];
        this.statusList = [];
        for (let i = 0; i < this.floor.units.length; i++) {
          if (this.floor.units[i].bad != null) {
            let flag = true;
            for (let n = 0; n < this.bedroomList.length; n++) {
              if (this.bedroomList[n].bed === this.floor.units[i].bad) {
                flag = false;
              }
            }
            if (flag) {
              this.bedroomList.push({ bed: this.floor.units[i].bad });
            }
          }
          this.statusList[i] = false;
          this.statusList[this.floor.units[i].status] = true;
        }
      },
      makeBedFilter(e){
        let bedNumber = $(e.target).attr('id').split('_')[0];
        if (e.target.checked === false) {
          this.filters.bed.push(bedNumber);
        } else {
          for (let i = 0; i < this.filters.bed.length; i++) {
            if (this.filters.bed[i] == bedNumber) {
              this.filters.bed.splice(i, 1);
              i--;
            }
          }
        }
        this.useFilter();
      },
      makeStatusFilter(e){
        let statusNumber = $(e.target).attr('id').split('_')[0];
        if (e.target.checked === false) {
          this.filters.status.push(statusNumber);
        } else {
          for (let i = 0; i < this.filters.status.length; i++) {
            if (this.filters.status[i] == statusNumber) {
              this.filters.status.splice(i, 1);
              i--;
            }
          }
        }
        this.useFilter();
      },
      useFilter() {
        this.floor.units = [];
        for (let i = 0; i < this.reserveFloor.units.length; i++) {
          this.floor.units.push(this.reserveFloor.units[i]);
        }
        for (let n = 0; n < this.filters.bed.length; n++) {
          for (let iter = 0; iter < this.floor.units.length; iter++) {
            if (this.floor.units[iter].bad == this.filters.bed[n]) {
              this.floor.units.splice(iter, 1);
              iter--;
            }
          }
        }
        for (let m = 0; m < this.filters.status.length; m++) {
          for (let iter2 = 0; iter2 < this.floor.units.length; iter2++) {
            if (this.floor.units[iter2].status == this.filters.status[m]) {
              this.floor.units.splice(iter2, 1);
              iter2--;
            }
          }
        }
      },
      openUnit(unit){
        this.openedUnit = unit;
        this.openUnitPage = true;
      },
      closeUnitPage(){
        this.openUnitPage = false;
      }
    }
  }
</script>
