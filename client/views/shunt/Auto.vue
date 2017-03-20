<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="block">
            <el-collapse class="collapse_header">
              <el-collapse-item title="分流控制台">
                <el-form :model="operForm" ref="operForm" label-width="60px" class="demo-dynamic">
                  <el-row :gutter="24">
                    <el-col :span="6" :offset="3">
                      <el-form-item label="大类" prop="category">
                        <el-select v-model="operForm.category" placeholder="请选择大类" @change="query(1)">
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
                        <el-select v-model="operForm.grade" placeholder="请选择年级" @change="query(1)">
                          <el-option
                            v-for="grade in grades"
                            :label="grade.name"
                            :value="grade.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="专业" prop="newMajor">
                        <el-select v-model="operForm.newMajor" placeholder="请选择专业" @change="query(1)">
                          <el-option
                            v-for="major in majors"
                            :label="major.name"
                            :value="major.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="13" :offset="5">
                      <el-button type="success" @click="calculate">计算总分</el-button>
                      <el-button type="warning" @click="shuntToMajor">分流到专业</el-button>
                      <el-button type="warning" @click="shuntToClass">分流到班</el-button>
                      <el-button type="info" @click="download">下载分流结果</el-button>
                      <el-button @click="resetForm('operForm')">重置</el-button>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-table :data="students" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
              <el-table-column type="expand">
                <template scope="props">
                  <el-form label-position="left" inline class="students-table-expand">
                    <el-form-item label="平均学分绩点">
                      <span>{{ props.row.gPA }}</span>
                    </el-form-item>
                    <el-form-item label="高考成绩">
                      <span>{{ props.row.entranceScore }}</span>
                    </el-form-item>
                    <el-form-item label="生源省高考录取线">
                      <span>{{ props.row.admissionScore }}</span>
                    </el-form-item>
                    <el-form-item label="高考成绩/生源省高考录取线">
                      <span>{{ props.row.gradeOne }}</span>
                    </el-form-item>
                    <el-form-item label="30%*高考成绩/生源省高考录取线">
                      <span>{{ props.row.gradeTwo }}</span>
                    </el-form-item>
                    <el-form-item label="总成绩">
                      <span>{{ props.row.totalGrade }}</span>
                    </el-form-item>
                    <el-form-item label="专业排名">
                      <span>{{ props.row.rank }}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column type="index" label="序号" width="70"/>
              <el-table-column prop="number" label="学号" width="160" sortable/>
              <el-table-column prop="name" label="姓名" width="100"/>
              <el-table-column prop="gPA" label="平均学分绩点" width="150" sortable/>
              <el-table-column prop="gradeOne" label="高考成绩/生源省高考录取线" width="160" sortable/>
              <el-table-column prop="totalGrade" label="总成绩" width="120" sortable/>
              <el-table-column prop="rank" label="排名" width="120" sortable/>
              <el-table-column prop="newMajor" label="新专业" width="120"/>
              <el-table-column prop="newClass" label="新班级" width="120"/>
              <el-table-column prop="stuFrom" label="生源地" width="120"/>
              <el-table-column prop="division" label="文理科" width="100"/>
              <el-table-column prop="sex" label="性别" width="80"/>
              <el-table-column prop="originalClass" label="原班级" width="180"/>
              <el-table-column prop="dorm" label="寝室" width="160"/>
              <el-table-column prop="note" label="备注" width="180"/>
              <el-table-column label="操作" width="120">
                <template scope="scope">
                  <el-button type="text" size="small">查看</el-button>
                  <el-button type="text" size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="block">
            <ul class="pagination">
              <li><a href="javascript:">总{{total}}个</a></li>
              <li v-show="current != 1" @click="current-- && goto(current--)"><a href="javascript:">上一页</a></li>
              <li v-for="index in pages" @click="goto(index)" :class="{'active':current == index}" :key="index">
                <a href="javascript:">{{index}}</a>
              </li>
              <li v-show="allpage != current && allpage != 0 " @click="current++ && goto(current++)"><a
                href="javascript:">下一页</a></li>
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
      students: [],
      total: 0,
      multipleSelection: [],
      numberList: [],
      grades: [],
      categories: [],
      majors: [],
      operForm: {
        category: null,
        grade: null,
        newMajor: null
      },
      loading : true
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
    calculate: function() {
      this.loading = true
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/operation/calculate?ss=' + ss,
        {'grade':this.operForm.grade,'category':this.operForm.category}).then(response => {
          this.students = response.data.students
          this.total = response.data.total
          this.allpage = Math.ceil(response.data.total / this.showItem)
          this.loading = false
      })
    },
    shuntToMajor:function () {
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/operation/shunt/major?ss=' + ss,
        {'grade':this.operForm.grade,'category':this.operForm.category}).then(response => {
          if(response.data.retCode === 0) {
            this.getStudentsByOper()
            this.getMajors()
            this.successMsg("一键分流成功！")
          } else {
            this.errorMsg('一键分流失败！')
          }
      })
    },
    shuntToClass:function () {
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/operation/shunt/class?ss=' + ss,
        {'grade':this.operForm.grade,'category':this.operForm.category,'newMajor':this.operForm.newMajor}).then(response => {
          if(response.data.retCode === 0) {
            this.getStudentsByOper()
            this.successMsg("一键分流成功！");
          } else {
            this.errorMsg('一键分流失败！');
          }
      })
    },
    goto:function(index){
      if(index == this.current) return;
        this.current = index;
        //这里可以发送ajax请求
      this.getStudentsByOper(index);
    },
    changeEachNum () {
      this.showItem = this.selectForm.eachNum
      this.getStudentsByOper(1)
    },
    changeEachNumInOper () {
      this.showItem = this.operForm.eachNum
      this.getStudentsByOper(1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      let numberList = []
      for (var i = 0;i < val.length;i++) {
        numberList.push(val[i].number)
      }
      this.numberList = numberList
    },
    download: function() {
      var ss = Store.fetchSession();
      location.href="http://division.backend:8888/export/shuntResult?ss=" + ss + "&grade="+this.operForm.grade+"&category="+this.operForm.category;
    },
    query: function() {
      this.getStudentsByOper(1)
      if(1 == this.current) return;
        this.current = 1;
    },
    getStudentsByOper:function(page){
      this.loading = true
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/stuInfo/list?ss=' + ss, {'order': {'from': (page-1)*this.showItem, 'size':this.showItem}, 'filter':this.operForm}).then(response => {
          this.students = response.data.students
          this.total = response.data.total
          this.allpage = Math.ceil(response.data.total / this.showItem)
          this.getMajors()
          this.loading = false
      });
    },
    getGrades: function () {
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'GRADE'}).then(response => {
          this.grades = response.data.systemInfoList
      })
    },
    getCategories: function () {
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'CATEGORY'}).then(response => {
          this.categories = response.data.systemInfoList
      })
    },
    getMajors: function () {
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/operation/newMajor/list?ss=' + ss, this.operForm).then(response => {
          this.majors = response.data.newMajors
      })
    },
    //时间显示转换
    formatDate: function (row, column) {
      var createTime = new Date();
      createTime.setTime(row.createTime * 1000);
      return createTime.toLocaleString();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    this.getStudentsByOper()
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

  .pagination li {
    display: inline-block;
    margin: 0 5px;
  }

  .pagination li a {
    padding: .5rem 1rem;
    display: inline-block;
    border: 1px solid #ddd;
    background: #fff;
    color: #1ACBA3;
  }

  .pagination li a:hover {
    background: #eee;
  }

  .pagination li.active a {
    background: #1ACBA3;
    color: #fff;
  }

  .el-form-item-my {
    margin-bottom: 10px;
  }

  .students-table-expand {
    font-size: 0;
  }

  .students-table-expand label {
    width: 300px;
    color: #99a9bf;
  }

  .students-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 35%;
  }
</style>
