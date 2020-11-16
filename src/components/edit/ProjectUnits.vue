<template>
    <div class="project-units">
        <div class="project-units-header">
            <span>UNITS</span> Here you can submit details for each unit.
        </div>
        <div class="project-units-list">
            <div class="units-list">
                <div class="units-list-blocks">
                    <div class="units-list-header">Unit Number</div>
                    <div class="units-list-header">Status</div>
                    <div class="units-list-header">Price</div>
                    <div class="units-list-header">Floor</div>
                    <div class="units-list-header">Sq.ft (int.)</div>
                    <div class="units-list-header">Sq.ft (ext.)</div>
                    <div class="units-list-header">Bed</div>
                    <div class="units-list-header">Bath</div>
                    <div class="units-list-header">BMR</div>
                    <div class="units-list-header"></div>
                </div>
                <div class="units-list-blocks warning" v-for="unit in $parent.project.unfloor_units">
                    <div class="units-block-warning">The unit will not be displayed because the floor has been deleted. Delete the unit or select a different floor.</div>
                    <div class="units-list-value">{{unit.unit_number}}</div>
                    <div class="units-list-value">{{statusNames[unit.status].name}}</div>
                    <div class="units-list-value">{{unit.price}} $</div>
                    <div class="units-list-value">0</div>
                    <div class="units-list-value">{{unit.int_sq}}</div>
                    <div class="units-list-value">{{unit.ext_sq}}</div>
                    <div class="units-list-value">{{unit.bad}}</div>
                    <div class="units-list-value">{{unit.bath}}</div>
                    <div class="units-list-value" v-if="unit.bmr == 1">Yes</div>
                    <div class="units-list-value" v-if="unit.bmr == 0">No</div>
                    <div class="units-list-value units-icons">
                        <div class="units-edit-icon" @click="editUnit(unit)"></div>
                        <div class="units-remove-icon" @click="prepareDelete"></div>
                        <div class="delete-controls" style="display: none" data-id="delete-controls">
                            <div class="delete-message">Do you really want to delete a unit?</div>
                            <div class="control-buttons">
                                <div class="delete-accept control-button" @click="deleteUnFloorUnit(unit); cancelUnitDelete">Yes</div>
                                <div class="delete-decline control-button" @click="cancelUnitDelete">No</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="" v-for="(floor, index) in this.$parent.project.floors">
                    <div class="units-list-blocks" :class="{warning: unit.floor == 0}" v-for="unit in floor.units">
                        <div class="units-block-warning" v-if="unit.floor == 0">The unit will not be displayed because the floor has been deleted. Delete the unit or select a different floor.</div>
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
                            <div class="units-edit-icon" @click="editUnit(unit)"></div>
                            <div class="units-remove-icon" @click="prepareDelete"></div>
                            <div class="delete-controls" style="display: none" data-id="delete-controls">
                                <div class="delete-message">Do you really want to delete a unit?</div>
                                <div class="control-buttons">
                                    <div class="delete-accept control-button" @click="deleteUnit(unit); cancelUnitDelete">Yes</div>
                                    <div class="delete-decline control-button" @click="cancelUnitDelete">No</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="project-units-control">
            <div class="logo-upload" @click="addUnit()">Add a Unit</div>
        </div>
        <EditUnitModal v-if="openEditUnit === true"></EditUnitModal>
    </div>
</template>

<script>
  import EditUnitModal from '@/components/edit/EditUnitModal.vue'
  import constants from "../../Constants";
  export default {
    name: 'ProjectUnits',
    components: {
      EditUnitModal,
    },
    data: ()=>({
      statusNames: constants.STATUS_OPTIONS,
      oldUnit: {},
      templateUnit: JSON.parse(JSON.stringify(constants.STANDART_UNIT)),
      units: [],
      openAddUnit: false,
      openEditUnit: false,
    }),
    methods: {
      resetTemplateUnit() {
        this.templateUnit = JSON.parse(JSON.stringify(constants.STANDART_UNIT));
      },
      openPopup() {
        this.openAddUnit = true;
      },
      prepareDelete(e){
        let container = e.target.parentNode;
        container = container.querySelector('[data-id="delete-controls"]');
        container.style.display = 'flex';
      },
      cancelUnitDelete(e){
        let container = e.target.parentNode.parentNode.parentNode;
        container = container.querySelector('[data-id="delete-controls"]');
        container.style.display = 'none';
      },
      deleteUnit(unit) {
        let containers = document.querySelectorAll('[data-id="delete-controls"]');
        for (var i = 0; i < containers.length; i++) {
          containers[i].style.display = 'none';
        }
        let unit_id = unit.id;
        for (let i = 0; i < this.units.length; i++) {
          if (this.units[i] === unit) {
            this.units.splice(i, 1);
          }
        }
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('unit_id', unit_id);
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'unit/delete-unit',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            if (respond.ok === 1) {
              for (let i = 0; i < obj.$parent.project.floors.length; i++) {
                for (let n = 0; n < obj.$parent.project.floors[i].units.length; n++) {
                  if (obj.$parent.project.floors[i].units[n] === unit) {
                    obj.$parent.project.floors[i].units.splice(n, 1);
                  }
                }
              }
              obj.$parent.project.units = obj.units;
              window.db.updateProjectFloors(obj.$parent.project.id, obj.$parent.project.floors);
            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      deleteUnFloorUnit(unit){
        let containers = document.querySelectorAll('[data-id="delete-controls"]');
        for (var i = 0; i < containers.length; i++) {
          containers[i].style.display = 'none';
        }
        let unit_id = unit.id;
        for (let i = 0; i < this.units.length; i++) {
          if (this.units[i] === unit) {
            this.units.splice(i, 1);
          }
        }
          for (let n = 0; n < this.$parent.project.unfloor_units.length; n++) {
            if (this.$parent.project.unfloor_units[n] === unit) {
              this.$parent.project.unfloor_units.splice(n, 1);
            }
          }
        let data = new FormData();
        let user = JSON.parse(localStorage.getItem('maagio_user'));
        let token = localStorage.getItem('token');
        data.append('user_id', user.uid);
        data.append('token', token);
        data.append('unit_id', unit_id);
        let obj = this;
        $.ajax({
          url: constants.BACKEND_URL + 'unit/delete-unit',
          type: 'POST', // важно!
          data: data,
          cache: false,
          dataType: 'json',
          processData: false,
          contentType: false,
          success: function (respond, status, jqXHR) {
            if (respond.ok === 1) {

            } else {
              console.log('ОШИБКА: ' + respond.data);
            }
          },
          error: function (jqXHR, status, errorThrown) {
            console.log('ОШИБКА AJAX запроса: ' + status, jqXHR);
          }
        });
      },
      addUnit() {
        this.templateUnit = JSON.parse(JSON.stringify(constants.STANDART_UNIT));
        this.openEditUnit = true;
      },
      editUnit(unit) {
        this.templateUnit = unit;
       for(var i = 0; i < this.$parent.project.floors.length; i++) {
         for(var n = 0; n < this.$parent.project.floors[i].units.length; n++) {
           if(this.$parent.project.floors[i].units[n] === unit) {
             this.templateUnit.floor = i + 1;
             break;
           }
         }
       }
        this.openEditUnit = true;
      }
    },
    mounted(){
    }
  }
</script>