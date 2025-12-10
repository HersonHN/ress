<!--
  This component creates a list of other components,
  the data must be in an array of objects, and each
  object is assigned to a component.

  can be used in this way:

  <component-list v-model="ARRAY" #default="{ item }">
    <my-component v-model="item.value" />
  </component-list>

  Where ARRAY is the array of objects and <my-component>
  it is the component to use.

  The `item` object is an iteration of the array
  and contains 3 properties:
  - value: the individual value for each iteration.
  - index: the position in the list.
  - id: a random unique id.
-->
<template>
  <section class="component-list">
    <div v-for="(item, index) in data" :key="item.id">
      <div class="item" @drop="drop($event, item)" @dragover="allowDrop($event)">
        <div class="item-controls grayed" draggable="true" @dragstart="drag($event, item)">
          <span class="drag-icon"></span>
        </div>

        <div class="item-content">
          <slot :item="item"></slot>
        </div>

        <div class="item-controls left-aligned">
          <div class="item-control-icons">
            <a class="icon" title="Move Up" @click="moveUp(index)">
              <i class="icon-up-open"></i>
            </a>
            <a
              class="icon"
              title="Delete"
              v-if="!(noDelete || item.value.required)"
              @click="remove(index)"
            >
              <i class="icon-minus-circled"></i>
            </a>
            <br />
            <a class="icon" title="Move Down" @click="moveDown(index)">
              <i class="icon-down-open"></i>
            </a>
            <a class="icon" title="Add" v-if="!noAdd" @click="addBelow(index)">
              <i class="icon-list-add"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="controls">
      <span class="add" v-if="!noAdd" @click="add">
        <span class="hover-text">Add</span>
        <span class="caption">+</span>
      </span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ComponentList',
  props: {
    type: { type: String },
    noAdd: { type: Boolean },
    noDelete: { type: Boolean },
    value: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      data: [],
    };
  },

  watch: {
    data: {
      deep: true,
      handler(data) {
        this.$emit(
          'updated',
          data.map((item) => item.value),
        );
      },
    },
  },

  created() {
    this.data = this.value.map((value, index) => ({
      index: index,
      value: value,
      id: this.newId(),
    }));

    if (!this.value) {
      return console.warn('ComponentList: model not set');
    }
  },

  methods: {
    add() {
      this.data.push(this.newItem());
      this.reOrderIndexes();
    },

    addBelow(index) {
      if (index == this.data.length - 1) {
        return this.add();
      }

      this.data.splice(index + 1, 0, this.newItem());
      this.reOrderIndexes();
    },

    moveUp(index) {
      if (index == 0) return;
      this.move(index, index - 1);
    },

    moveDown(index) {
      if (index == this.data.length - 1) return;
      this.move(index, index + 1);
    },

    move(from, to) {
      this.data[to].index = from;
      this.data[from].index = to;
      this.data = this.data.sort((a, b) => a.index - b.index);
    },

    remove(index) {
      this.data = this.data.filter((item, n) => n != index);
    },

    newItem() {
      return {
        value: {},
        id: this.newId(),
      };
    },

    newId() {
      let { random, pow, floor } = Math;
      return floor(random() * pow(2, 32));
    },

    reOrderIndexes() {
      this.data.forEach((row, index) => {
        row.index = index;
      });
    },

    drag(event, item) {
      let itemIndex = item.index;

      let element = event.srcElement.parentNode;
      let clone = element.cloneNode(true);

      let dataToTransfer = JSON.stringify({ item: item.index });

      event.dataTransfer.setDragImage(element, 0, 0);

      // transfering data as json because there's an bug when
      // `dataToTransfer` is 0 because it's parsed to ""
      event.dataTransfer.setData('itemIndex', dataToTransfer);
    },

    drop(event, item) {
      let transferedData = event.dataTransfer.getData('itemIndex');
      if (!transferedData) return;

      let originIndex = JSON.parse(transferedData).item;
      let targetIndex = item.index;

      if (targetIndex != 0) {
        // add the moved index below the target
        this.data[originIndex].index = targetIndex + 0.5;
      } else {
        // if the target is the first one, move it as
        // second and place the moved to the first place
        this.data[originIndex].index = 0;
        this.data[targetIndex].index = 0.5;
      }

      // sort the array and enumarate it again with integer indexes
      this.data = this.data.sort((a, b) => a.index - b.index);
      this.reOrderIndexes();
    },

    allowDrop(e) {
      e.preventDefault();
    },
  },
};
</script>

<style lang="scss">
.item {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: flex-start;
  align-content: flex-start;

  min-height: 2rem;
}

.item-controls {
  align-self: stretch;
  vertical-align: middle;
  text-align: center;
  min-width: 2rem;
  padding: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    display: inline-block;
    cursor: pointer;
    font-size: 0.75rem;
  }

  &.left-aligned {
    text-align: left;
  }

  &.grayed {
    background-color: rgba(128, 128, 128, 10%);
    margin: 1px;
  }
}

.item-content {
  flex: 1 1 auto;
  padding: 0 0.5rem;
  align-self: stretch;
}

.controls {
  text-align: right;
}

.add {
  $color: #357edd;
  $size: 2rem;

  margin-right: 1rem;
  margin-top: 1rem;

  display: inline-block;
  color: white;
  border-radius: $size;
  min-width: $size;
  height: $size;
  text-align: center;
  cursor: pointer;
  box-shadow: 0px 0px 0px 3px $color inset;

  .hover-text {
    display: none;
    vertical-align: middle;
    padding-left: 1rem;
    padding-right: 0.5rem;
  }
  .caption {
    display: inline-block;
    background: $color;
    vertical-align: middle;
    border-radius: $size;
    font-size: 1rem;
    width: $size;
    line-height: $size;
    height: $size;
  }

  &:hover {
    background: white;

    .hover-text {
      display: inline-block;
      color: #666;
    }
  }
}

.drag-icon {
  display: inline-block;
  width: 16px;
  height: 8px;
  min-width: 16px;
  min-height: 8px;
}

.drag-icon,
.drag-icon::before {
  background-image: radial-gradient(gray 40%, transparent 40%);
  background-size: 4px 4px;
  background-position: 0 100%;
  background-repeat: repeat-x;
}

.drag-icon::before {
  content: '';
  display: block;
  width: 100%;
  height: 33%;
}
</style>
