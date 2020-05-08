<template>
  <section class="custom-feed">
    <div class="grid-x">

      <div class="cell medium-4">
        <label class="fg-color">
          <span>Title:</span>
          <input
            maxlength="100"
            type="text"
            class="fg-color bg-color"
            v-model="feed.title"
            @blur="validate('title')"
          />
        </label>
      </div>

      <div class="cell medium-4">
        <label class="fg-color">
          <span>RSS URL:</span>
          <input
            maxlength="150"
            type="text"
            class="fg-color bg-color"
            v-model="feed.url"
            onclick="this.select()"
            @blur="validate('url')"
          />
        </label>
      </div>

      <div class="cell medium-4">
        <label class="fg-color">
          <span>Icon URL:</span>
          <input
            maxlength="150"
            type="text"
            class="fg-color bg-color"
            v-model="feed.icon"
            onclick="this.select()"
            @blur="validate('icon')"
          />
        </label>
      </div>
    </div>

    <div v-if="feed.validations.title != 'VALID' && dirty.title">
      <small class="red">Add a Title</small>
    </div>

    <div v-if="feed.validations.icon != 'VALID' && dirty.icon">
      <small class="red">Add an Icon URL</small>
    </div>

    <div v-if="feed.validations.url != 'VALID' && dirty.url">
      <small v-if="feed.validations.url == 'EMPTY'" class="red">
        Add a RSS URL
      </small>
      <small v-if="feed.validations.url == 'INVALID'" class="red">
        Invalid RSS URL
      </small>
      <small v-if="feed.validations.url == 'VALIDATING'" class="green">
        <loading-animation type="tiny green" />
        Validating...
      </small>
    </div>

  </section>
</template>

<script>

import LoadingAnimation from '@/components/shared/loading-animation';
import Feed from '@/models/feed';

export default {
  name: 'CustomFeed',

  props: {
    value: { type: Object },
  },

  data() {
    return {
      rssStatus: '',

      feed: {
        title: '',
        icon: '',
        url: '',

        validations: {
          title: '',
          icon: '',
          url: '',
        }
      },

      dirty: {
        title: false,
        url: false,
        icon: false,
      },
    }
  },

  components: {
    LoadingAnimation,
  },

  mounted(p) {
    this.feed = new Feed(this.value);

    if (!this.feed.isEmpty()) {
      this.feed.markAsValid();
    }
  },

  methods: {
    touch(item) {
      this.dirty[item] = true;
    },

    validate(item) {
      this.touch(item);
      this.feed.validate(item)
        .then(validations => {
          this.$emit('input', this.feed);
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-feed {
    margin-bottom: 2rem;

    .grid-x {
      margin-right: -0.5rem;
      margin-left: -0.5rem;
    }
    label {
      padding: .5rem;
    }
    input {
      margin-bottom: 0;
    }

    .red {
      color: crimson;
      font-weight: bold;
    }

    .green {
      color: green;
      font-weight: bold;
    }
  }
</style>