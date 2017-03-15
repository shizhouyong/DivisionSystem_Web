<template>
  <div>
    欢迎回来！
    <modal :visible="showModal" @close="closeModalBasic"></modal>
  </div>
</template>

<script>
import Vue from 'vue'
import Modal from './Login'

export default {
  components: {
    Modal
  },

  data () {
    return {
      showModal: true,
    }
  },

  methods: {
    openModalBasic () {
      this.showModal = true
    },

    closeModalBasic () {
      this.showModal = false
    },
  },

}
</script>
<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
