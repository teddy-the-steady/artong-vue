<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <form @submit.prevent="submitReport">
            <div class="modal-header">
              <slot name="header">
                <div>{{ $t('views.report.report-title') }}</div>
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                <section class="section">
                  <input
                    class="list"
                    type="radio"
                    id="inappropriate"
                    v-model="reportType"
                    value="INAPPROPRIATE"
                  />
                  <label for="inappropriate">{{
                    $t('views.report.report-options.first')
                  }}</label>
                  <br />
                  <input
                    class="list"
                    type="radio"
                    id="rights"
                    v-model="reportType"
                    value="RIGHTS"
                  /><label for="rights">{{
                    $t('views.report.report-options.second')
                  }}</label>
                  <br />
                  <input
                    class="list"
                    type="radio"
                    id="others"
                    v-model="reportType"
                    value="etc"
                  /><label for="others">{{
                    $t('views.report.report-options.last.etc')
                  }}</label>
                  <br />
                </section>

                <div class="description_body" v-if="reportType === 'etc'">
                  <label for="description">{{
                    $t('views.report.report-options.last.description')
                  }}</label>
                  <br />
                  <textarea id="description" v-model="description"></textarea>
                </div>
              </slot>
            </div>

            <div class="modal-footer">
              <slot name="footer">
                <button
                  class="modal-button"
                  type="cancel"
                  @click="onCancelClick"
                >
                  {{ $t('views.report.cancel') }}
                </button>
                <button
                  class="modal-button"
                  type="submit"
                  @click="onButtonClick"
                >
                  {{ $t('views.report.report') }}
                </button>
              </slot>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ReportModal',
  data() {
    return {
      reportType: null,
      description: null,
    }
  },
  computed: {
    ...mapState({
      isReportModalOpen: state => state.menu.isReportModalOpen,
    }),
  },
  methods: {
    onCancelClick() {
      if (this.reportType !== null) {
        this.$store.commit('TOGGLE_REPORT_MODAL')
      }
    },
    onButtonClick() {
      if (this.reportType === null) {
        alert(this.$t('views.report.report-select'))
      }
    },
    submitReport() {
      const reportData = {
        reportType: this.reportType,
        description: this.description,
      }
      if (reportData.reportType !== null) {
        if (
          this.isReportModalOpen &&
          confirm(this.$t('views.report.report-ask'))
        ) {
          if (this.reportType === 'etc' && this.description === null) {
            alert(this.$t('views.report.report-options.last.description'))
          } else {
            this.$store.commit('TOGGLE_REPORT_MODAL')
            this.$emit('submit', reportData)
          }
        }
      } else {
        this.$store.commit('TOGGLE_REPORT_MODAL')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.modal-mask {
  position: fixed;
  float: left;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $backdrop;
  display: table;
  transition: opacity 0.3s ease;

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;

    .modal-container {
      width: 30vw;
      max-width: 500px;
      margin: 10px auto;
      padding: 20px 30px;
      background-color: $artong-white;
      border-radius: 2px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
      transition: all 0.3s ease;
      border-radius: 20px;

      .modal-header {
        float: center;
        font-size: x-large;
        color: $darkgray;
      }

      .modal-body {
        margin: 20px 10px;
        font-size: large;
        text-align: left;

        .section {
          margin: 10px 0px;

          .list {
            margin: 10px 5px;
          }
        }
        .description_body {
          display: grid;
          position: relative;

          textarea {
            position: relative;
            width: auto;
            height: 30px;
          }
        }
      }

      .modal-footer {
        margin: auto;
        width: auto;
        .modal-button {
          margin: 10px 5px;
        }
      }
    }
  }
}

.modal-enter {
  opacity: 100;
}

.modal-leave-active {
  opacity: 0;
}

.text-left {
  text-align: left;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

@media only screen and (max-width: 599px) {
  .modal-mask {
    .modal-wrapper {
      .modal-container {
        width: 70vw;
        .modal-body {
          textarea {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
