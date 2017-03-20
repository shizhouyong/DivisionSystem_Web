<template>
  <section class="hero is-bold app-navbar animated" :class="{ slideInDown: show, slideOutDown: !show }">
    <div class="hero-head">
      <nav class="nav">
        <div class="nav-left">
          <el-col :span="8" :offset="1">
            <img src="../../assets/sys_logo.png" class="nav_sys_logo">
          </el-col>
        </div>
        <div class="nav-center">
          <!--<a class="nav-item hero-brand" href="/">-->
          <!--<img src="~assets/logo.svg" :alt="pkginfo.description">-->
          <!--<tooltip :label="'v' + pkginfo.version" placement="right" type="success" size="small" :no-animate="true" :always="true" :rounded="true">-->
          <!--<div class="is-hidden-mobile">-->
          <!--<span class="vue">Vue</span><strong class="admin">Admin</strong>-->
          <!--</div>-->
          <!--</tooltip>-->
          <!--</a>-->
        </div>

        <div class="nav-right is-flex">
          <div>
            <div class="block login_bar">
              <div class="control is-horizontal">
                <div class="control-label">
                  <label class="label">{{name}}</label>
                </div>
                <div class="btn_login">
                  <button class="button" @click="logout">登出</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </section>
</template>

<script>
import Tooltip from 'vue-bulma-tooltip'
import { mapGetters, mapActions } from 'vuex'
import Store from '../../views/store'

export default {

  components: {
    Tooltip
  },

  data () {
    return {
      name: ''
    }
  },

  props: {
    show: Boolean
  },

  computed: mapGetters({
    pkginfo: 'pkg',
    sidebar: 'sidebar'
  }),

  methods: {
    ...mapActions([
      'toggleSidebar'
    ]),
    getName() {
      this.name = Store.fetchName()
    },
    logout () {
      Store.clear()
      location.href="http://division.front:8080/#/"
    }
  },

  created () {
    this.getName()
  }

}

</script>

<style lang="scss">
  @import '~bulma/sass/utilities/variables';

  .app-navbar {
    position: fixed;
    min-width: 100%;
    z-index: 1024;
    box-shadow: 0 2px 3px rgba(17, 17, 17, 0.1), 0 0 0 1px rgba(17, 17, 17, 0.1);

    .container {
      margin: auto 10px;
    }

    .nav-right {
      align-items: stretch;
      flex: 1;
      justify-content: flex-end;
      overflow: hidden;
      overflow-x: auto;
      white-space: nowrap;
    }
  }

  .hero-brand {
    .vue {
      margin-left: 10px;
      color: #36AC70;
    }
    .admin {
      color: #28374B;
    }
  }

  .login_bar {
    margin-top: 8px;
    margin-right: 20px;
  }

  .btn_login {
    margin-left: 20px;
  }

  .nav_sys_logo {
    margin-top: 4px;
    height: 46px!important;
  }
</style>
