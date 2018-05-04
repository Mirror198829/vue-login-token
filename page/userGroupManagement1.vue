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
        <el-breadcrumb-item>用户组管理</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div>
        <el-form :inline="true" :model="searchContent" class="demo-form-inline" size="small">
          <el-form-item>
            <el-input v-model="searchContent.name" placeholder="请输入用户组名称"
             @keyup.enter.native="getGroupsInfo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getGroupsInfo()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom:10px">
        <el-button type="primary" size="small" @click="dialogVisible = true;getUsersInfo('userLst')">创建用户组</el-button>
      </div>
   <div class="block">
    <el-tree
      :data="data4"
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </div>
      <div>
         <el-table
          :data="groupData"
          style="width: 100%"
          :border="true">
          <el-table-column
            label="用户组名称"
            prop="groupName"
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
                @click="handleEdit(scope.$index, scope.row)">编辑</span>
              <span class="operate" v-if="scope.row.status != 1"
                @click="handleDelete(scope.$index, scope.row)">删除</span>
              <span class="operate" v-if="scope.row.status != 1"
                @click="startGroup(scope.$index, scope.row)">启用</span>
              <span class="operate" v-if="scope.row.status == 1"
                @click="stopGroup(scope.$index, scope.row)">停用</span>
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
      title="创建用户组"
      :visible.sync="dialogVisible"
      @close="resetForm('creategroupForm')"
      >
      <el-form :model="creategroupForm" :rules="creategroupRules" ref="creategroupForm" label-width="100px" class="demo-creategroupForm">
        <el-form-item label="用户组名称" prop="groupName">
          <el-input v-model="creategroupForm.groupName"></el-input>
        </el-form-item> 
        <el-form-item label="租户" prop="tenantId">
              <el-select
                v-model="creategroupForm.tenantId"
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
        <el-form-item label="添加用户" prop="users">
            <el-transfer
             filterable
             v-model="creategroupForm.users"
             :titles="['用户列表', '当前域']"
             :data="userLst">
            </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small"  @click="submitForm('creategroupForm')">立即创建</el-button>
          <el-button size="small" @click="resetForm('creategroupForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
    <el-dialog
      title="用户组编辑"
      :visible.sync="editDialogVisible"
      @close="resetEditForm('editGroupForm')"
      >
      <el-form :model="editGroupForm" :rules="editgroupRules" ref="editGroupForm" label-width="100px" class="demo-creategroupForm">
        <el-form-item label="用户组名称" prop="groupName">
          <el-input v-model="editGroupForm.groupName"></el-input>
        </el-form-item>
        <el-form-item label="租户" prop="tenantId">
          <el-select
              v-model="editGroupForm.tenantId"
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
        <el-form-item label="添加用户" prop="users">
            <el-transfer
             filterable
             v-model="editGroupForm.users"
             :titles="['用户列表', '当前域']"
             :data="editUserLst">
            </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary"  @click="submitEditForm('editGroupForm')">确定</el-button>
          <el-button size="small" @click="resetEditForm('editGroupForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
   </div>
</template>

