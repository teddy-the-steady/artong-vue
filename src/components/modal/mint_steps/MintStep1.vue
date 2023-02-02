<template>
  <div class="container">
    <div>
      <span>Name</span>
      <input
        id="name"
        type="text"
        v-model="name"
        placeholder="name"
        maxlength="100"
        @input="onInputName"
        @focusout="focusout('name')"
      />
    </div>
    <div>
      <span>Description</span>
      <input
        id="text"
        type="text"
        v-model="description"
        placeholder="description"
        maxlength="100"
        @input="onInputDescription"
        @focusout="focusout('text')"
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
  props: {},
  methods: {
    onInputName() {
      this.$emit('data-from-step1', 'name', this.name)
    },
    onInputDescription() {
      this.$emit('data-from-step1', 'description', this.description)
    },
    focusout(id) {
      if (id === 'name' && this.name.length === 0) {
        document.getElementById('name').placeholder = 'should enter name'
        document.getElementById('name').focus()
      } else if (id === 'text' && this.description.length === 0) {
        document.getElementById('text').placeholder = 'should enter description'
        document.getElementById('text').focus()
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import '../../../assets/scss/variables';
.container {
  text-align: left;
  #name {
    margin-left: 85px;
    margin-bottom: 20px;
  }
  #text {
    margin-left: 52px;
  }
}
.noVal:focus {
  border-color: red;
}
</style>
