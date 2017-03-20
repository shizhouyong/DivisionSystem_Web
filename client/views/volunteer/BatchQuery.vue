<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-12">
        <article class="tile is-child box">
          <div class="block">
            <el-collapse class="collapse_header">
              <el-collapse-item title="筛选条件">
                <el-form :model="selectForm" ref="selectForm" label-width="80px" class="demo-dynamic">
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
                      <el-form-item label="原班级" prop="originalClass">
                        <el-input v-model="selectForm.originalClass" placeholder="请输入原班级"></el-input>
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
                            :value="category.id"/>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="年级" prop="grade">
                        <el-select v-model="selectForm.grade" placeholder="请选择年级">
                          <el-option
                            v-for="grade in grades"
                            :label="grade.name"
                            :value="grade.id"/>
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
                    <el-col :span="6">
                      <el-form-item label="第一志愿" prop="firstChoose">
                        <el-select v-model="selectForm.firstChoose" placeholder="请选择第一志愿">
                          <el-option v-for="major in majors"
                                     :label="major.name"
                                     :value="major.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="第二志愿" prop="secondChoose">
                        <el-select v-model="selectForm.secondChoose" placeholder="请选择第二志愿">
                          <el-option v-for="major in majors"
                                     :label="major.name"
                                     :value="major.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item label="第三志愿" prop="thirdChoose">
                        <el-select v-model="selectForm.thirdChoose" placeholder="请选择第三志愿">
                          <el-option v-for="major in majors"
                                     :label="major.name"
                                     :value="major.id">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="5" :offset="1">
                      <el-form-item>
                        <el-button type="primary" @click="query">查询</el-button>
                        <el-button @click="resetForm('selectForm')">重置</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-collapse-item>
            </el-collapse>
            <el-table :data="volunteers" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
              <el-table-column prop="number" label="学号" sortable/>
              <el-table-column prop="name" label="姓名"/>
              <el-table-column prop="firstChoose" label="第一志愿"/>
              <el-table-column prop="secondChoose" label="第二志愿"/>
              <el-table-column prop="thirdChoose" label="第三志愿"/>
              <el-table-column label="操作">
                <template scope="scope">
                  <el-button type="text" size="small">查看</el-button>
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
      volunteers: [],
      grades: [],
      categories: [],
      majors: [],
      loading: true,
      selectForm: {
        number: null,
        name: null,
        originalClass: null,
        sex: null,
        stuFrom: null,
        division: null,
        category: null,
        grade: null,
        firstChoose: null,
        secondChoose: null,
        thirdChoose:null
      },
      order: {
        item: null,
        sort: null
      }
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
      this.$http.post('http://division.backend:8888/jg/v/system/systemInfo/get?ss=' + ss, {'type': 'MAJOR'}).then(response => {
          this.majors = response.data.systemInfoList
      })
    },
    goto: function(index){
      if(index == this.current) return;
        this.current = index;
        //这里可以发送ajax请求
        this.getMyVolunteer(index);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getMyVolunteer: function (page) {
    this.loading = true
      var ss = Store.fetchSession();
      this.$http.post('http://division.backend:8888/jg/v/volunteer/get/list?ss=' + ss, {'filter': this.selectForm, 'order': {'from': (page-1)*this.showItem, 'size':this.showItem}}).then(response => {
          this.volunteers = response.data.volunteers;
          this.allpage = Math.ceil(response.data.total / this.showItem);
          this.loading = false
      })
    },
    query() {
      this.getMyVolunteer();
    }
  },
  created: function() {
    this.getGrades()
    this.getCategories()
    this.getMajors()
    this.getMyVolunteer(1);
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
