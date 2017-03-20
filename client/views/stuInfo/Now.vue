<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="block">
            <el-collapse class="collapse_header">
              <el-collapse-item title="筛选条件">
                <el-form :model="selectForm" ref="selectForm" label-width="60px" class="demo-dynamic">
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <el-form-item label="学号" prop="number">
                        <el-input v-model="selectForm.number" placeholder="请输入学号"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="姓名" prop="name">
                        <el-input v-model="selectForm.name" placeholder="请输入姓名"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="原班级" prop="originClass">
                        <el-input v-model="selectForm.originClass" placeholder="请输入原班级"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="生源地" prop="stuFrom">
                        <el-input v-model="selectForm.stuFrom" placeholder="请输入生源地"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="6">
                      <el-form-item label="大类" prop="category">
                        <el-select v-model="selectForm.category" placeholder="请选择大类">
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
                        <el-select v-model="selectForm.grade" placeholder="请选择年级">
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
                        <el-select v-model="selectForm.division" placeholder="请选择文理科">
                          <el-option label="文科" value="1"></el-option>
                          <el-option label="理科" value="2"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="性别" prop="sex">
                        <el-select v-model="selectForm.sex" placeholder="请选择性别">
                          <el-option label="男" value="M"></el-option>
                          <el-option label="女" value="F"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="24">
                    <el-col :span="9" :offset="15">
                      <el-form-item class="el-form-item-my">
                        <el-button type="info" @click="singleImport">单个导入</el-button>
                        <el-button type="info" @click="batchImport">批量导入</el-button>
                        <el-button type="primary" @click="query">查询</el-button>
                        <el-button @click="resetForm('selectForm')">重置</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-table :data="students" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
              <el-table-column prop="number" label="学号" width="160" sortable/>
              <el-table-column prop="name" label="姓名" width="100"/>
              <el-table-column prop="gPA" label="平均学分绩点" width="150" sortable/>
              <el-table-column prop="stuFrom" label="生源地" width="120"/>
              <el-table-column prop="division" label="文理科" width="100"/>
              <el-table-column prop="entranceScore" label="高考成绩" width="110"/>
              <el-table-column prop="admissionScore" label="生源省高考录取线" width="170"/>
              <el-table-column prop="sex" label="性别" width="80"/>
              <el-table-column prop="originalClass" label="原班级" width="180"/>
              <el-table-column prop="dorm" label="寝室" width="160"/>
              <el-table-column prop="note" label="备注" width="100"/>
              <el-table-column label="操作" width="120">
                <template scope="scope">
                  <el-button type="text" size="small">编辑</el-button>
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
    <modal :visible="showModal" :type="addType" @close="closeModalBasic"></modal>
  </div>
</template>

<script>
import Vue from 'vue'
import Store from '../store'
import Modal from './ImportModal'

export default {
  components: {
    Modal
  },
  data:function(){
    return{
      current:1,
      showItem:15,
      allpage:1,
      students: [],
      grades: [],
      categories: [],
      addType: 0,
      selectForm: {
        number: null,
        name: null,
        originalClass: null,
        sex: null,
        stuFrom: null,
        division: null,
        category: null,
        grade: null,
        eachNum: null
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
    getStudents:function(page){
      this.loading = true;
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/stuInfo/list?ss=' + ss, {'order': {'from': (page-1)*this.showItem, 'size':this.showItem}, 'filter':this.selectForm}).then(response => {
          this.students = response.data.students
          this.total = response.data.total
          this.allpage = Math.ceil(response.data.total / this.showItem);
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
    batchImport () {
      this.addType = 1;
      this.openModalBasic();
    },
    singleImport () {
      this.addType = 2;
      this.openModalBasic();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    query() {
      this.getStudents(1)
    },
    openModalBasic () {
      this.showModal = true
    },

    closeModalBasic () {
      this.showModal = false
    }
  },
  watch: {
    showModal () {
      if(!this.showModal) {
        this.getStudents(1)
      }
    }
  },
  created: function() {
    this.getGrades()
    this.getCategories()
    this.getStudents(1)
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
