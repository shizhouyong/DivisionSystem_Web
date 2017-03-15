<template>
  <div>
    <div class="tile is-ancestor">
      <div class="tile is-parent is-6">
        <article class="tile is-child box">
          <h4 class="title">
            分流计划列表
            <el-button :plain="true" type="info" class="h-btn" v-if="btnStatus == 'create'" @click="showPlanForm">创建</el-button>
            <el-button :plain="true" type="info" class="h-btn" v-if="btnStatus == 'cancel'" @click="hidePlanForm">取消</el-button>
          </h4>

          <el-collapse class="collapse_header">
            <el-collapse-item title="筛选条件">
              <el-form :model="selectForm" ref="selectForm" label-width="40px" class="demo-dynamic">
                <el-row :gutter="24">
                  <el-col :span="8">
                    <el-form-item label="大类" prop="category">
                      <el-select v-model="selectForm.category" placeholder="请选择大类">
                        <el-option
                          v-for="category in categories"
                          :label="category.name"
                          :value="category.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
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
                  <el-col :span="8">
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="selectForm.status" placeholder="请选择状态">
                        <el-option label="待上线" value="1"></el-option>
                        <el-option label="上线中" value="2"></el-option>
                        <el-option label="已结束" value="3"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="24">
                  <el-col :span="9" :offset="15">
                    <el-form-item>
                      <el-button type="primary" @click="getPlans">查询</el-button>
                      <el-button @click="resetForm('selectForm')">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-collapse-item>
          </el-collapse>

          <div class="block" v-for='plan in plans'>
            <span class="wrapper plan_oper_btn">
              <el-button type="danger" size="small" v-if="plan.status == 1" @click="planOnline(plan.id)">上线</el-button>
              <el-button type="warning" size="small" v-if="plan.status == 2" @click="planOffline(plan.id)">下线</el-button>
              <el-button type="success" size="small" v-if="plan.status == 2">进行中</el-button>
              <el-button type="info" size="small" v-if="plan.status == 1">未激活</el-button>
              <el-button type="danger" size="small" v-if="plan.status == 3">已结束</el-button>
              <el-button :plain="true" type="danger" size="small" @click="updatePlan(plan)" v-if="plan.status == 1">修改</el-button>
            </span>
            <table class="table is-bordered">
              <thead>
              <tr>
                <th class="text-center">招生大类</th>
                <th class="text-center">专业名称</th>
                <th class="text-center">班级数(计划)</th>
                <th class="text-center">人数（计划)</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td :rowspan="plan.majorAmount+1" class="text-center">
                  <h5 class="text-center" v-text='plan.grade'></h5>
                  <h5 class="text-center" v-text='plan.category'></h5>
                  <h5 class="text-center">总{{plan.studentAmount}}人</h5>
                </td>
              </tr>
              <tr v-for='unit in plan.units'>
                <td class="text-center" v-text="unit.name"></td>
                <td class="text-center" v-text="unit.classAmount"></td>
                <td class="text-center" v-text="unit.stuAmount"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </article>
      </div>
      <div class="tile is-parent is-6" v-if="btnStatus != 'create'">
        <article class="tile is-child box" >
          <h4 class="title header-left">创建分流计划</h4>
          <el-form :model="planForm" ref="planForm" label-width="100px" class="demo-dynamic" :rules="rules">
            <el-row :gutter="24">
              <el-col :span="23">
                <el-form-item label="年级" prop="gradeChoose" required>
                  <el-select v-model="planForm.gradeChoose" placeholder="请选择">
                    <el-option
                      v-for="grade in grades"
                      :label="grade.name"
                      :value="grade.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="23">
                <el-form-item label="大类" prop="categoryChoose" required>
                  <el-select placeholder="请选择大类" v-model="planForm.categoryChoose" @change="getMajorsByCategory(planForm.categoryChoose)">
                    <el-option
                      v-for="category in categories"
                      :label="category.name"
                      :value="category.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="23">
                <el-form-item label="截止时间" required>
                <el-col :span="11">
                  <el-form-item prop="date1">
                    <el-date-picker type="date" v-model="planForm.date1" placeholder="选择日期" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2"> </el-col>
                <el-col :span="11" :offset="2">
                  <el-form-item prop="date2">
                    <el-time-picker
                      type="fixed-time"
                      :picker-options="{
                        format: 'HH:mm:ss'
                      }"
                      v-model="planForm.date2"
                      placeholder="选择时间"
                      style="width: 100%;">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-for="(major, index) in planForm.majors" :label="'专业' + (index + 1)">
                  <el-col :span="8">
                    <el-select placeholder="请选择专业" v-model="major.id">
                      <el-option v-for="major in majors"
                                 :label="major.name"
                                 :value="major.id">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="5" :offset="1">
                    <el-input type="number" v-model="major.classAmount" placeholder="班级数量"></el-input>
                  </el-col>
                  <el-col :span="5" :offset="1">
                    <el-input type="number" v-model="major.stuAmount" placeholder="学生总数"></el-input>
                  </el-col>
                  <el-col :span="3" :offset="1">
                    <el-button @click.prevent="removeMajor(major)">删除</el-button>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="23">
                <el-form-item>
                  <el-button type="primary" @click="submitForm('planForm')">保存</el-button>
                  <el-button @click="addMajor">新增专业</el-button>
                  <el-button @click="resetForm('planForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </article>
      </div>
    </div>
  </div>
