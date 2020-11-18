<template>
    <div class="show-floors">
        <div class="unit-content" v-if="openUnitPage">
            <div class="unit-info">
                <div class="unit-back" @click="closeUnitPage"></div>
                <div class="unit-common-info">
                    <div class="unit-header">{{this.$parent.project.name}}</div>
                    <div class="unit-number">{{this.openedUnit.unit_number}}</div>
                    <div class="unit-number">Floor {{this.activeFloor + 1}}</div>
                    <div class="unit-extra-info" style="padding-bottom: 20px; padding-top: 20px;">
                        {{this.openedUnit.int_sq}} Sq.Ft. Interior
                    </div>
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
                    <div class="units-item" v-for="unit in this.floor.units" @click="openUnit(unit)">Unit number
                        {{unit.unit_number}}
                    </div>
                </div>
                <div class="image-container" v-if="floorImage != ''">
                    <img :src="floorImage" id="floor-image" alt="">
                    <div v-for="unit in floor.units" @click="openUnit(unit)" class="unit-point"
                         v-if="unit.unit_mark != null && unit.show != false"
                         :style="{left: unit.unit_mark.x + '%', top: unit.unit_mark.y + '%', width: unit.unit_mark.natural_width + 'px',
                         height: unit.unit_mark.natural_height + 'px', fontSize: unit.unit_mark.font_size + 'px'}">
                        <div class="unit-point-bedrooms" v-if="unit.bad > 0 && unit.bad != '' && unit.bedShow !== false">{{unit.bad}} bedroom
                        </div>
                        <div class="unit-point-bedrooms" v-if="unit.bad == 0 ">STUDIO</div>
                        <div class="unit-point-number">
                            {{unit.unit_number}}
                        </div>
                        <div class="unit-point-status" v-if="unit.status !== '' && unit.statusShow !== false">{{statuses[unit.status]}}</div>
                    </div>
                </div>
            </div>
            <div class="navigation-container">
                <div class="navigation-block">
                    <div class="floor-navigation">
                        <div class="floor-navigation-tab" @click="openFloor(index)"
                             :class="{active: index === activeFloor}" v-for="(floor, index) in this.$parent.project.floors">
                            {{(index + 1)}}
                        </div>
                    </div>
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
      floor: { units: [{ bedShow: true, statusShow: true }] },
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
    beforeMount(){
      this.floor = this.$parent.project.floors[0];
      if (this.$parent.project.floors[0].image != '' && this.$parent.project.floors[0].image != null) {
        this.floorImage = this.$parent.project.floors[0].image;
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
      var obj = this;
      setTimeout(function () {
        for (var i = 0; i < obj.floor.units.length; i++) {
          if (obj.floor.units[i].unit_mark != null) {
            obj.floor.units[i].unit_mark.natural_width = obj.calculateWidth(obj.floor.units[i]);
            obj.floor.units[i].unit_mark.natural_height = obj.calculateHeight(obj.floor.units[i]);
            obj.floor.units[i].unit_mark.font_size = obj.calculateFontSize(obj.floor.units[i]);
          }
        }
      }, 200)
    },
    methods: {
      calculateFontSize(unit){
        let fontSize = unit.unit_mark.natural_height / 3 / 2;
        let fontSize2 = unit.unit_mark.natural_width / 8;
        if(fontSize < fontSize2) {
          var min = fontSize;
        } else {
          var  min = fontSize2;
        }
        if(min > 14) {
          return Number.parseInt(min);
        } else {
          return 14;
        }
      },
      calculateWidth(unit) {
        var imageContainer = $('#floor-image');
        var width = imageContainer.width();
        var percent = width / 100;
        var mark_width = unit.unit_mark.width * percent;
        return Number.parseInt(mark_width);
      },
      calculateHeight(unit) {
        var imageContainer = $('#floor-image');
        var width = imageContainer.height();
        var percent = width / 100;
        var mark_height = unit.unit_mark.height * percent;
        return Number.parseInt(mark_height);
      },
      openFloor(index) {
        this.activeFloor = index;
        this.floor = this.$parent.project.floors[index];
        this.reserveFloor = this.$parent.project.floors[index];
        if (this.$parent.project.floors[index].image != '' && this.$parent.project.floors[index].image != null) {
          this.floorImage = this.$parent.project.floors[index].image;
        } else {
          this.floorImage = '';
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
        for (var iter = 0; iter < this.floor.units.length; iter++) {
          this.floor.units[iter].bedShow = true;
          this.floor.units[iter].statusShow = true;
        }
        for (var iter = 0; iter < this.floor.units.length; iter++) {
          for (var n = 0; n < this.filters.bed.length; n++) {
          if (this.floor.units[iter].bad == this.filters.bed[n]) {
              this.floor.units[iter].bedShow = false;
            }
          }
        }
        for (let iter2 = 0; iter2 < this.floor.units.length; iter2++) {
          for (let m = 0; m < this.filters.status.length; m++) {
            if (this.floor.units[iter2].status == this.filters.status[m]) {
              this.floor.units[iter2].statusShow = false;
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
