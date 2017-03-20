<template>
  <div>
    <el-table :data="result" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column prop="number" label="学号"/>
      <el-table-column prop="name" label="姓名"/>
      <el-table-column prop="originalClass" label="原班级"/>
      <el-table-column prop="newMajor" label="新专业"/>
      <el-table-column prop="newClass" label="新班级"/>
    </el-table>
  </div>
</template>
<style>

</style>
<script>
import Store from '../store'
    export default{
      data() {
        return{
          result: [],
          loading: true
        }
      },
      methods: {
        getResult: function() {
          this.loading = true
          var ss = Store.fetchSession();
          this.$http.get('http://division.backend:8888/jg/v/stu/shunt/result?ss=' + ss).then(response => {
            var retCode = response.data.retCode;
            if (retCode === 0) {
              this.result = response.data.students
              this.loading = false
            }
          })

        }
      },
      created: function() {
        this.getResult()
      }
    }


</script>

<style lang="scss">

</style>