</template>
<script>
import Store from '../store'
  export default {
    data() {
      return {
        btnStatus: 'create',
        grades: [],
        categories: [],
        majors: [],
        plans: '',
        planForm: {
          id: '',
          majors: '',
          majorAmount: '',
          categoryChoose: '',
          gradeChoose: '',
          date1: '',
          date2: ''
        },
        selectForm: {
          status: '',
          category: '',
          grade: ''
        },
        rules: {
          categoryChoose: [
            {  type: 'number', required: true, message: '请选择大类', trigger: 'change' }
          ],
          gradeChoose: [
            {  type: 'number', required: true, message: '请选择年级', trigger: 'change' }
          ],
          date1: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          date2: [
            { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          ]
        }
      };
    },
    methods: {
      planOnline(id) {
        this.$confirm('此操作将上线分流计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.post('http://127.0.0.1:8888/jg/v/plan/online?ss=' + ss, {'id': id, "oper": 2}).then(response => {
            if (response.data.retCode == 0) {
                this.getPlans();
                this.successMsg("上线成功！");
            } else {
                this.errorMsg('上线失败！');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消上线操作！'
          });
        });

      },
      planOffline(id) {
        this.$confirm('此操作将下线分流计划, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ss = Store.fetchSession();
          this.$http.post('http://127.0.0.1:8888/jg/v/plan/online?ss=' + ss, {'id': id, "oper": 1}).then(response => {
            if (response.data.retCode == 0) {
                this.getPlans();
                this.successMsg("下线成功！");
            } else {
                this.errorMsg('下线失败！');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消下线操作！'
          });
        });
      },
      updatePlan(plan) {
        let u_plan = JSON.parse(JSON.stringify(plan));
        var newDate = new Date();
        newDate.setTime(u_plan.endTime * 1000);
        this.planForm.id = u_plan.id;
        this.planForm.majors = u_plan.units;
        this.planForm.majorAmount = u_plan.units.length;
        this.planForm.categoryChoose = u_plan.categoryId;
        this.planForm.gradeChoose = u_plan.gradeId;
        this.planForm.date1 = newDate;
        this.planForm.date2 = newDate;
        this.getMajorsByCategory(u_plan.categoryId);
        this.showPlanForm();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var d = new Date(this.planForm.date1);
            var h = new Date(this.planForm.date2);
            var endTime = Date.parse(new Date(d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + h.getHours() + ':' + h.getMinutes() + ':' + h.getSeconds())) / 1000;
            var ss = Store.fetchSession()
            if(this.planForm.id === 0){
              this.$http.post('http://127.0.0.1:8888/jg/v/plan/add?ss='+ss,
                 {'grade':this.planForm.gradeChoose,'category':this.planForm.categoryChoose,'endTime':endTime,'details':this.planForm.majors}).then(response => {
                var retCode = response.data.retCode;
                if (retCode === 0) {
                    this.getPlans()
                    this.hidePlanForm()
                    this.getMajors()
                    this.successMsg("分流计划创建成功！");
                } else {
                    this.errorMsg('分流计划创建失败！');
                }
              })
            } else {
               this.$http.post('http://127.0.0.1:8888/jg/v/plan/update?ss='+ss,
                 {'id': this.planForm.id ,'grade':this.planForm.gradeChoose,'category':this.planForm.categoryChoose,'endTime':endTime,'details':this.planForm.majors}).then(response => {
                var retCode = response.data.retCode;
                if (retCode === 0) {
                    this.getPlans()
                    this.hidePlanForm()
                    this.getMajors()
                    this.successMsg("分流计划更新成功！");
                } else {
                    this.errorMsg('分流计划更新失败！');
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addMajor() {

        if (this.planForm.majors === '') {
          this.planForm.majors = [{name: '',classAmount: '',stuAmount: ''}]
        } else {
          this.planForm.majors.push({
            name: '',
            classAmount: '',
            stuAmount: ''
          });
        }
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
      getMajorsByCategory: function(categoryChoose) {
        var ss = Store.fetchSession();
        this.$http.get('http://127.0.0.1:8888/jg/v/system/major/get/'+categoryChoose+'?ss=' + ss).then(response => {
            this.majors = response.data.majorList
        })
      },
      getPlans: function () {
        var ss = Store.fetchSession();
        this.$http.post('http://127.0.0.1:8888/jg/v/plan/get/list?ss=' + ss, {'items': this.selectForm}).then(response => {
            this.plans = response.data.planList
        })
      },
      showPlanForm: function() {
        this.btnStatus = 'cancel'
      },
      hidePlanForm: function() {
        this.btnStatus = 'create';
        this.planForm = {
          id: '',
          majors: [],
          majorAmount: '',
          categoryChoose: '',
          gradeChoose: '',
          date1: '',
          date2: ''
        };
        this.getMajors();
      },
      resetForm(formName) {
        this.planForm.majors = [];
        this.$refs[formName].resetFields();
      },
      removeMajor(item) {
        var index = this.planForm.majors.indexOf(item)
        if (index !== -1) {
          this.planForm.majors.splice(index, 1)
        }
      }
    },
    created: function() {
      this.getGrades()
      this.getCategories()
      this.getMajors()
      this.getPlans()
    }
  }
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .text-center{
    text-align: center;
    vertical-align: middle!important;
  }
  .plan_oper_btn button{
    margin-bottom: 8px;

  }

  .h-btn {
    float: right;
  }

  .collapse_header {
    margin-bottom: 12px;
  }
</style>

