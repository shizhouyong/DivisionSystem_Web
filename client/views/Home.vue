<template>
  <div>
    欢迎回来！
    <modal :visible="showModal" @close="closeModalBasic"></modal>
  </div>
</template>

<script>
import Vue from 'vue'
import Store from './store'
import Modal from './Login'


export default {
  components: {
    Modal
  },

  data () {
    return {
      showModal: true,
      limit: 0
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

  watch: {
    showModal () {
      this.limit = Store.fetchLimit()
      if(this.limit === 3) {
        location.href = "http://division.front:8080/#/volunteer/fill";
      } else if (this.limit === 7) {
        location.href = "http://division.front:8080/#/stuInfo/now";
      }
    }
  },

  created () {
    this.limit = Store.fetchLimit()
    if(this.limit === 3) {
      window.location.reload();
      location.href = "http://division.front:8080/#/volunteer/fill";
    } else if (this.limit === 7) {
      window.location.reload();
      location.href = "http://division.front:8080/#/stuInfo/now";
    }
  }

}
</script>
<style lang="scss" scoped>
.is-title {
  text-transform: capitalize;
}
</style>
