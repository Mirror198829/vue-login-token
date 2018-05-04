<!-- 
- Author:CaoJing(08220)
- Date:2018/4/13
-->
<template>
   <div class="consoleRightBar">
      <div style="margin-bottom:25px">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name:'Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name:'ConsolePageHome' }">控制台</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>业务中心</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div>
        <el-form :inline="true" :model="searchContent" size="small">
          <el-form-item>
            <el-input v-model="searchContent.name" placeholder="请输入域名称"
             @keyup.enter.native.prevent="getNamespacesInfo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getNamespacesInfo()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:10px">
        <el-button type="primary" size="small" 
          @click="createDialogVisible = true;getUsersInfo('userLst');getClustersInfo('clusterLst')">创建域</el-button>
      </div>
      <div>
         <el-table
          :data="namespacesData"
          style="width: 100%"
          :border="true">
          <el-table-column
            label="域名称"
            prop="namespaceName"
           >
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
                @click="handleEditNamespace(scope.$index, scope.row)">编辑</span>
              <span class="operate" v-if="scope.row.status != 1"
                @click="handleDeleteNamespace(scope.$index, scope.row)">删除</span>
              <span class="operate" v-if="scope.row.status != 1"
                @click="startNamespace(scope.$index, scope.row)">启用</span>
              <span class="operate" v-if="scope.row.status == 1"
                @click="stopNamespace(scope.$index, scope.row)">停用</span>
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
      title="创建域"
      :visible.sync="createDialogVisible"
      @close="resetDialogForm('createNamespaceForm')"
      >
      <el-form :model="createNamespaceForm" :rules="createnamespacesRules" ref="createNamespaceForm" label-width="100px" class="demo-createNamespaceForm">
        <el-form-item label="域名称" prop="namespaceName">
          <el-input v-model="createNamespaceForm.namespaceName"></el-input>
        </el-form-item> 
        <el-form-item label="用户组" prop="groupId">
              <el-select
                v-model="createNamespaceForm.groupId"
                filterable
                remote
                placeholder="请输入查询的组名"
                :remote-method="queryGroup"
                :loading="loading">
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="添加用户" prop="users">
            <el-transfer
             filterable
             v-model="createNamespaceForm.users"
             :titles="['用户列表', '当前域']"
             :data="userLst">
            </el-transfer>
        </el-form-item>
        <el-form-item label="添加集群" prop="clusters">
            <el-transfer
             filterable
             v-model="createNamespaceForm.clusters"
             :titles="['集群列表', '当前域']"
             :data="clusterLst">
            </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  @click="submitForm('createNamespaceForm')">立即创建</el-button>
          <el-button size="small" @click="resetDialogForm('createNamespaceForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>

    <el-dialog
      title="域编辑"
      :visible.sync="editDialogVisible"
      @close="resetDialogForm('editNamespaceForm')"
      >
      <el-form :model="editNamespaceForm" :rules="editnamespacesRules" ref="editNamespaceForm" label-width="100px" class="demo-createNamespaceForm">
        <el-form-item label="域名称" prop="namespaceName">
          <el-input v-model="editNamespaceForm.namespaceName"></el-input>
        </el-form-item>
        <el-form-item label="组" prop="groupId">
          <el-select
                v-model="editNamespaceForm.groupId"
                filterable
                remote
                placeholder="请输入查询的组名"
                :remote-method="queryGroup"
                :loading="loading">
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.groupName"
                  :value="item.id">
                </el-option>
              </el-select>
        </el-form-item>
        <el-form-item label="添加用户" prop="users">
            <el-transfer
             filterable
             v-model="editNamespaceForm.users"
             :titles="['用户列表', '当前域']"
             :data="editUserLst">
            </el-transfer>
        </el-form-item>
        <el-form-item label="添加集群" prop="clusters">
            <el-transfer
             filterable
             v-model="editNamespaceForm.clusters"
             :titles="['用户列表', '当前域']"
             :data="editClusterLst">
            </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary"  @click="submitEditForm('editNamespaceForm')">确定</el-button>
          <el-button size="small" @click="resetDialogForm('editNamespaceForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
   </div>
