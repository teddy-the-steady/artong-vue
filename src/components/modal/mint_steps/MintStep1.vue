<template>
  <div class="container">
    <span class="float-label">
      <input
        id="name"
        type="text"
        :class="{ filled: name }"
        v-model="name"
        maxlength="100"
        @input="onInputName"
      />
      <label for="name">{{ $t('views.project.mint-modal.input.name') }}</label>
    </span>
    <span class="float-label">
      <textarea
        id="text"
        type="text"
        :class="{ filled: description }"
        v-model="description"
        maxlength="1000"
        @input="onInputDescription"
      />
      <label for="text">
        {{ $t('views.project.mint-modal.input.description') }}
      </label>
    </span>
  </div>
</template>

<script>
export default {
  name: 'MintStep1',
  data() {
    return {
      name: '',
      description: '',
    }
  },
  props: {},
  methods: {
    onInputName() {
      this.$emit('data-from-step1', 'name', this.name)
    },
    onInputDescription() {
      this.$emit('data-from-step1', 'description', this.description)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variables';
.container {
  text-align: left;
  margin-top: 20px;
  .float-label {
    margin-bottom: 30px;

    :first-child {
      width: 100%;
    }

    textarea {
      resize: vertical;
      max-height: 200px;
    }
  }
}
.noVal:focus {
  border-color: red;
}
</style>
