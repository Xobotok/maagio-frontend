<template>
    <div class="btn-group">
        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption.name !== undefined">
            {{ selectedOption.name }}
            <span class="caret"></span>
        </li>

        <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption.name === undefined">
            {{placeholderText}}
            <span class="caret"></span>
        </li>

        <ul class="dropdown-menu superscroll" v-if="showMenu">
            <li v-for="(option, idx) in $parent.$parent.project.floors" :key="idx">
                <a href="javascript:void(0)" :number="idx" @click="updateOption">
                    Floor {{idx + 1}}
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    'name': 'specDropdown',
    data() {
      return {
        selectedOption: {
          name: '',
          val: '',
          id: '',
        },
        showMenu: false,
        placeholderText: 'Please select an item',
      }
    },
    props: {
      id: 'id',
      selected: {},
      placeholder: [String],
      closeOnOutsideClick: {
        type: [Boolean],
        default: true,
      },
    },
    mounted() {
      this.options = [];
      for (var i = 0; i < this.$parent.$parent.project.floors.length; i++) {
        this.options.push({ name: 'Floor ' + (i + 1), val: i });
      }
      this.selectedOption = this.selected;
      if (this.placeholder)
      {
        this.placeholderText = this.placeholder;
      }
      if (this.closeOnOutsideClick) {
        document.addEventListener('click', this.clickHandler);
      }
    },
    beforeDestroy() {
      document.removeEventListener('click', this.clickHandler);
    },
    methods: {
      dropdownCallback: function () {
        if(this.selectedOption) {
          this.$parent.selectNewFloor(this)
        }
      },
      updateOption(e) {
        this.selectedOption.name = e.target.textContent;
        this.selectedOption.val = e.target.textContent.split('Floor ')[1];
        this.selectedOption.val = Number.parseInt(this.selectedOption.val) - 1;
        this.selectedOption.id = this.$el.getAttribute('elementid');
        this.$parent.selectNewFloor(this);
        this.selectedOption = this.$parent.object;
        console.log(this.$parent.object);
        this.showMenu = false;
      },
      toggleMenu() {
        this.showMenu = !this.showMenu;
      },
      clickHandler(event) {
        const { target } = event;
        const { $el } = this;
        if (!$el.contains(target)) {
          this.showMenu = false;
        }
      },
    }
  }
</script>

<style>
    .btn-group {
        border: 2px solid #BDBDBD;
        position: relative;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        display: inline-block;
        vertical-align: middle;
    }
    .btn-group a:hover {
        text-decoration: none;
    }
    .dropdown-toggle {
        color: #636b6f;
        min-width: 100px;
        padding: 7px 20px 7px 10px;
        text-transform: none;
        font-weight: 300;
        border: 0;
        background-size: 0 2px, 100% 1px;
        background-repeat: no-repeat;
        background-position: center bottom, center calc(100% - 1px);
        background-color: transparent;
        transition: background 0s ease-out;
        float: none;
        box-shadow: none;
        border-radius: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .dropdown-toggle:hover {
        cursor: pointer;
    }
    .dropdown-menu {
        position: absolute;
        max-height: 100px;
        overflow: auto;
        top: 100%;
        width: 100%;
        left: 0;
        z-index: 1000;
        float: left;
        min-width: 100px;
        padding: 5px 0;
        margin: 2px 0 0;
        list-style: none;
        font-size: 14px;
        text-align: left;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
        background-clip: padding-box;
    }
    .dropdown-menu > li > a {
        padding: 10px 30px;
        display: block;
        clear: both;
        font-weight: normal;
        line-height: 1.6;
        color: #333333;
        white-space: nowrap;
        text-decoration: none;
    }
    .dropdown-menu > li > a:hover {
        background: #efefef;
        color: #409FCB;
    }
    .dropdown-menu > li {
        overflow: hidden;
        width: 100%;
        position: relative;
        margin: 0;
    }
    .caret {
        width: 0;
        position: absolute;
        top: 14px;
        height: 0;
        margin-left: -24px;
        vertical-align: middle;
        border-top: 4px dashed;
        border-top: 4px solid \9;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        right: 10px;
    }
    li {
        list-style: none;
    }
</style>