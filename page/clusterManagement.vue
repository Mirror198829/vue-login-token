<!-- 
- Author:CaoJing(08220)
- Date:2018/4/19
-->
<template>
   <div class="consoleRightBar">
      <div style="margin-bottom:25px">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name:'Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name:'ConsolePageHome' }">控制台</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>集群管理</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div>
        <el-form :inline="true" :model="searchContent" size="small">
          <el-form-item>
            <el-input v-model="searchContent.name" placeholder="请输入集群名称"
             @keyup.enter.native.prevent="getClustersInfo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getClustersInfo()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:10px">
        <el-button type="primary" size="small" @click="createDialogVisible = true;queryTenant('')">创建集群</el-button>
      </div>
      <div>
         <el-table
          :data="clusterData"
          style="width: 100%"
          :border="true">
          <el-table-column
            label="集群名称"
            prop="clusterName"
           >
          </el-table-column>
          <el-table-column
            label="集群类型"
           >
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1">容器集群</span>
                <span v-if="scope.row.type == 2">物理集群</span>
              </template>
          </el-table-column>
          <el-table-column
            label="创建日期"
            prop="createTime"
          >
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == 1" size="medium" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status == 0" size="medium" type="danger">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span class="operate" v-if="scope.row.status == 1"
                @click="handleEditCluster(scope.$index, scope.row)">编辑</span>
              <span class="operate" v-if="scope.row.status != 1"
                @click="handleDeleteCluster(scope.$index, scope.row)">删除</span>
              <span class="operate" v-if="scope.row.status != 1"
                @click="startCluster(scope.$index, scope.row)">启用</span>
              <span class="operate" v-if="scope.row.status == 1"
                @click="stopCluster(scope.$index, scope.row)">停用</span>
            </template>
          </el-table-column>
        </el-table> 
      </div>
      <div style="text-align:right;padding-top:20px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[5,10,15]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.totalRecord">
        </el-pagination>
    </div>
    <el-dialog
      title="创建集群"
      :visible.sync="createDialogVisible"
      @close="resetForm('createClusterForm')"
      >
      <el-form :model="createClusterForm" :rules="createClusterRules" ref="createClusterForm" label-width="100px" class="demo-createClusterForm">
        <el-form-item label="集群名称" prop="clusterName">
          <el-input v-model="createClusterForm.clusterName"></el-input>
        </el-form-item> 
        <el-form-item label="租户" prop="tenantId">
              <el-select
                v-model="createClusterForm.tenantId"
                filterable
                remote
                placeholder="请输入查询的租户名"
                :remote-method="queryTenant"
                :loading="loading">
                <el-option
                  v-for="item in tenantOptions"
                  :key="item.id"
                  :label="item.tenantName"
                  :value="item.id">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="集群类型" prop="type">
          <el-radio-group v-model="createClusterForm.type">
            <el-radio-button :label='1' >容器集群</el-radio-button>
            <el-radio-button :label='2' >物理集群</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  @click="submitForm('createClusterForm')">立即创建</el-button>
          <el-button size="small" @click="resetForm('createClusterForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
    <el-dialog
      title="集群编辑"
      :visible.sync="editDialogVisible"
      @close="resetEditForm('editClusterForm')"
      >
      <el-form :model="editClusterForm" :rules="editclusterRules" ref="editClusterForm" label-width="100px" class="demo-createClusterForm">
        <el-form-item label="集群名称" prop="clusterName">
          <el-input v-model="editClusterForm.clusterName"></el-input>
        </el-form-item>
        <el-form-item label="租户" prop="tenantId">
          <el-select
            v-model="editClusterForm.tenantId"
            filterable
            remote
            placeholder="请输入查询的租户名"
            :remote-method="queryTenant"
            :loading="loading">
            <el-option
              v-for="item in tenantOptions"
              :key="item.id"
              :label="item.tenantName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="集群类型" prop="type">
          <el-radio-group v-model="editClusterForm.type">
            <el-radio-button :label='1' >容器集群</el-radio-button>
            <el-radio-button :label='2' >物理集群</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary"  @click="submitEditForm('editClusterForm')">确定</el-button>
          <el-button size="small" @click="resetEditForm('editClusterForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
   </div>
