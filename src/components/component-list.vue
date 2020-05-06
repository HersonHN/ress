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

      <div class="item">

        <div class="item-controls">
          <a class="icon"
              title="Move Up"
              @click="moveUp(index)">
            <i class="icon-up-open"></i>
          </a>
          <a class="icon"
              title="Delete"
              v-if="!item.required || !noDelete"
              @click="remove(index)">
            <i class="icon-minus-circled"></i>
          </a>
          <a class="icon"
              title="Move Down"
              @click="moveDown(index)">
            <i class="icon-down-open"></i>
          </a>
          <a class="icon"
              title="Add"
              v-if="!noAdd"
              @click="addBelow(index)">
            <i class="icon-list-add"></i>
          </a>
        </div>

        <div class="item-content">
            <slot :item="item"></slot>
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
        default: () => ([]),
      },
    },

    data() {
      return {
        data: []
      };
    },

    watch: {
      data: {
        deep: true,
        handler(data){
          this.$emit('input', data.map(item => item.value));
        },
      },
    },

    created() {
      this.data = this.value.map((value, index) => ({
        index: index,
        value: value,
        id: this.newId()
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
          id: this.newId()
        };
      },

      newId() {
        let { random, pow, floor} = Math;
        return floor(random() * pow(2, 32));
      },

      reOrderIndexes() {
        this.data.forEach((row, index) => {
          row.index = index;
        });
      },
    },
  }
</script>

<style lang="scss">

  .item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: stretch;
    align-items: stretch;
    margin-bottom: .5rem;
  }

  .icon {
    display: inline-block;
    margin: .25rem;
    cursor: pointer;
    font-size: .75rem;
  }

  .item-content {
    order: 0;
    flex: 1 1 auto;
    align-self: auto;
  }

  .item-controls {
    order: 0;
    flex: 0 1 auto;
    align-self: auto;
    text-align: center;
    align-self: center;
    margin-right: 1rem;
  }

  .controls {
    text-align: right;
  }

  .add {
    $color: #357edd;
    $size: 2rem;

    margin-right: 1rem;

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
      padding-right: .5rem;
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
</style>
