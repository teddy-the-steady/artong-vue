<template>
  <div>
    <div>{{ hour + ':' + min + ':' + sec }}</div>
  </div>
</template>

<script>
export default {
  name: 'CountDownTimer',
  props: {
    endDate: {
      type: Date,
      default() {
        return new Date()
      },
    },
    negative: {
      type: Boolean,
      default: false,
    },
    isFirstLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hour() {
      let h = Math.trunc((this.endDate - this.now) / 1000 / 3600)
      if (h < 0) {
        return '00'
      }
      return h > 9 ? h : '0' + h
    },
    min() {
      let m = Math.trunc((this.endDate - this.now) / 1000 / 60) % 60
      if (m < 0) {
        return '00'
      }
      return m > 9 ? m : '0' + m
    },
    sec() {
      let s = Math.trunc((this.endDate - this.now) / 1000) % 60
      if (s < 0) {
        return '00'
      }
      return s > 9 ? s : '0' + s
    },
  },
  data() {
    return {
      now: new Date(),
      timer: null,
    }
  },
  watch: {
    endDate: {
      immediate: true,
      handler(newVal) {
        if (this.timer) {
          clearInterval(this.timer)
        }
        this.timer = setInterval(() => {
          this.now = new Date()
          if (this.negative) {
            return
          }
          if (this.now > newVal) {
            this.now = newVal
            this.$emit('endTime')
            clearInterval(this.timer)
          }
        }, 1000)
      },
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>