</template>

<script>
export default {
  data() {
    let checkClusterName = (rule, value, callback) => {
        let searchclusterName = value
        let clusterNameLen = searchclusterName.length
        let clusterName
        if(clusterNameLen){
          clusterName = Base64.encode(JSON.stringify({
            "clusterName":searchclusterName
          }))
        }else{
          clusterName =''
        }
        this.$http.get('sysmgr/nlsysmgr/v1/clusters/?q='+clusterName+'&p=&o=')
        .then(response=> {
           let totalRecord = response.data.length
           if(totalRecord){
            return callback(new Error('集群名已存在'));
           }else{
            callback()
           }
        })
        .catch(error=> {
            let msg
            if(error.response){
              msg = error.response.data.msg
            }else{
              msg = "查询集群名失败"
            }
            this.$message({
                type: 'error',
                message: msg
            })
        })
    }
    let checkEditName = (rule, value, callback) => {
        let searchclusterName = value
        let clusterNameLen = searchclusterName.length
        let clusterName
        let compareName =  this.clusterData[this.editclusterIndex].clusterName
        if(compareName ==  value) callback()
        if(clusterNameLen){
          clusterName = Base64.encode(JSON.stringify({
            "clusterName":searchclusterName
          }))
        }else{
          clusterName =''
        }
        this.$http.get('sysmgr/nlsysmgr/v1/clusters/?q='+clusterName+'&p=&o=')
        .then(response=> {
           let totalRecord = response.data.length
           if(totalRecord){
             return callback(new Error('集群名已存在'));
           }else{
             callback()
           }
        })
        .catch(error=> {
            this.$message({
                type: 'success',
                message: '查询用户失败'
            })
        })
    }
    return {
      tenantOptions:[],
      loading:false,
      pagination:{
        currentPage:0,
        totalRecord:0,
        pageSize:5
      },
      editclusterIndex:0,
      timeout:  null,
      createClusterForm: {
          clusterName: '',
          tenantId:'',
          type:1
      },
      editClusterForm:{},
      createClusterRules: {
          clusterName: [
            { required: true, message: '集群名称不得为空', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]{1,50}$/, message: '只能输入50位内字母、数字或者下划线' },
            { validator: checkClusterName, trigger: 'blur' }
          ],
          tenantId:[
            { required: true, message: '集群管理员不得为空', trigger: 'blur' }
          ],
          type:[
            { required:true,message:'集群类型不得为空',trigger:'blur'}
          ]
      },
      editclusterRules:{
          clusterName: [
            { required: true, message: '集群名称不得为空', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]{1,50}$/, message: '只能输入字母、数字或者下划线' },
            { validator: checkEditName, trigger: 'blur' }
          ],
          tenantId:[
            { required: true, message: '集群管理员不得为空', trigger: 'blur' }
          ],
          type:[
            { required:true,message:'集群类型不得为空',trigger:'blur'}
          ]
      },
      createDialogVisible:false,
      editDialogVisible:false,
      searchContent:{
        name:''
      },
      clusterData:[]
    };
  },
  methods: {
    queryTenant(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false;
             this.getTenantsInfo(query)
          },200);
        } else {
          this.getTenantsInfo('')
        }
    },
    getTenantsInfo(queryName){
        let searchTenantName = queryName
        let tenantNameLen = searchTenantName.length
        let tenantName
        if(tenantNameLen){
          tenantName = Base64.encode(JSON.stringify({
            "tenantName":searchTenantName+"%"
          }))
        }else{
          tenantName =''
        }
        this.$http.get('sysmgr/nlsysmgr/v1/tenants/?q='+tenantName+'&p=&o=')
        .then(response=> {
           let tenantLst = response.data
           this.tenantOptions = tenantLst
           debugger
        })
        .catch(error => {})
    },
    handleSizeChange(val){
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.getClustersInfo()
    },
    handleCurrentChange(val){
      this.pagination.currentPage = val
      this.getClustersInfo()
    },
    getClustersInfo(){
      let searchclusterName = this.searchContent.name
      let clusterNameLen = searchclusterName.length
      let clusterName
      if(clusterNameLen){
        clusterName = Base64.encode(JSON.stringify({
          "clusterName":searchclusterName+"%",
        }))
      }else{
        clusterName =''
      }
      let pagination = {
        currentPage:this.pagination.currentPage,
        pageSize:this.pagination.pageSize
      }
      let paginationString = JSON.stringify(pagination)
      let page = Base64.encode(paginationString)
      this.$http.get('sysmgr/nlsysmgr/v1/clusters/?q='+clusterName+'&p='+page+'&o=')
      .then(response=> {
         let searchContent = response.data
         let clusterLst = searchContent.list
         this.clusterData = clusterLst
         this.pagination.totalRecord = searchContent.totalRecord 
      })
      .catch(error=> {})
    },
    startCluster(index,row){
      let clusterName =  this.clusterData[index].clusterName
      this.$confirm('确定启用该集群：'+clusterName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let clusterId = this.clusterData[index].id  
          this.$http.put('sysmgr/nlsysmgr/v1/clusters/'+clusterId,{
            "clusterName":clusterName,
            "status":1
          }).then(response=>{
            this.getClustersInfo()
            this.$message({
              type: 'success',
              message: '启用成功!'
            })
          }).catch(error=>{})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })       
      })
    },
    stopCluster(index,row){
      let clusterName =  this.clusterData[index].clusterName
      this.$confirm('确定停用该集群：'+clusterName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let clusterId = this.clusterData[index].id  
          this.$http.put('sysmgr/nlsysmgr/v1/clusters/'+clusterId,{
            "clusterName":clusterName,
            "status":0
          }).then(response=>{
            this.getClustersInfo()
            this.$message({
              type: 'success',
              message: '停用成功!'
            })
          }).catch(error=>{})  
        }).catch(error => {
          this.$message({
            type: 'info',
            message: '已取消停用'+error
          })       
        })
    },
    handleEditCluster(index,row){
      this.editclusterIndex = index
      this.editDialogVisible = true
      let curcluster = this.clusterData[index]
      this.editClusterForm = this._.cloneDeep(curcluster)
      this.queryTenant('')
    },
    handleDeleteCluster(index,row){
      let clusterName =  this.clusterData[index].clusterName
      let msg = '确定删除 集群：'+clusterName+' ？'
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let clusterId = this.clusterData[index].id 
          this.$http.delete('sysmgr/nlsysmgr/v1/clusters/'+clusterId).then(response=>{
            this.getClustersInfo()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(error=>{})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })       
        })
    },
    submitEditForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let curcluster = this.editClusterForm
          let curclusterId = curcluster.id 
          let curclusterName = curcluster.clusterName
          let tenantId = curcluster.tenantId
          let type =curcluster.type 
          this.$http.put('sysmgr/nlsysmgr/v1/clusters/'+curclusterId,{
            "clusterName":curclusterName,
            "tenantId":tenantId,
            "type":type
          }).then(response=>{
            this.getClustersInfo()
            this.resetEditForm('editClusterForm')
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
          }).catch(error=>{})  
        } else {
          return false;
        }
      })
    },
    resetEditForm(formName) {
      this.editDialogVisible = false
      this.$refs[formName].resetFields()
      this.editClusterForm={
        clusterName:'',
        tenantId:''
      }
    },
    createCluster(){
      let clusterName = this.createClusterForm.clusterName
      let tenantId = this.createClusterForm.tenantId
      let type = this.createClusterForm.type
      this.$http.post('clusters',{
        "clusterName":clusterName,
        "tenantId":tenantId,
        "type":type
      }).then(response=>{
        this.resetForm('createClusterForm')
        this.getClustersInfo()
        this.$message({
           message: '创建成功',
           type: 'success'
        })  
      }).catch(error=>{})
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createCluster()  
          } else {
            return false;
          }
        })
    },
    resetForm(formName) {
      this.createDialogVisible = false
      this.$refs[formName].resetFields()
    }
  },
  mounted(){
    this.getClustersInfo() 
  }
}
</script>

<style scoped>
.consoleRightBar{background-color: #fff}
.operate{color:#409eff;font-size: 13px;cursor: pointer;padding:0 5px;}
</style>
