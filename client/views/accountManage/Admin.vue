<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="block">
                <el-form :model="selectForm" ref="selectForm" label-width="60px" class="demo-dynamic">
                  <el-row :gutter="24">
                    <el-col :span="5">
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="selectForm.name" placeholder="请输入姓名"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">
                      <el-button type="primary" @click="query">查询</el-button>
                    </el-col>
                    <el-col :span="7">
                      <el-button type="primary" @click="addAdmin">新增账户</el-button>
                      <el-button type="success" @click="activate">激活</el-button>
                      <el-button type="warning" @click="forbbid">禁止</el-button>
                    </el-col>
                  </el-row>
                </el-form>
            <el-table :data="teachers" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中">
              <el-table-column type="selection" width="45"/>
              <el-table-column prop="number" label="学工号" sortable/>
              <el-table-column prop="name" label="姓名"/>
              <el-table-column prop="limit" label="状态" :formatter="formatLimit"/>
              <el-table-column prop="createTime" label="账号生成时间" :formatter="formatDate"/>
              <el-table-column label="操作" width="120">
                <template scope="scope">
                  <el-button type="text" size="small" @click="modifyAdmin(scope.row)">修改</el-button>
                  <el-button type="text" size="small" @click="deleteTeacher(scope.row.number)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <ul class="pagination" >
              <li v-show="current != 1" @click="current-- && goto(current--)" ><a href="javascript:">上一页</a></li>
              <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                <a href="javascript:" >{{index}}</a>
              </li>
              <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a href="javascript:" >下一页</a></li>
            </ul>
          </div>

        </article>
      </div>
    </div>
    <modal :visible="showModal" :teacher="teacher_edit" :modalTitle="modalTitle" @close="closeModalBasic"></modal>
  </div>
</template>

<script>
import Vue from 'vue'
import Store from '../store'
import Modal from './AdminModal'


export default {
  components: {
    Modal
  },

  data:function(){
    return{
      current:1,
      showItem:15,
      allpage:1,
      teachers: [],
      teacher_edit: {},
      modalTitle: '',
      multipleSelection: [],
      selectForm: {
        name: ''
      },
      showModal: false,
      loading: true
    }
  },
  computed:{
    pages:function(){
      var pag = [];
        if( this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
             //总页数和要显示的条数那个大就显示多少条
             var i = Math.min(this.showItem,this.allpage);
             while(i){
                 pag.unshift(i--);
             }
         }else{ //当前页数大于显示页数了
             var middle = this.current - Math.floor(this.showItem / 2 ),//从哪里开始
                 i = this.showItem;
             if( middle >  (this.allpage - this.showItem)  ){
                 middle = (this.allpage - this.showItem) + 1
             }
             while(i--){
                 pag.push( middle++ );
             }
         }
       return pag
     }
  },
  methods:{
    goto:function(index){
      if(index == this.current) return;
        this.current = index;
        //这里可以发送ajax请求
      this.getStudents(index);
    },
    getTeachers: function () {
      this.loading = true
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/system/teacher/list?ss=' + ss, {'name': this.selectForm.name}).then(response => {
          this.teachers = response.data.teacherList
          this.loading = false
      })

    },
    addAdmin: function() {
      this.teacher_edit = {};
      this.modalTitle = "新增";
      this.showModal = true;
    },
    activate () {
      let numberList = this.numberList
      if (numberList.length === 0) {
        this.$message({
          message: '请至少选择一个用户！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('此操作将批量激活管理员用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ss = Store.fetchSession();
        this.$http.post('http://division.backend:8888/jg/v/system/account/update/limit?ss=' + ss, {'numberList': this.numberList, 'limit': 5}).then(response => {
          if (response.data.retCode == 0) {
              this.getTeachers(1);
              this.successMsg("激活成功！");
          } else {
              this.errorMsg('激活失败！');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消激活'
        });
      });
    },
    forbbid () {
      let numberList = this.numberList
      if (numberList.length === 0) {
        this.$message({
          message: '请至少选择一个用户！',
          type: 'warning'
        });
        return;
      }
      this.$confirm('此操作将批量禁止管理员用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ss = Store.fetchSession();
        this.$http.post('http://division.backend:8888/jg/v/system/account/update/limit?ss=' + ss, {'numberList': this.numberList, 'limit': -1}).then(response => {
          if (response.data.retCode == 0) {
              this.successMsg("禁止成功！");
              this.getTeachers(1);
          } else {
              this.errorMsg('禁止失败！');
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消禁止'
        });
      });
    },
    modifyAdmin: function (teacher) {
      let e_teacher = JSON.parse(JSON.stringify(teacher));
      this.teacher_edit = e_teacher;
      this.modalTitle = "修改";
      this.showModal = true;
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let numberList = []
      for (var i = 0;i < val.length;i++) {
        numberList.push(val[i].number)
      }
      this.numberList = numberList
    },
    query() {
      this.getTeachers()
    },
    openModalBasic () {
      this.showModal = true
    },

    closeModalBasic () {
      this.showModal = false
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
    },
    formatDate: function (row, column) {
      var createTime = new Date();
      createTime.setTime(row.createTime * 1000);
      return createTime.toLocaleString();
    },
    formatLimit: function (row, column) {
      return row.limit >= 5 ? '已激活' : '未激活';
    },
  },
  watch: {
    showModal () {
      if(!this.showModal) {
        this.getTeachers()
      }
    }
  },
  created: function() {
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
  .tile.is-child {
    width: 100%;
  }

  .collapse_header {
    margin-bottom: 10px;
  }

  .pagination {
    position: relative;

  }
  .pagination li{
    display: inline-block;
    margin:0 5px;
  }
  .pagination li a{
    padding:.5rem 1rem;
    display:inline-block;
    border:1px solid #ddd;
    background:#fff;
    color:#1ACBA3;
  }
  .pagination li a:hover{
    background:#eee;
  }
  .pagination li.active a{
    background:#1ACBA3;
    color:#fff;
  }

  .el-form-item-my {
    margin-bottom: 10px;
  }
</style>
