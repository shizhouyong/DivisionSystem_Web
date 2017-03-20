<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-4">
        <article class="tile is-child box">
          <h1 class="title">我的志愿</h1>
          <p v-if="planUnits.length === 0">您当前无可选专业！</p>
          <el-form :model="volunteerForm" ref="volunteerForm" label-width="100px" class="demo-dynamic" :rules="rules">
            <el-row :gutter="24" v-if="planUnits.length > 0">
              <el-col :span="24">
                <el-form-item label="第一志愿" prop="first">
                  <el-select placeholder="请选择专业" v-model="volunteerForm.first" :disabled="myVolunteer != null">
                    <el-option v-for="planUnit in planUnits" :label="planUnit.name" :value="planUnit.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="planUnits.length > 1">
                <el-form-item label="第二志愿" prop="second">
                  <el-select placeholder="请选择专业" v-model="volunteerForm.second" :disabled="myVolunteer != null">
                    <el-option v-for="planUnit in planUnits" :label="planUnit.name" :value="planUnit.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="planUnits.length > 2">
                <el-form-item label="第三志愿" prop="third">
                  <el-select placeholder="请选择专业" v-model="volunteerForm.third" :disabled="myVolunteer != null">
                    <el-option v-for="planUnit in planUnits" :label="planUnit.name" :value="planUnit.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item>
                  <el-button type="primary" @click="submitForm('volunteerForm')" v-if="typeof(myVolunteer)=='undefined'">保存</el-button>
                  <el-button type="primary" @click="updateVolunteer" v-else>修改</el-button>
                  <el-button type="success" @click="download" v-if="typeof(myVolunteer)!='undefined'">下载</el-button>
                  <el-button @click="resetForm('volunteerForm')" v-if="typeof(myVolunteer)=='undefined'">重置</el-button>
                  <el-button @click="resetUpdate" v-if="typeof(myVolunteer)=='undefined'">取消</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </article>
      </div>
    </div>
  </div>
</template>
<style>

</style>
<script>
import Store from '../store'
    export default{
        data(){
            return{
                planUnits: [],
                myVolunteer: null,
                volunteerForm: {
                  first: '',
                  second: '',
                  third: ''
                },
                rules:{
                  first: [
                    {  type: 'number', required: true, message: '请选择第一志愿', trigger: 'change' }
                  ],
                  second: [
                    {  type: 'number', required: true, message: '请选择第二志愿', trigger: 'change' }
                  ],
                  third: [
                    {  type: 'number', required: true, message: '请选择第三志愿', trigger: 'change' }
                  ]
                }
            }
        },
        methods: {
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                var ss = Store.fetchSession();
                  this.$http.post('http://division.backend:8888/jg/v/stu/save?ss='+ss,{'firstChoose': this.volunteerForm.first,'secondChoose': this.volunteerForm.second,'thirdChoose': this.volunteerForm.third}).then(response => {
                    var retCode = response.data.retCode;
                    if (retCode === 0) {
                        this.getMyVolunteer();
                        this.getMajors();
                        this.successMsg("志愿提交成功！");
                    } else {
                        this.errorMsg('志愿提交失败！');
                    }
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            })
          },
          getMajors: function () {
            var ss = Store.fetchSession();
            this.$http.get('http://division.backend:8888/jg/v/stu/volunteer/select/items?ss=' + ss).then(response => {
                this.planUnits = response.data.planUnits
                if(typeof(this.planUnits)=='undefined') {
                  this.planUnits = []
                }
            })
          },
          getMyVolunteer: function () {
            var ss = Store.fetchSession();
            this.$http.get('http://division.backend:8888/jg/v/stu/volunteer/get?ss=' + ss).then(response => {
                let myVolunteer = response.data.myVolunteer;
                this.myVolunteer = myVolunteer;
                console.log(myVolunteer)
                if(typeof(myVolunteer)!="undefined") {
                  this.volunteerForm.first = myVolunteer.firstChooseId;
                  this.volunteerForm.second = myVolunteer.secondChooseId;
                  this.volunteerForm.third = myVolunteer.thirdChooseId;
                }
            })
          },
          updateVolunteer: function () {
            this.myVolunteer = null;
          },
          resetUpdate:function () {
            this.getMyVolunteer();
          },
          download:function() {
            var ss = Store.fetchSession();
            location.href="http://division.backend:8888/jg/v/export/myVolunteer?ss=" + ss;
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
          this.getMyVolunteer();
          this.getMajors();
        }
    }
</script>

<style lang="scss">
  .label_select_parent {
    width: 100px;
  }

  .label_select {
    width: 100px;
  }

  .div_btn_submit {
    margin: 0 auto;
    width: 120px;
  }
</style>
