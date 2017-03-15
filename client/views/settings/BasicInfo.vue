<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-3">
        <article class="tile is-child box">
          <h4 class="title header-left">年级</h4>
          <button class="button header-right" @click="toggleShowAddGrade" >
            <p v-if="gradeBtnShow">新增</p>
            <p v-else>取消</p>
          </button>
          <table class="table is-striped" id="grades">
            <thead>
            <tr>
              <th>年级</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for='grade in grades'>
              <td v-text='grade.name'></td>
              <td><a href="javascript:" @click="removeGrade(grade.name)">删除</a></td>
            </tr>
            <tr class="add_grade_tr" :class="{add_grade_tr_not_show:gradeNotShow}">
              <td class="add_grade_td_1"><input class="input is-success addItem" type="text" placeholder="请输入年级" v-model="new_item" @keyup.enter="saveGrade(new_item)"></td>
              <td>
                <button class="button is-success addItem-btn" @click="saveGrade(new_item)">保存</button>
              </td>
            </tr>
            </tbody>
          </table>
        </article>
      </div>
      <div class="tile is-parent is-3">
        <article class="tile is-child box">
          <h4 class="title header-left">大类</h4>
          <button class="button header-right" @click="toggleShowAddCategory">
            <p v-if="categoryBtnShow">新增</p>
            <p v-else>取消</p>
          </button>
          <table class="table is-striped" id="categories">
            <thead>
            <tr>
              <th>大类名</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for='category in categories'>
              <td v-text='category.name'></td>
              <td><a href="javascript:" @click="removeCategory(category.name)">删除</a></td>
            </tr>
            <tr class="add_category_tr" :class="{add_category_tr_not_show:categoryNotShow}">
              <td class="add_category_td_1">
                <input class="input is-success addItem" type="text" placeholder="请输入大类" v-model="new_item" @keyup.enter="saveCategory(new_item)">
              </td>
              <td>
                <button class="button is-success addItem-btn" @click="saveCategory(new_item)">保存</button>
              </td>
            </tr>
            </tbody>
          </table>
        </article>
      </div>
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title header-left">专业</h4>
          <button class="button header-right" @click="toggleShowAddMajor">
            <p v-if="majorBtnShow">新增</p>
            <p v-else>取消</p>
          </button>
          <table class="table is-striped" id="majors">
            <thead>
            <tr>
              <th>专业名</th>
              <th>所属大类</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for='major in majors'>
              <td v-text='major.name'></td>
              <td v-text='major.category'></td>
              <td><a href="javascript:" @click="removeMajor(major.name)">删除</a></td>
            </tr>
            <tr class="add_major_tr" :class="{add_major_tr_not_show:majorNotShow}">
              <td class="add_major_td_1"><input class="input is-success addItem" type="text" placeholder="请输入专业" v-model="new_item" @keyup.enter="saveMajor(new_item)"></td>
              <td class="add_major_td_2">
                <p class="control">
                  <span class="select">
                    <select v-model="category_choose">
                      <option v-for='category in categories' v-text="category.name"></option>
                    </select>
                  </span>
                </p>
              </td>
              <td>
                <button class="button is-success addItem-btn" @click="saveMajor(new_item)">保存</button>
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
        grades: [],
        categories: [],
        majors: [],
        new_item : '',
        gradeNotShow : true,
        categoryNotShow : true,
        majorNotShow : true,
        gradeBtnShow : true,
        categoryBtnShow : true,
        majorBtnShow : true,
        category_choose : ''
      }
    },
    methods: {
      getGrades: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'GRADE'}).then(response => {
            this.grades = response.data.systemInfoList
        })
      },
      getCategories: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'CATEGORY'}).then(response => {
            this.categories = response.data.systemInfoList
        })
      },
      getMajors: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'MAJOR'}).then(response => {
            this.majors = response.data.systemInfoList
        })
      },
      toggleShowAddGrade: function () {
        this.new_item = ''
        this.gradeNotShow = !this.gradeNotShow
        this.categoryNotShow = true
        this.majorNotShow = true
        this.gradeBtnShow = !this.gradeBtnShow
        this.categoryBtnShow = true
        this.majorBtnShow = true
      },
      toggleShowAddCategory: function () {
        this.new_item = ''
        this.categoryNotShow = !this.categoryNotShow
        this.gradeNotShow = true
        this.majorNotShow = true
        this.categoryBtnShow = !this.categoryBtnShow
        this.majorBtnShow = true
        this.gradeBtnShow = true
      },
      toggleShowAddMajor: function () {
        this.new_item = ''
        this.majorNotShow = !this.majorNotShow
        this.gradeNotShow = true
        this.categoryNotShow = true
        this.majorBtnShow = !this.majorBtnShow
        this.categoryBtnShow = true
        this.gradeBtnShow = true
      },
      saveGrade: function (new_item) {
        if (new_item === '') {
          alert("请输入年级！");
          return;
        }
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/grade/add?ss=' + ss, {'grade': new_item}).then(response => {
            if (response.data.retCode === 0) {
                this.getGrades()
                this.successMsg("新增成功！");
            } else {
                this.errorMsg('新增失败！');
            }
        })
        this.gradeNotShow = true
        this.gradeBtnShow = true
        this.new_item = ''

      },
      saveCategory: function (new_item) {
        if (new_item === '') {
          alert("请输入专业大类！");
          return;
        }
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/category/add?ss=' + ss, {'name': new_item}).then(response => {
            if (response.data.retCode === 0) {
                this.getCategories()
                this.successMsg("新增成功！");
            } else {
                this.errorMsg('新增失败！');
            }
        })
        this.categoryNotShow = true
        this.categoryBtnShow = true
        this.new_item = ''
      },
      saveMajor: function (new_item) {
        if (new_item === '') {
          alert("请输入专业！");
          return;
        }

        if (this.category_choose === '') {
          alert('请选择专业大类！');
          return;
        }
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/major/add?ss=' + ss, {'name': new_item, 'category': this.category_choose}).then(response => {
            if (response.data.retCode === 0) {
                this.getMajors()
                this.successMsg("新增成功！");
            } else {
                this.errorMsg('新增失败！');
            }
        })
        this.majorNotShow = true
        this.majorBtnShow = true
        this.new_item = ''
        this.category_choose = ''
      },
      removeGrade: function (grade) {
        this.$confirm('此操作将永久删除该年级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/delete?ss=' + ss, {'type': 'GRADE', "name": grade}).then(response => {
            if (response.data.retCode == 0) {
                this.getGrades()
                this.successMsg("删除成功！");
            } else {
                this.errorMsg('删除失败！');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      removeCategory: function (category) {
        this.$confirm('此操作将永久删除该大类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/delete?ss=' + ss, {'type': 'CATEGORY', "name": category}).then(response => {
            if (response.data.retCode == 0) {
                this.getCategories()
                this.successMsg("删除成功！");
            } else {
                this.errorMsg('删除失败！');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      removeMajor: function (major) {
        this.$confirm('此操作将永久删除该专业, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.post('http://127.0.0.1:8888/jg/v/system/systemInfo/delete?ss=' + ss, {'type': 'MAJOR', "name": major}).then(response => {
              if (response.data.retCode == 0) {
                  this.getMajors()
                  this.successMsg("删除成功！");
              } else {
                  this.errorMsg('删除失败！');
              }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      chooseCategory: function (id) {
        alert(id);
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
      this.getGrades()
      this.getCategories()
      this.getMajors()
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

  .add_grade_tr_not_show {
    display: none;
  }

  .add_category_tr_not_show {
    display: none;
  }

  .add_major_tr_not_show {
    display: none;
  }

  .add_category_td_1 {
    width: 188px;
  }

  .add_grade_td_1 {
    width: 131px;
  }

  .add_major_td_1 {
    width: 157px;
  }

  .add_major_td_2 {
    width: 303px;
  }

</style>


