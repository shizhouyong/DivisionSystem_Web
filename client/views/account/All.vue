<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="block">
            <el-collapse class="collapse_header">
              <el-collapse-item title="控制台">
                <el-form :model="selectForm" ref="selectForm" label-width="80px" class="demo-dynamic">
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <el-form-item label="学号" prop="number">
                        <el-input v-model="selectForm.number" placeholder="请输入学号" @blur="getAccounts(1)"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="selectForm.name" placeholder="请输入姓名" @blur="getAccounts(1)"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="原班级" prop="originalClass">
                        <el-input v-model="selectForm.originalClass" placeholder="请输入原班级" @blur="getAccounts(1)"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="生源地" prop="stuFrom">
                        <el-input v-model="selectForm.stuFrom" placeholder="请输入生源地" @blur="getAccounts(1)"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <el-form-item label="大类" prop="category">
                        <el-select v-model="selectForm.category" placeholder="请选择大类" @change="getAccounts(1)" >
                          <el-option
                            v-for="category in categories"
                            :label="category.name"
                            :value="category.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="年级" prop="grade">
                        <el-select v-model="selectForm.grade" placeholder="请选择年级" @change="getAccounts(1)">
                          <el-option
                            v-for="grade in grades"
                            :label="grade.name"
                            :value="grade.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="文理科" prop="division">
                        <el-select v-model="selectForm.division" placeholder="请选择文理科" @change="getAccounts(1)">
                          <el-option label="文科" value="1"></el-option>
                          <el-option label="理科" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="性别" prop="sex">
                        <el-select v-model="selectForm.sex" placeholder="请选择性别" @change="getAccounts(1)">
                          <el-option label="男" value="M"></el-option>
                          <el-option label="女" value="F"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <el-form-item label="账号状态" prop="limit">
                        <el-select v-model="selectForm.limit" placeholder="请选择账号状态" @change="getAccounts(1)">
                          <el-option label="激活" value="1"></el-option>
                          <el-option label="禁止" value="-1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="每页个数" prop="eachNum">
                        <el-select v-model="selectForm.eachNum" placeholder="每页显示个数" @change="changeEachNum">
                          <el-option label="15" value="15"></el-option>
                          <el-option label="50" value="50"></el-option>
                          <el-option label="200" value="200"></el-option>
                          <el-option label="1000" value="1000"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="7" :offset="1">
                        <el-button type="success" @click="activate">激活</el-button>
                        <el-button type="warning" @click="forbbid">禁止</el-button>
                        <el-button type="danger" @click="batchDelete">删除</el-button>
                    </el-col>
                    <el-col :span="2" :offset="1">
                        <el-button @click="resetForm('selectForm')">重置</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-table :data="accounts" border style="width: 100%" @selection-change="handleSelectionChange" v-loading="loading2"
                      element-loading-text="拼命加载中">
              <el-table-column type="selection" width="45"/>
              <el-table-column type="index" label="序号" width="70"/>
              <el-table-column prop="number" label="学号" width="160" sortable/>
              <el-table-column prop="name" label="姓名" width="140"/>
              <el-table-column prop="grade" label="年级" width="80"/>
              <el-table-column prop="category" label="大类"/>
              <el-table-column prop="originalClass" label="原班级"/>
              <el-table-column prop="limit" label="权限状态" :formatter="formatLimit" width="120"/>
              <el-table-column prop="createTime" label="账号生成时间" :formatter="formatDate"/>
            </el-table>
          </div>
          <div class="block">
            <ul class="pagination" >
              <li><a href="javascript:">总{{total}}个</a></li>
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
  </div>
</template>

<script>
import Store from '../store'
export default {
  data:function(){
    return{
      current:1,
      showItem:15,
      allpage:1,
      accounts: [],
      grades: [],
      categories: [],
      total: 0,
      multipleSelection: [],
      numberList: [],
      selectForm: {
        number: null,
        name: null,
        originalClass: null,
        sex: null,
        stuFrom: null,
        division: null,
        category: null,
        grade: null,
        eachNum: null,
        limit: null
      },
      loading2: true
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
        this.getAccounts(index);
    },
    getAccounts:function(page){
      this.loading2 = true
      var ss = Store.fetchSession();
      this.$http.post('http://127.0.0.1:8888/jg/v/system/account/stu?ss=' + ss, {'order': {'from': (page-1)*this.showItem, 'size':this.showItem}, 'filter':this.selectForm}).then(response => {
          this.accounts = response.data.accounts
          this.total = response.data.total
          this.allpage = Math.ceil(response.data.total / this.showItem);
          this.loading2 = false
      });
    },
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    changeEachNum () {
      this.showItem = this.selectForm.eachNum
      this.getAccounts(1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let numberList = []
      for (var i = 0;i < val.length;i++) {
        numberList.push(val[i].number)
      }
      this.numberList = numberList
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
      this.$confirm('此操作将批量激活学生用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/account/update/limit?ss=' + ss, {'numberList': this.numberList, 'limit': 1}).then(response => {
          if (response.data.retCode == 0) {
              this.getAccounts(1);
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
      this.$confirm('此操作将批量禁止学生用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/account/update/limit?ss=' + ss, {'numberList': this.numberList, 'limit': -1}).then(response => {
          if (response.data.retCode == 0) {
              this.successMsg("禁止成功！");
              this.getAccounts(1);
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
    batchDelete () {
      this.$confirm('此操作将批量删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/system/account/delete?ss=' + ss, {'numberList': this.numberList}).then(response => {
          if (response.data.retCode == 0) {
              this.successMsg("删除成功！");
              this.getAccounts(1);
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
    //时间显示转换
    formatDate: function (row, column) {

      var createTime = new Date();
      createTime.setTime(row.createTime * 1000);
      return createTime.toLocaleString();
    },
    formatLimit: function (row, column) {
      return row.limit >= 1 ? '已激活' : '未激活';
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
    this.getGrades();
    this.getCategories();
    this.getAccounts(1);
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

</style>