</template>

<script>
export default {
  data() {
    let checkNamespaceName = (rule, value, callback) => {
        let searchnamespaceName = value
        let namespaceNameLen = searchnamespaceName.length
        let namespaceName
        if(namespaceNameLen){
          namespaceName = Base64.encode(JSON.stringify({
            "namespaceName":searchnamespaceName
          }))
        }else{
          namespaceName =''
        }
        let pagination = {
          currentPage:this.pagination.currentPage,
          pageSize:this.pagination.pageSize
        }
        let paginationString = JSON.stringify(pagination)
        let page = Base64.encode(paginationString)
        this.$http.get('sysmgr/nlsysmgr/v1/namespaces/?q='+namespaceName+'&p='+page+'&o=')
        .then(response=> {
           let totalRecord = response.data.totalRecord 
           if(totalRecord){
            return callback(new Error('域名已存在'));
           }else{
            callback()
           }
        })
        .catch(error=> {
            let msg
            if(error.response){
              msg = error.response.data.msg
            }else{
              msg = "查询域名失败"
            }
            this.$message({
                type: 'error',
                message: msg
            })
        })
    }
    let checkEditName = (rule, value, callback) => {
        let searchnamespaceName = value
        let namespaceNameLen = searchnamespaceName.length
        let namespaceName
        let compareName =  this.namespacesData[this.editnamespacesIndex].namespaceName
        if(compareName ==  value) callback()
        if(namespaceNameLen){
          namespaceName = Base64.encode(JSON.stringify({
            "namespaceName":searchnamespaceName
          }))
        }else{
          namespaceName =''
        }
        let pagination = {
          currentPage:this.pagination.currentPage,
          pageSize:this.pagination.pageSize
        }
        let paginationString = JSON.stringify(pagination)
        let page = Base64.encode(paginationString)
        this.$http.get('sysmgr/nlsysmgr/v1/namespaces/?q='+namespaceName+'&p='+page+'&o=')
        .then(response=> {
           let totalRecord = response.data.totalRecord 
           if(totalRecord){
             return callback(new Error('域名已存在'));
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
      editClusterLst:[],
      editUserLst:[],
      userLst:[],
      clusterLst:[],
      groupOptions:[],
      loading:false,
      pagination:{
        currentPage:0,
        totalRecord:0,
        pageSize:5
      },
      editnamespacesIndex:0,
      createNamespaceForm: {
          namespaceName: '',
          groupId:'',
          users:[],
          clusters:[]
      },
      editNamespaceForm:{
         namespaceName: '',
         groupId:'',
         users:[],
         clusters:[]
      },
      createnamespacesRules: {
          namespaceName: [
            { required: true, message: '域名称不得为空', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]{1,50}$/, message: '只能输入50位内字母、数字或者下划线' },
            { validator: checkNamespaceName, trigger: 'blur' }
          ],
          groupId:[
            { required: true, message: '域管理员不得为空', trigger: 'blur' }
          ]
      },
      editnamespacesRules:{
          namespaceName: [
            { required: true, message: '域名称不得为空', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]{1,50}$/, message: '只能输入字母、数字或者下划线' },
            { validator: checkEditName, trigger: 'blur' }
          ],
          groupId:[
            { required: true, message: '域管理员不得为空', trigger: 'blur' }
          ]
      },
      createDialogVisible:false,
      editDialogVisible:false,
      searchContent:{
        name:''
      },
      namespacesData:[]
    }
  },
  methods: {
    getUsersInfo(userLstParam){
      this[userLstParam] = []
      this.$http.get('sysmgr/nlsysmgr/v1/users/?q=&p=&o=')
      .then(response=> {
         let userLst =  response.data
         userLst.forEach((item,index) => {
            this[userLstParam].push({key:item.id,label:item.username})
         })
      })
      .catch(error=> {
          this.$message({
              type: 'error',
              message: error
          })
      })
    },
    getClustersInfo(clusterLstParam){
      this[clusterLstParam] = []
      this.$http.get('sysmgr/nlsysmgr/v1/clusters/?q=&p=&o=')
      .then(response=> {
         let clusterLst =  response.data
         clusterLst.forEach((item,index) => {
            this[clusterLstParam].push({key:item.id,label:item.clusterName})
         })
      })
      .catch(error=> {
          this.$message({
              type: 'error',
              message: error
          })
      })
    },
    queryGroup(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
             this.loading = false;
             this.getGroupsInfo(query)
          },200);
        } else {
          this.getGroupsInfo('')
        }
    },
    getGroupsInfo(queryName){
        let searchGroupName = queryName
        let groupNameLen = searchGroupName.length
        let groupName
        if(groupNameLen){
          groupName = Base64.encode(JSON.stringify({
            "groupName":searchGroupName+"%"
          }))
        }else{
          groupName =''
        }
        this.$http.get('sysmgr/nlsysmgr/v1/groups/?q='+groupName+'&p=&o=')
        .then(response=> {
           let groupLst = response.data
           this.groupOptions = groupLst
        })
        .catch(error=> {
            this.$message({
                type: 'error',
                message: error
            })
        })
    },
    handleSizeChange(val){
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.getNamespacesInfo()
    },
    handleCurrentChange(val){
      this.pagination.currentPage = val
      this.getNamespacesInfo()
    },
    getNamespacesInfo(){
      let searchnamespaceName = this.searchContent.name
      let namespaceNameLen = searchnamespaceName.length
      let namespaceName
      if(namespaceNameLen){
        namespaceName = Base64.encode(JSON.stringify({
          "namespaceName":searchnamespaceName+"%",
        }))
      }else{
        namespaceName =''
      }
      let pagination = {
        currentPage:this.pagination.currentPage,
        pageSize:this.pagination.pageSize
      }
      let paginationString = JSON.stringify(pagination)
      let page = Base64.encode(paginationString)
      this.$http.get('sysmgr/nlsysmgr/v1/namespaces/?q='+namespaceName+'&p='+page+'&o=')
      .then(response=> {
         let searchContent = response.data
         let namespacesLst = searchContent.list
         this.namespacesData = namespacesLst
         this.pagination.totalRecord = searchContent.totalRecord 
      })
      .catch(error=> {
          this.$message({
              type: 'error',
              message: error
          })
      })
    },
    startNamespace(index,row){
      let namespaceName =  this.namespacesData[index].namespaceName
      this.$confirm('确定启用该域：'+namespaceName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let groupId = this.namespacesData[index].groupId  
          let namespacesId = this.namespacesData[index].id
          this.$http.put('sysmgr/nlsysmgr/v1/namespaces/'+namespacesId,{
            "namespaceName":namespaceName,
            "groupId":groupId,
            "status":1
          }).then(response=>{
            this.getNamespacesInfo()
            this.$message({
              type: 'success',
              message: '启用成功!'
            })
          }).catch(error=>{
            this.$message({
              type: 'success',
              message: error
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消启用'
          })       
      })
    },
    stopNamespace(index,row){
      let namespaceName =  this.namespacesData[index].namespaceName
      this.$confirm('确定停用该域：'+namespaceName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let namespacesId = this.namespacesData[index].id  
          let groupId = this.namespacesData[index].groupId  
          this.$http.put('sysmgr/nlsysmgr/v1/namespaces/'+namespacesId,{
            "namespaceName":namespaceName,
            "groupId":groupId,
            "status":0
          }).then(response=>{
            this.getNamespacesInfo()
            this.$message({
              type: 'success',
              message: '停用成功!'
            })
          }).catch(error=>{
            this.$message({
              type: 'info',
              message: '已取消启用'
            })
          })  
        }).catch(error => {
          this.$message({
            type: 'info',
            message: '已取消停用'+error
          })       
        })
    },
    handleEditNamespace(index,row){
      let uuid = this.namespacesData[index].id 
      this.$http.get('sysmgr/nlsysmgr/v1/namespaces/'+uuid+'/detail')
      .then(response=> { 
        this.getUsersInfo('editUserLst') 
        this.getClustersInfo('editClusterLst')      
        this.editnamespacesIndex = index
        this.editDialogVisible = true
        let curnamespace = response.data
        let selectUsers = []
        let selectClusters = []
        this.editNamespaceForm.namespaceName = curnamespace.namespaceName
        this.editNamespaceForm.groupId = curnamespace.groupId
        this.editNamespaceForm.users = []
        this.editNamespaceForm.clusters = []
        this.editNamespaceForm.id = uuid
        curnamespace.users.forEach((item,key) => {
          this.editNamespaceForm.users.push(item.id)
        })
        curnamespace.clusters.forEach((item,key) => {
          this.editNamespaceForm.clusters.push(item.id)
        })
        this.queryGroup('')
      })
      .catch(error=> {
          let errorMsg = '出错了'
          this.$message({
              type: 'success',
              message: error
          })
      })
    },
    handleDeleteNamespace(index,row){
      let namespaceName =  this.namespacesData[index].namespaceName
      let msg = '确定删除 域：'+namespaceName+' ？'
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let namespacesId = this.namespacesData[index].id 
          this.$http.delete('sysmgr/nlsysmgr/v1/namespaces/'+namespacesId).then(response=>{
            this.getNamespacesInfo()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(error=>{
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
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
          let curnamespaces = this.editNamespaceForm
          let curnamespacesId = curnamespaces.id 
          let curnamespaceName = curnamespaces.namespaceName
          let groupId = curnamespaces.groupId
          let selectUsers = curnamespaces.users
          let selectClusters = curnamespaces.clusters
          let users = []
          let clusters = []
          selectUsers.forEach((item,key) => {
            users.push({id:item})
          })
          selectClusters.forEach((item,key) => {
            clusters.push({id:item})
          })
          this.$http.put('sysmgr/nlsysmgr/v1/namespaces/'+curnamespacesId,{
            "namespaceName":curnamespaceName,
            "groupId":groupId,
            "users":users,
            "clusters":clusters
          }).then(response=>{
            this.getNamespacesInfo()
            this.resetDialogForm('editNamespaceForm')
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
          }).catch(error=>{
          })  
        } else {
          return false;
        }
      })
    },
    createnamespaces(){
      let namespaceName = this.createNamespaceForm.namespaceName
      let groupId = this.createNamespaceForm.groupId
      let users =  this.createNamespaceForm.users
      let clusters =  this.createNamespaceForm.clusters
      let userLst = []
      let clusterLst = []
      users.forEach((item,key) => {
        userLst.push({id:item})
      })
      clusters.forEach((item,key) => {
        clusterLst.push({id:item})
      })
      this.$http.post('sysmgr/nlsysmgr/v1/namespaces',{
        "namespaceName":namespaceName,
        "groupId":groupId,
        "users":userLst,
        "clusters":clusterLst
      }).then(response=>{
        this.resetDialogForm('createNamespaceForm')
        this.getNamespacesInfo()
        this.$message({
           message: '创建成功',
           type: 'success'
        })  
      }).catch(error=>{
        let errorMsg = error.response
        this.$message({
           message: '创建失败!'+errorMsg,
           type: 'error'
        })
      })
    },
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.createnamespaces()  
          } else {
            return false;
          }
        })
      },
    resetDialogForm(formName) {
      if(formName == 'createNamespaceForm'){
        this.createDialogVisible = false
      }else{
        this.editDialogVisible = false
      }
      this[formName].users = []
      this[formName].clusters = []
      this.$refs[formName].resetFields() 
    }
  },
  mounted(){
    this.getNamespacesInfo() 
  }
}
</script>

<style scoped>
.consoleRightBar{background-color: #fff}
.operate{color:#409eff;font-size: 13px;cursor: pointer;padding:0 5px;}
</style>
