<template>
  <modal :visible="visible" @close="close">
    <article v-if="type === 1" class="tile is-child box">
        <h4 class="title">批量导入学生信息</h4>
        <el-form :model="fileForm" ref="fileForm" label-width="60px" class="demo-dynamic" :rules="rules">
          <el-row :gutter="24">
            <el-col :span="18" :offset="3">
              <el-form-item prop="file" class="el-form-item-my">
                <input type="file" @change="getFile" class="upfile"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="18" :offset="3">
              <el-form-item label="大类" prop="category" class="el-form-item-my">
                <el-select v-model="fileForm.category" placeholder="请选择大类">
                  <el-option
                    v-for="category in categories"
                    :label="category.name"
                    :value="category.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="18" :offset="3">
              <el-form-item label="年级" prop="grade" class="el-form-item-my">
                <el-select v-model="fileForm.grade" placeholder="请选择年级">
                  <el-option
                    v-for="grade in grades"
                    :label="grade.name"
                    :value="grade.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12" :offset="6">
              <el-form-item class="el-form-item-my">
                <el-button type="info" @click="submitForm('fileForm')">上传</el-button>
                <el-button @click="resetForm('fileForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </article>
    <article v-if="type === 2" class="tile is-child box">
      <div class="block">
        <h4 class="title header-left">添加学生信息</h4>
        <el-form :label-position="labelPosition" :model="studentForm" ref="studentForm" label-width="140px" class="demo-dynamic" :rules="studentRules">
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="学号" prop="number">
                  <el-input v-model="studentForm.number" type="number"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="studentForm.name"/>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="平均学分绩点" prop="gpa">
                  <el-input v-model="studentForm.gpa" type="number"/>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="高考成绩" prop="entranceScore">
                  <el-input v-model="studentForm.entranceScore" type="number"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="生源省高考录取线" prop="admissionScore">
                  <el-input v-model="studentForm.admissionScore" type="number"/>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="大类" prop="category">
                  <el-select v-model="studentForm.category" placeholder="请选择大类">
                    <el-option
                      v-for="category in categories"
                      :label="category.name"
                      :value="category.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年级" prop="grade">
                  <el-select v-model="studentForm.grade" placeholder="请选择年级">
                    <el-option
                      v-for="grade in grades"
                      :label="grade.name"
                      :value="grade.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="性别" prop="sex">
                  <el-select v-model="studentForm.sex" placeholder="请选择性别">
                    <el-option label="男" value="M"></el-option>
                    <el-option label="女" value="F"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="文理科" prop="division">
                  <el-select v-model="studentForm.division" placeholder="请选择文理科">
                    <el-option label="文科" value="1"></el-option>
                    <el-option label="理科" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="生源地" prop="stuFrom">
                  <el-input v-model="studentForm.stuFrom"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="原班级" prop="originalClass">
                  <el-input v-model="studentForm.originalClass"/>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="22" :offset="1">
              <el-col :span="12">
                <el-form-item label="寝室">
                  <el-input v-model="studentForm.dorm"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="备注">
                  <el-input v-model="studentForm.note"/>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="8" :offset="8">
              <el-form-item class="el-form-item-my">
                <el-button type="info" @click="addStudent('studentForm')">提交</el-button>
                <el-button @click="resetForm('studentForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </article>
  </modal>

</template>
<script>
import Store from '../store'
import { Modal } from 'vue-bulma-modal'
export default {
  components: {
    Modal
  },
  props: {
    visible: Boolean,
    type: Number
  },
  data() {
    return {
      current:1,
      showItem:15,
      allpage:1,
      students: [],
      grades: [],
      categories: [],
      labelPosition: 'top',
      fileForm:{
        file: null,
        category: '',
        grade:''
      },
      studentForm: {
        number: '',
        name: '',
        gpa: '',
        stuFrom: '',
        division: '',
        entranceScore:'',
        admissionScore:'',
        sex:'',
        originalClass:'',
        dorm:'',
        note:'',
        category: '',
        grade: ''
      },
      rules: {
        category: [
          {  type: 'number', required: true, message: '请选择大类', trigger: 'change' }
        ],
        grade: [
          {  type: 'number', required: true, message: '请选择年级', trigger: 'change' }
        ]
      },
      studentRules: {
        name: [
          {  required: true, message: '请填写姓名', trigger: 'blur' }
        ],
        number: [
          {  type: 'number', required: true, message: '请填写学号', trigger: 'blur' }
        ],
        gpa: [
          {  type: 'number', required: true, message: '请填写平均学分绩点', trigger: 'blur' }
        ],
        category: [
          {  type: 'number', required: true, message: '请选择大类', trigger: 'blur' }
        ],
        grade: [
          {  type: 'number', required: true, message: '请选择年级', trigger: 'blur' }
        ],
        entranceScore: [
          {  type: 'number', required: true, message: '请填写高考成绩', trigger: 'blur' }
        ],
        admissionScore: [
          {  type: 'number', required: true, message: '请填写生源省高考录取线', trigger: 'blur' }
        ],
        sex: [
          {  required: true, message: '请选择性别', trigger: 'blur' }
        ],
        division: [
          {  required: true, message: '请选择文理科', trigger: 'blur' }
        ],
        stuFrom: [
          {  required: true, message: '请填写生源地', trigger: 'blur' }
        ],
        originalClass: [
          {  required: true, message: '请填写原班级', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
      pages:function(){
        var pag = [];
          if(
            this.current < this.showItem ){ //如果当前的激活的项 小于要显示的条数
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
    getFile($event){
      this.fileForm.file = $event.target.files[0] //获取要上传的文件
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addStudent(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            var ss = Store.fetchSession();
            this.$http.post('http://division.backend:8888/jg/v/stuInfo/add?ss=' + ss, this.studentForm).then((response) => {
              if(response.data.retCode === 0) {
                this.successMsg('添加成功！');
                this.$emit('close');
              } else {

              }
            }, (response) => {
                // error callback
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = new FormData();

            //下面message的值怎么与上面表单的值绑定？
            if(this.fileForm.file === null) {
              this.errorMsg('请选择文件！');
            }
            data.append('file', this.fileForm.file);
            data.append('category',this.fileForm.category);
            data.append('grade',this.fileForm.grade);
            var ss = Store.fetchSession();
            this.$http.post('http://division.backend:8888/jg/v/stuInfo/add/excel?ss=' + ss, data).then((response) => {
              if(response.data.retCode === 0) {
                this.successMsg("上传成功！");
                this.$emit('close')
              } else {

              }
            }, (response) => {
                // error callback
            });
          } else {
            console.log('error submit!!');
            return false;
          }
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
    },
    close () {
      this.$emit('close')
    }
  },
  created: function() {
    this.getGrades()
    this.getCategories()
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
    margin-top: 10px;
  }

  .el-select {
    width: 100%;
  }

</style>

