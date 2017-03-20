<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title header-left">教师信息</h4>
          <button class="button header-right" @click="toggleShowAddTeacher" >
            <p v-if="teacherBtnShow">新增</p>
            <p v-else>取消</p>
          </button>
          <table class="table is-striped">
            <thead>
            <tr>
              <th>教工号</th>
              <th>姓名</th>
              <th>所属部门</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for='teacher in teachers'>
              <td v-text='teacher.number'></td>
              <td v-text='teacher.name'></td>
              <td v-text='teacher.position'>学工办</td>
              <td>
                <a href="javascript:" @click="modifyTeacher_in(teacher)">修改</a>|
                <a href="javascript:" @click="deleteTeacher(teacher.number)">删除</a>
              </td>
            </tr>
            <tr class="add_teacher_tr" :class="{add_teacher_tr_not_show:teacherNotShow}">
              <td>
                <input class="input is-success addItem" type="text" v-model="new_teacher.number"
                       :disabled="unableTeacInput">
              </td>
              <td>
                <input class="input is-success addItem" type="text" placeholder="请输入教师姓名" v-model="new_teacher.name">
              </td>
              <td>
                <p class="control">
                  <span class="select">
                    <select v-model="new_teacher.position">
                      <option v-for='position in positions' v-text="position.name"></option>
                    </select>
                  </span>
                </p>
              </td>
              <td>
                <button class="button is-success addItem-btn" @click="addTeacher" v-if="!unableTeacInput">保存</button>
                <button class="button is-success addItem-btn" @click="modifyTeacher" v-if="unableTeacInput">更新</button>
              </td>
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
              <td>
                <input class="input is-success addItem" type="text" placeholder="请输入部门名字" v-model="new_teacher.name" @keyup.enter="saveTeacher(new_teacher)">
              </td>
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
  import Store from '../store'

  export default{
    data () {
      return {
        positions: [],
        teachers: [],
        new_teacher: '',
        new_item : '',
        unableTeacInput : false,
        positionNotShow : true,
        positionBtnShow : true,
        teacherNotShow : true,
        teacherBtnShow : true
      }
    },
    methods: {
      getPositions: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://division.backend:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'POSITION'}).then(response => {
            this.positions = response.data.systemInfoList
        })
      },
      getTeachers: function () {
        var ss = Store.fetchSession();
        this.$http.get('http://division.backend:8888/jg/v/system/teacher/list?ss=' + ss).then(response => {
            this.teachers = response.data.teacherList
        })
      },
      modifyTeacher_in: function (teacher) {
        this.unableTeacInput = true
        this.new_teacher = JSON.parse(JSON.stringify(teacher))
        this.teacherNotShow = false
        this.teacherBtnShow = false
      },
      modifyTeacher: function () {
        this.$prompt('请完善信息', '修改教师信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      deleteTeacher: function (number) {
        this.$confirm('此操作将永久删除该老师信息,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.get('http://division.backend:8888/jg/v/system/teacher/delete/'+ number +'?ss=' + ss).then(response => {
              if (response.data.retCode == 0) {
                  this.getTeachers();
                  this.successMsg('删除教师信息成功！');
              } else {
                  this.errorMsg('删除教师信息失败！');
              }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      toggleShowAddPosition: function () {
        this.new_item = null
        this.positionNotShow = !this.positionNotShow
        this.positionBtnShow = !this.positionBtnShow
      },
      toggleShowAddTeacher: function () {
        this.teacherNotShow = !this.teacherNotShow
        this.teacherBtnShow = !this.teacherBtnShow
        this.unableTeacInput = false
        var teacher = {
          'number':'',
          'name':'',
          'position':''
        }
        this.new_teacher = JSON.parse(JSON.stringify(teacher))
      },
      addTeacher: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://division.backend:8888/jg/v/system/teacher/add?ss=' + ss,
          {'name': this.new_teacher.name,'number': this.new_teacher.number, 'position': this.new_teacher.position}).then(response => {
            if (response.data.retCode === 0) {
                this.getTeachers()
                this.successMsg('添加教师成功！');
            } else {
                this.errorMsg('添加教师失败！')
            }
        })
        this.new_teacher = ''
        this.unableTeacInput = false
        this.teacherNotShow = true,
        this.teacherBtnShow = true
      },
      modifyTeacher: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://division.backend:8888/jg/v/system/teacher/update?ss=' + ss,
          {'name': this.new_teacher.name,'number': this.new_teacher.number, 'position': this.new_teacher.position}).then(response => {
            if (response.data.retCode === 0) {
                this.getTeachers()
                this.successMsg('更新教师成功！');
            } else {
                this.errorMsg('更新教师失败！')
            }
        })
        this.new_teacher = ''
        this.unableTeacInput = false
        this.teacherNotShow = true,
        this.teacherBtnShow = true
      },
      savePosition: function (new_item) {
        var ss = Store.fetchSession();
        this.$http.post('http://division.backend:8888/jg/v/system/position/add?ss=' + ss, {'name': new_item}).then(response => {
            if (response.data.retCode === 0) {
                this.getPositions();
                this.successMsg('新增部门成功！');
            } else {
                this.errorMsg('新增部门失败！')
            }
        })
        this.positionNotShow = true
        this.positionBtnShow = true
        this.new_item = null

      },
      removePosition: function (position) {
        this.$confirm('此操作将永久删除该部门,是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.post('http://division.backend:8888/jg/v/system/systemInfo/delete?ss=' + ss, {'type': 'POSITION', "name": position}).then(response => {
              if (response.data.retCode == 0) {
                  this.getPositions();
                  this.successMsg('删除部门成功！');
              } else {
                  this.errorMsg('删除部门失败！');
              }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      successMsg(msg) {
        this.$notify({
          title: '成功',
          message: msg,
          type: 'success'
        });
      },
      errorMsg(msg) {
        this.$notify.error({
          title: '错误',
          message: msg
        });
      }
    },
    created: function() {
      this.getPositions()
      this.getTeachers()
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

  .add_teacher_tr_not_show {
    display: none;
  }

  .add_teacher_tr>td{
    width: 148px;
  }

</style>