<script>
export default {
  data() {
    let checkName = (rule, value, callback) => {
        let searchgroupName = value
        let groupNameLen = searchgroupName.length
        let groupName
        if(groupNameLen){
          groupName = Base64.encode(JSON.stringify({
            "groupName":searchgroupName
          }))
        }else{
          groupName =''
        }
        let pagination = {
          currentPage:this.pagination.currentPage,
          pageSize:this.pagination.pageSize
        }
        let paginationString = JSON.stringify(pagination)
        let page = Base64.encode(paginationString)
        this.$http.get('sysmgr/nlsysmgr/v1/groups/?q='+groupName+'&p='+page+'&o=')
        .then(response=> {
           let totalRecord = response.data.totalRecord 
           if(totalRecord){
            return callback(new Error('用户组名已存在'));
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
    let checkEditName = (rule, value, callback) => {
        let searchgroupName = value
        let groupNameLen = searchgroupName.length
        let groupName
        let compareName =  this.groupData[this.editgroupIndex].groupName
        if(compareName ==  value) callback()
        if(groupNameLen){
          groupName = Base64.encode(JSON.stringify({
            "groupName":searchgroupName
          }))
        }else{
          groupName =''
        }
        let pagination = {
          currentPage:this.pagination.currentPage,
          pageSize:this.pagination.pageSize
        }
        let paginationString = JSON.stringify(pagination)
        let page = Base64.encode(paginationString)
        this.$http.get('sysmgr/nlsysmgr/v1/groups/?q='+groupName+'&p='+page+'&o=')
        .then(response=> {
           let totalRecord = response.data.totalRecord 
           if(totalRecord){
            return callback(new Error('用户组名已存在'));
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
      data4:[{
        id: 1,
        label: '一级 112313131321',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      editUserLst:[],
      userLst:[],
      tenantOptions:[],
      loading:false,
      groupMgrId:0,
      pagination:{
        currentPage:0,
        totalRecord:0,
        pageSize:5
      },
      editgroupIndex:0,
      timeout:  null,
      creategroupForm: {
          groupName: '',
          tenantId:'',
          users:[]
      },
      editGroupForm:{
        groupName:'',
        tenantId:'',
        users:[],
        id:''
      },
      creategroupRules: {
          groupName: [
            { required: true, message: '请输入用户组名称', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]{1,50}$/, message: '只能输入50位内字母、数字或者下划线' },
            { validator: checkName, trigger: 'blur' }
          ],
          tenantId:[
            { required: true, message: '请输入用户组管理员', trigger: 'blur' }
          ]
      },
      editgroupRules:{
          groupName: [
            { required: true, message: '请输入用户组名称', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]{1,50}$/, message: '只能输入字母、数字或者下划线' },
            { validator: checkEditName, trigger: 'blur' }
          ],
          tenantId:[
            { required: true, message: '请输入用户组管理员', trigger: 'blur' }
          ]
      },
      dialogVisible:false,
      editDialogVisible:false,
      searchContent:{
        name:''
      },
      groupData:[]
    };
  },
  methods: {
    append(data){
      console.log(data)
    },
    renderContent(h, { node, data, store }) {       
      if(data.children){
        return (
          <span class="custom-tree-node">
            <span>{node.label} (id:{node.id})</span>
          </span>)
      }else{
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text"  on-click={ () => this.append(data)}>Append</el-button>
              <i class="fa fa-trash-o fa-lg" style="font-size:10px">Delete</i>
            </span>
          </span>
        )
      }
    },
    handleNodeClick(data) {
        console.log(data)
    },
    getUsersInfo(userLstParam){
      this[userLstParam] = []
      this.$http.get('sysmgr/nlsysmgr/v1/users/?q=&p=&o=')
      .then(response=> {
         let userLst =  response.data
         userLst.forEach((item,index) => {
            this[userLstParam].push({key:item.id,label:item.username})
         })
      })
      .catch(error=> {})
    },
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
        })
        .catch(error=> {})
    },
    handleSizeChange(val){
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.getGroupsInfo()
    },
    handleCurrentChange(val){
      this.pagination.currentPage = val
      this.getGroupsInfo()
    },
    getGroupsInfo(){
      let searchgroupName = this.searchContent.name
      let groupNameLen = searchgroupName.length
      let groupName
      if(groupNameLen){
        groupName = Base64.encode(JSON.stringify({
          "groupName":searchgroupName+"%",
        }))
      }else{
        groupName =''
      }
      let pagination = {
        currentPage:this.pagination.currentPage,
        pageSize:this.pagination.pageSize
      }
      let paginationString = JSON.stringify(pagination)
      let page = Base64.encode(paginationString)
      this.$http.get('sysmgr/nlsysmgr/v1/groups/?q='+groupName+'&p='+page+'&o=')
      .then(response=> {
         let searchContent = response.data
         let groupLst = searchContent.list
         this.groupData = groupLst
         this.pagination.totalRecord = searchContent.totalRecord 
      })
      .catch(error => {})
    },
    startGroup(index,row){
      let groupName =  this.groupData[index].groupName
      this.$confirm('确定启用该用户组：'+groupName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let groupId = this.groupData[index].id  
          this.$http.put('sysmgr/nlsysmgr/v1/groups/'+groupId,{
            "groupName":groupName,
            "status":1
          }).then(response=>{
            this.getGroupsInfo()
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
    stopGroup(index,row){
      let groupName =  this.groupData[index].groupName
      this.$confirm('确定停用该用户组：'+groupName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let groupId = this.groupData[index].id  
          this.$http.put('sysmgr/nlsysmgr/v1/groups/'+groupId,{
            "groupName":groupName,
            "status":0
          }).then(response=>{
            this.getGroupsInfo()
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
    handleEdit(index,row){
      let uuid = this.groupData[index].id 
      this.$http.get('sysmgr/nlsysmgr/v1/groups/'+uuid+'/detail')
      .then(response=> {
        this.editgroupIndex = index
        this.getUsersInfo('editUserLst')
        let curUserGroup = response.data
        this.editGroupForm.groupName =  curUserGroup.groupName
        this.editGroupForm.tenantId =  curUserGroup.tenantId
        this.editGroupForm.users = []
        this.editGroupForm.id = curUserGroup.id
        curUserGroup.users.forEach((item,key) => {
          this.editGroupForm.users.push(item.id)
        })
        this.queryTenant('')
        this.editDialogVisible = true
       }).catch(error => {})   
    },
    handleDelete(index,row){
      let groupName =  this.groupData[index].groupName
      let msg = '确定删除 用户组：'+groupName+' ？'
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let groupId = this.groupData[index].id 
          this.$http.delete('sysmgr/nlsysmgr/v1/groups/'+groupId).then(response=>{
            this.getGroupsInfo()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(error=>{
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
          let curgroup = this.editGroupForm
          let curgroupId = curgroup.id 
          let curgroupName = curgroup.groupName
          let tenantId = curgroup.tenantId
          let users = []
          curgroup.users.forEach((item,key) => {
            users.push({id:item})
          })
          this.$http.put('sysmgr/nlsysmgr/v1/groups/'+curgroupId,{
            "groupName":curgroupName,
            "tenantId":tenantId,
            "users":users
          }).then(response=>{
            this.getGroupsInfo()
            this.resetEditForm('editGroupForm')
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
      this.editGroupForm.users=[]
    },
    creategroup(){
      let groupName = this.creategroupForm.groupName
      let tenantId = this.creategroupForm.tenantId
      let userLst = this.creategroupForm.users
      let users = []
      userLst.forEach((item,key) => {
        users.push({id:item})
      })
      this.$http.post('sysmgr/nlsysmgr/v1/groups',{
        "groupName":groupName,
        "tenantId":tenantId,
        "users":users
      }).then(response=>{
        this.resetForm('creategroupForm')
        this.getGroupsInfo()
        this.$message({
           message: '创建成功',
           type: 'success'
        })  
      }).catch(error=>{})
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.creategroup()  
        } else {
          return false;
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false 
      this[formName].users = []
      this.$refs[formName].resetFields()
    }
  },
  mounted(){
    this.getGroupsInfo() 
  }
}
</script>
<style scoped>
.consoleRightBar{background-color: #fff}
.operate{color:#409eff;font-size: 13px;cursor: pointer;padding:0 5px;}
</style>