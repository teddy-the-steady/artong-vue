<template>
  <div>
    <div>
      <span>Name</span>
      <input
        type="text"
        v-model="name"
        placeholder="name"
        @input="onInputName"
      />
    </div>
    <div>
      <span>Description</span>
      <input
        type="text"
        v-model="description"
        placeholder="description"
        @input="onInputDescription"
      />
    </div>
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
