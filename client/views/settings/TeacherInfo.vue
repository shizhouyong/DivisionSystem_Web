<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">教师信息</h4>

          <table class="table is-striped">
            <thead>
            <tr>
              <th>教工号</th>
              <th>所属部门</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>20061657</td>
              <td>学工办</td>
              <td><a href="#">修改</a>|<a href="#">删除</a></td>
            </tr>
            </tbody>
          </table>
        </article>
      </div>
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title header-left">部门</h4>
          <button class="button header-right" @click="toggleShowAddPosition" >
            <p v-if="positionBtnShow">新增</p>
            <p v-else>取消</p>
          </button>
          <table class="table is-striped">
            <thead>
            <tr>
              <th>部门名</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for='position in positions'>
              <td v-text='position.name'></td>
              <td><a href="javascript:" @click="removePosition(position.name)">删除</a></td>
            </tr>
            <tr class="add_position_tr" :class="{add_position_tr_not_show:positionNotShow}">
              <td><input class="input is-success addItem" type="text" placeholder="请输入职务部门" v-model="new_item" @keyup.enter="savePosition(new_item)"></td>
              <td>
                <button class="button is-success addItem-btn" @click="savePosition(new_item)">保存</button>
              </td>
            </tr>
            </tbody>
          </table>
        </article>
      </div>
    </div>
  </div>

</template>

<script>
  import Vue from 'vue'
  import Message from 'vue-bulma-message'
  const MessageComponent = Vue.extend(Message)

  const openMessage = (propsData = {
    title: '',
    message: '',
    type: '',
    direction: '',
    duration: 1500,
    container: '.messages'
  }) => {
    return new MessageComponent({
      el: document.createElement('div'),
      propsData
    })
  }

  export default{
    components: {
      Message
    },
    data () {
      return {
        positions: [],
        new_item : '',
        positionNotShow : true,
        positionBtnShow : true
      }
    },
    methods: {
      getPositions: function () {
        this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/get', {'type': 'POSITION'}).then(response => {
            this.positions = response.data.systemInfoList
        })
      },
      toggleShowAddPosition: function () {
        this.new_item = null
        this.positionNotShow = !this.positionNotShow
        this.positionBtnShow = !this.positionBtnShow
      },
      savePosition: function (new_item) {
        this.$http.post('http://127.0.0.1:8888/jg/v/system/position/add', {'name': new_item}).then(response => {
            if (response.data.retCode === 0) {
                this.getPositions()
                this.openAddMessage('success')
            } else {
                this.openAddMessage('warning')
            }
        })
        this.positionNotShow = true
        this.positionBtnShow = true
        this.new_item = null

      },
      removePosition: function (position) {
        confirm("是否删除年级："+position)
        this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/delete', {'type': 'POSITION', "name": position}).then(response => {
            if (response.data.retCode == 0) {
                this.getPositions()
                this.openDeleteMessage('success')
            } else {
                this.openDeleteMessage('warning')
            }
        })
      },
      openAddMessage (type) {
        if (type === 'success') {
          openMessage({
            title : '消息',
            message : '添加成功!',
            type : type
          })
        } else {
          openMessage({
            title : '消息',
            message : '添加失败!',
            type : type
          })
        }
      },
      openDeleteMessage (type) {
        if (type === 'success') {
          openMessage({
            title : '消息',
            message : '删除成功!',
            type : type
          })
        } else {
          openMessage({
            title : '消息',
            message : '删除失败!',
            type : type
          })
        }
      }
    },
    created: function() {
      this.getPositions()
    }
  }
</script>

<style lang="scss">
  .table-responsive {
    display: block;
    width: 100%;
    min-height: .01%;
    overflow-x: auto;
  }

  .header-left {
    float: left;
  }

  .header-right {
    float: right;
  }

  .addItem {
    margin-left: -8px;
  }

  .add_position_tr_not_show {
    display: none;
  }

  .add_position_tr>td{
    width: 148px;
  }

</style>

