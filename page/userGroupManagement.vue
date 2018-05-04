<!-- 
- Author:CaoJing(08220)
- Date:2018/5/2
-->
<template>
   <div class="consoleRightBar">
      <div style="margin-bottom:25px">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name:'Home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name:'ConsolePageHome' }">控制台</el-breadcrumb-item>
        <el-breadcrumb-item>系统管理</el-breadcrumb-item>
        <el-breadcrumb-item>工作组管理</el-breadcrumb-item>
      </el-breadcrumb>
      </div>
      <div style="margin-bottom:25px">
        <el-button type="primary" size="small" @click="opencreateWorkerGroupForm()">创建工作组</el-button>
      </div>
   <div class="block clearfix" style="height:600px">
       <div id="workerGroupTree">
          <el-tree
            :data="workerGroupData"
            node-key="id"
            @node-click="handleNodeClick"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
       </div>
       <div id="workerGroupPanel">
            <h1 class="workerGroupPanelTitle">当前工作组信息</h1>
            <div class="workerGroupPanelLine clearfix">
              <span class="workerGroupPanelLabel">工作组名称 ：</span>
              <span class="workerGroupPanelConent">{{curWorkerGroup.workerGroupName}}</span>
            </div>
            <div class="workerGroupPanelLine clearfix">
              <span class="workerGroupPanelLabel">创建时间 ：</span>
              <span class="workerGroupPanelConent">{{curWorkerGroup.createTime}}</span>
            </div>
            <div class="workerGroupPanelLine clearfix" style="position:relative;">
              <span class="workerGroupPanelLabel">状态 :</span>
              <span v-if="curWorkerGroup.status == 1">
                <i class="fa fa-circle workerGroupCircle workerGroupIsOn"></i>
                <span class="workerGroupPanelConent">启动</span>
                <el-button type="primary" size="mini" style="position:absolute;left:120px;top:-2px"
                @click="changeWorkerGroupStatus(curWorkerGroup.id,0,curWorkerGroup.workerGroupName,curWorkerGroup.workerGroupUserRoles)">停用</el-button>
              </span>
              <span  v-if="curWorkerGroup.status == 0">
                <i class="fa fa-circle workerGroupCircle"></i>
                <span class="workerGroupPanelConent">停用</span>
                <el-button type="primary" size="mini" style="position:absolute;left:120px;top:-2px"
                @click="changeWorkerGroupStatus(curWorkerGroup.id,1,curWorkerGroup.workerGroupName)">启用</el-button>
              </span>  
            </div>
            <div class="workerGroupPanelLine clearfix" style="width:calc(100% - 75px)">
              <div class="workerGroupPanelDescLabel">描述 :</div>
              <div class="workerGroupPanelDesc">{{curWorkerGroup.desc}}</div>
            </div>          
            <div class="workerGroupPanelLine  clearfix">
              <span class="workerGroupPanelLabel">用户信息 :</span>
            </div>
            <div class="workerGroupTable">
                <el-table
                  :data="curWorkerGroup.workerGroupUserRoles"
                  border
                  style="width: 100%"
                  height="300">
                  <el-table-column
                    prop="username"
                    label="用户名">
                  </el-table-column>
                  <el-table-column
                    prop="roleGroupName"
                    label="角色组">

                  </el-table-column>
                </el-table>
            </div>
       </div>
   </div>
    <el-dialog
      title="创建工作组"
      :visible.sync="createWokerGroupForm.dialogVisible"
      @close="resetForm('createWokerGroupForm')"
      >
      <el-dialog
        width="30%"
        title="选择用户角色组"
        :visible.sync="createWokerGroupForm.innerVisible"
        @close="resetInnerForm('createWokerGroupForm')"
        append-to-body>
        <el-form>
          <el-form-item label="角色组">
            <el-select v-model="createWokerGroupForm.roleGroupId" placeholder="请选择活动区域">
              <el-option
                v-for="item in createWokerGroupForm.roleGroupOptions"
                :key="item.id"
                :label="item.roleGroupName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="changeUsersRoleGroup('createWokerGroupForm')">确定</el-button>
            <el-button @click="resetInnerForm('createWokerGroupForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-form :model="createWokerGroupForm" :rules="createWorkerGroupFormRules" ref="createWokerGroupForm" label-width="100px" class="demo-createWokerGroupForm">         
        <div style="text-align:center;margin-bottom:25px">
          <el-steps :active="createWokerGroupForm.active" align-center>
            <el-step title="创建工作组"></el-step>
            <el-step title="添加用户和角色"></el-step>
          </el-steps>
        </div>
        <div v-show="createWokerGroupForm.active == 1">
            <el-form-item label="工作组名称" prop="workerGroupName">
              <el-input v-model="createWokerGroupForm.workerGroupName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input type="textarea":rows="2" v-model="createWokerGroupForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="租户" prop="tenantId">
                <el-select
                  v-model="createWokerGroupForm.tenantId"
                  filterable
                  remote
                  placeholder="租户名"
                  :remote-method="queryTenant"
                  :loading="loading"
                  @change="selectTenant('createWokerGroupForm')">
                  <el-option
                    v-for="item in tenantOptions"
                    :key="item.id"
                    :label="item.tenantName"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-row v-show="createWokerGroupForm.parentLst.length && createWokerGroupForm.tenantId">
              <el-col :span="12"> 
                <el-form-item label="是否为根节点">           
                  <el-switch
                    v-model="createWokerGroupForm.isRoot"
                    active-color="#409eff">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12"  v-show="!createWokerGroupForm.isRoot">
                <el-form-item label="父节点" prop="parentId">
                    <el-select v-model="createWokerGroupForm.parentId" placeholder="请选择">
                      <el-option
                        v-for="item in createWokerGroupForm.parentLst"
                        :key="item.id"
                        :label="item.workerGroupName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col> 
            </el-row>
        </div>
        <div v-show="createWokerGroupForm.active == 2">
           <el-row  :gutter="20">
            <el-col :span="10">
              <el-row style="margin-bottom:10px">
            <el-button type="primary" size="mini" v-if="createWokerGroupForm.leftUsersMultipleSelection.length" @click="openRoleGroupInnerDialog(0,'','multiple','createWokerGroupForm')">批量修改角色组</el-button>
            <el-button type="primary" size="mini" v-else disabled>批量修改角色组</el-button> 
           </el-row>
              <el-table
                :data="createWokerGroupForm.usersTable"
                border
                height="350"
                ref="usersTable"
                @selection-change="handleLeftMultipleUsersSelectionChange">
                <el-table-column
                  type="selection"
                >
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="用户名"
                 >
                </el-table-column>
                <el-table-column
                  prop="roleGroupName"
                  label="角色组"
                 >
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span class="operate" @click="openRoleGroupInnerDialog(scope.$index, scope.row,'single','createWokerGroupForm')">修改角色组</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="4">
              <div style="text-align:center;margin-top:150px;">
                <el-button  @click="removeUsersTable('add','createWokerGroupForm')" type="primary" size="mini" v-if="createWokerGroupForm.leftUsersMultipleSelection.length">
                 <i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i> 添加
                </el-button>
                <el-button type="primary" size="mini" v-else  disabled>
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i> 添加
                </el-button>
              </div>
              <div style="text-align:center;margin-top:20px;">
                <el-button  @click="removeUsersTable('remove','createWokerGroupForm')" type="primary" size="mini" v-if="createWokerGroupForm.rightUsersMultipleSelection.length">
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i> 移除
                </el-button>
                <el-button type="primary" size="mini" v-else  disabled>
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i> 移除
                </el-button>
              </div>
            </el-col>
            <el-col :span="10">
              <el-row>
                <el-badge :value="createWokerGroupForm.selectUsersTable.length" class="item">
                  <h3 style="font-size:16px;font-weight:400;margin-bottom:12px;">已添加用户&nbsp&nbsp</h3>
                </el-badge>
              </el-row>
              <el-table
                :data="createWokerGroupForm.selectUsersTable"
                border
                height="350"
                ref="selectUsersTable"
                @selection-change="handleRightMultipleUsersSelectionChange">
                <el-table-column
                  type="selection"
                >
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="用户名"
                 >
                </el-table-column>
                <el-table-column
                  prop="roleGroupName"
                  label="角色组"
                 >
                </el-table-column>
              </el-table>
            </el-col>
          </el-row> 
        </div> 
        <el-form-item>
          <el-button v-show="createWokerGroupForm.active == 1" type="primary" size="small"  @click="createWokerGroupForm.active = 2">下一步</el-button>
          <el-button v-show="createWokerGroupForm.active == 2" type="primary" size="small"  @click="createWokerGroupForm.active = 1">上一步</el-button>
          <el-button type="primary" size="small"  @click="submitForm('createWokerGroupForm')">立即创建</el-button>
          <el-button size="small" @click="resetForm('createWokerGroupForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
    <el-dialog
      title="编辑工作组"
      :visible.sync="editWokerGroupForm.dialogVisible"
      @close="resetForm('editWokerGroupForm')"
      >
      <el-dialog
        width="30%"
        title="选择用户角色组"
        :visible.sync="editWokerGroupForm.innerVisible"
        @close="resetInnerForm('editWokerGroupForm')"
        append-to-body>
        <el-form>
          <el-form-item label="角色组">
            <el-select v-model="editWokerGroupForm.roleGroupId" placeholder="请选择活动区域">
              <el-option
                v-for="item in editWokerGroupForm.roleGroupOptions"
                :key="item.id"
                :label="item.roleGroupName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small">
            <el-button type="primary" @click="changeUsersRoleGroup('editWokerGroupForm')">确定</el-button>
            <el-button @click="resetInnerForm('editWokerGroupForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-form :model="editWokerGroupForm" :rules="editWokerGroupFormRules" ref="editWokerGroupForm" label-width="100px">         
        <div style="text-align:center;margin-bottom:25px">
          <el-steps :active="editWokerGroupForm.active" align-center>
            <el-step title="编辑工作组"></el-step>
            <el-step title="编辑用户和角色"></el-step>
          </el-steps>
        </div>
        <div v-show="editWokerGroupForm.active == 1">
            <el-form-item label="工作组名称" prop="workerGroupName">
              <el-input v-model="editWokerGroupForm.workerGroupName"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input type="textarea":rows="2" v-model="editWokerGroupForm.desc"></el-input>
            </el-form-item>
            <el-form-item label="租户" prop="tenantId">
                <el-select
                  v-model="editWokerGroupForm.tenantId"
                  filterable
                  remote
                  placeholder="租户名"
                  :remote-method="queryTenant"
                  :loading="loading"
                  @change="selectTenant('editWokerGroupForm')">
                  <el-option
                    v-for="item in tenantOptions"
                    :key="item.id"
                    :label="item.tenantName"
                    :value="item.id">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-row v-show="editWokerGroupForm.parentLst.length && editWokerGroupForm.tenantId">
              <el-col :span="12"> 
                <el-form-item label="是否为根节点">           
                  <el-switch
                    v-model="editWokerGroupForm.isRoot"
                    active-color="#409eff">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12"  v-show="!editWokerGroupForm.isRoot">
                <el-form-item label="父节点" prop="parentId">
                    <el-select v-model="editWokerGroupForm.parentId" placeholder="请选择">
                      <el-option
                        v-for="item in editWokerGroupForm.parentLst"
                        :key="item.id"
                        :label="item.workerGroupName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
              </el-col> 
            </el-row>
        </div>
        <div v-show="editWokerGroupForm.active == 2">
           <el-row  :gutter="20">
            <el-col :span="10">
              <el-row style="margin-bottom:10px">
            <el-button type="primary" size="mini" v-if="editWokerGroupForm.leftUsersMultipleSelection.length" @click="openRoleGroupInnerDialog(0,'','multiple','editWokerGroupForm')">批量修改角色组</el-button>
            <el-button type="primary" size="mini" v-else disabled>批量修改角色组</el-button> 
           </el-row>
              <el-table
                :data="editWokerGroupForm.usersTable"
                border
                height="350"
                ref="usersTable"
                @selection-change="handleEditLeftMultipleUsersSelectionChange">
                <el-table-column
                  type="selection"
                >
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="用户名"
                 >
                </el-table-column>
                <el-table-column
                  prop="roleGroupName"
                  label="角色组"
                 >
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <span class="operate" @click="openRoleGroupInnerDialog(scope.$index, scope.row,'single','editWokerGroupForm')">修改角色组</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="4">
              <div style="text-align:center;margin-top:150px;">
                <el-button  @click="removeUsersTable('add','editWokerGroupForm')" type="primary" size="mini" v-if="editWokerGroupForm.leftUsersMultipleSelection.length">
                 <i class="fa fa-chevron-right"></i><i class="fa fa-chevron-right"></i> 添加
                </el-button>
                <el-button type="primary" size="mini" v-else  disabled>
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i> 添加
                </el-button>
              </div>
              <div style="text-align:center;margin-top:20px;">
                <el-button  @click="removeUsersTable('remove','editWokerGroupForm')" type="primary" size="mini" v-if="editWokerGroupForm.rightUsersMultipleSelection.length">
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i> 移除
                </el-button>
                <el-button type="primary" size="mini" v-else  disabled>
                  <i class="fa fa-chevron-left"></i><i class="fa fa-chevron-left"></i> 移除
                </el-button>
              </div>
            </el-col>
            <el-col :span="10">
              <el-row>
                <el-badge :value="editWokerGroupForm.selectUsersTable.length" class="item">
                  <h3 style="font-size:16px;font-weight:400;margin-bottom:12px;">已添加用户&nbsp&nbsp</h3>

                </el-badge>
              </el-row>
              <el-table
                :data="editWokerGroupForm.selectUsersTable"
                border
                height="350"
                ref="selectUsersTable"
                @selection-change="handleEditRightMultipleUsersSelectionChange">
                <el-table-column
                  type="selection"
                >
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="用户名"
                 >
                </el-table-column>
                <el-table-column
                  prop="roleGroupName"
                  label="角色组"
                 >
                </el-table-column>
              </el-table>
            </el-col>
          </el-row> 
        </div> 
        <el-form-item>
          <el-button v-show="editWokerGroupForm.active == 1" type="primary" size="small"  @click="editWokerGroupForm.active = 2">下一步</el-button>
          <el-button v-show="editWokerGroupForm.active == 2" type="primary" size="small"  @click="editWokerGroupForm.active = 1">上一步</el-button>
          <el-button type="primary" size="small"  @click="submitForm('editWokerGroupForm')">确定编辑</el-button>
          <el-button size="small" @click="resetForm('editWokerGroupForm')">取消</el-button>
        </el-form-item>  
      </el-form>
    </el-dialog>
   </div>
</template>

<script>
export default {
  data() {
    let checkName = (rule, value, callback) => {
        let searchworkerGroupName = value
        let workerGroupNameLen = searchworkerGroupName.length
        let workerGroupName
        if(workerGroupNameLen){
          workerGroupName = Base64.encode(JSON.stringify({
            "workerGroupName":searchworkerGroupName
          }))
        }else{
          workerGroupName =''
        }
        let pagination = {
          currentPage:this.pagination.currentPage,
          pageSize:this.pagination.pageSize
        }
        let paginationString = JSON.stringify(pagination)
        let page = Base64.encode(paginationString)
        this.$http.get('sysmgr/nlsysmgr/v1/workergroups/?q='+workerGroupName+'&p='+page+'&o=')
        .then(response=> {
           let totalRecord = response.data.totalRecord 
           if(totalRecord){
            return callback(new Error('工作组名已存在'));
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
        let searchworkerGroupName = value
        let workerGroupNameLen = searchworkerGroupName.length
        let workerGroupName
        let compareName =  this.editWorkerGroupCompareName
        if(compareName ==  value) callback()
        if(workerGroupNameLen){
          workerGroupName = Base64.encode(JSON.stringify({
            "workerGroupName":searchworkerGroupName
          }))
          
        }else{
          workerGroupName =''
        }
        let pagination = {
          currentPage:this.pagination.currentPage,
          pageSize:this.pagination.pageSize
        }
        let paginationString = JSON.stringify(pagination)
        let page = Base64.encode(paginationString)
        this.$http.get('sysmgr/nlsysmgr/v1/workergroups/?q='+workerGroupName+'&p='+page+'&o=')
        .then(response=> {
           let totalRecord = response.data.totalRecord 
           if(totalRecord){
            return callback(new Error('工作组名已存在'));
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
      workerGroupData:[],
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
      editWorkerGroupCompareName:null,
      timeout:  null,
      createWokerGroupForm: {
        dialogVisible:false,
        roleGroupOptions:[],
        roleGroupId:'',
        innerVisible:false,
        workerGroupName: '',
        active:1,
        tenantId:'',
        parentId:'',
        desc:'',
        isRoot:false,
        parentLst:[{workerGroup:{}}],
        workerGroupUserRoles:[],
        usersTable:[],//左侧：用户表格
        leftUsersMultipleSelection:[],//左侧：记录多选用户信息
        selectUsersForRoleGroup:[],//记录批量和单个操作用户信息
        selectUsersTable:[],//右侧：已经添加用户表格
        rightUsersMultipleSelection:[] //右侧：记录多选用户信息
      },
      editWokerGroupForm:{
        dialogVisible:false,
        roleGroupOptions:[],
        roleGroupId:'',
        innerVisible:false,
        workerGroupName: '',
        active:1,
        tenantId:'',
        parentId:'',
        desc:'',
        isRoot:false,
        parentLst:[{workerGroup:{}}],
        workerGroupUserRoles:[],
        usersTable:[],//左侧：用户表格
        leftUsersMultipleSelection:[],//左侧：记录多选用户信息
        selectUsersForRoleGroup:[],//记录批量和单个操作用户信息
        selectUsersTable:[],//右侧：已经添加用户表格
        rightUsersMultipleSelection:[], //右侧：记录多选用户信息
        workerGroupId:null
      },
      createWorkerGroupFormRules: {
          workerGroupName: [
            { required: true, message: '请输入工作组名称', trigger: 'blur' },
            { pattern: /^[a-zA-Z\u4e00-\u9fa5][A-Za-z0-9_\u4e00-\u9fa5]{0,19}$/, message: '20位内汉字、字母、数字或者下划线'},
            { validator: checkName, trigger: 'blur' }
          ],
          tenantId:[
            { required: true, message: '请输入工作组管理员', trigger: 'blur' }
          ],
          desc:[
            { required: true, message: '请输入工作组描述', trigger: 'blur' },
            { min:1,max: 100,message: '最大长度不得超过100位'}
          ],
          groupId:[
            {required: true, message: '请选择角色组', trigger: 'blur' }
          ]
      },
      editWokerGroupFormRules:{
          workerGroupName: [
            { required: true, message: '请输入工作组名称', trigger: 'blur' },
            { pattern: /^[a-zA-Z\u4e00-\u9fa5][A-Za-z0-9_\u4e00-\u9fa5]{0,19}$/, message: '20位内汉字、字母、数字或者下划线'},
            { validator: checkEditName, trigger: 'blur' }
          ],
          tenantId:[
            { required: true, message: '请输入工作组管理员', trigger: 'blur' }
          ],
          desc:[
            { required: true, message: '请输入工作组描述', trigger: 'blur' },
            { min:1,max: 100,message: '最大长度不得超过100位'}
          ],
          groupId:[
            {required: true, message: '请选择角色组', trigger: 'blur' }
          ]
      },
      editDialogVisible:false,
      searchContent:{name:''},
      curWorkerGroup:{
        workerGroupName:'',
        desc:'',
        createTime:'',
        status:3,
        workerGroupUserRoles:[],
        id:null
      }
    };
  },
  methods: {
    removeUsersTable(type,formName){
      let multipleSelection0 = ( type == 'remove' ? 'rightUsersMultipleSelection' : 'leftUsersMultipleSelection')
      let usersTable0 = ( type == 'add' ? 'usersTable' : 'selectUsersTable')
      let usersTable1 = ( type == 'add' ? 'selectUsersTable' : 'usersTable')
      let removeUsers = this._.clone(this[formName][multipleSelection0])
      removeUsers.forEach((user,key) => {
        this[formName][usersTable1].push(user)
      })
      for(let i = 0; i < this[formName][usersTable0].length ; i++){
        let user = this[formName][usersTable0][i]
        removeUsers.forEach((removeUser,key) => {
          if(removeUser.id == user.id){
            this[formName][usersTable0].splice(i,1)
            i--
          }
        })
      }
    },
    changeUsersRoleGroup(formName){
      let multipleSelectionUsers = this[formName].selectUsersForRoleGroup
      let roleGroupId = this[formName].roleGroupId
      let roleGroupOptions = this[formName].roleGroupOptions
      let roleGroupName = ''
      roleGroupOptions.forEach((item,key) => {
        if(item.id == roleGroupId) roleGroupName = item.roleGroupName
      }) //通过角色组id获取角色组名称

      multipleSelectionUsers.forEach((item,key) => {
        let selectUserId = item.id
        this[formName].usersTable.forEach((user,key) => {
          if(selectUserId == user.id){
            user.roleGroupId = roleGroupId
            user.roleGroupName = roleGroupName
          }
        })
      })
      this[formName].innerVisible = false
    },
    openRoleGroupInnerDialog(index,roleGroupInfo,type,formName){
      if(type == 'multiple'){
        let selectMultipleUsers = this[formName].leftUsersMultipleSelection
        this[formName].selectUsersForRoleGroup = selectMultipleUsers
      }else{
        this[formName].selectUsersForRoleGroup = [roleGroupInfo]
      }
      this[formName].innerVisible = true
    },
    handleLeftMultipleUsersSelectionChange(value){
      this.createWokerGroupForm.leftUsersMultipleSelection = value
    },
    handleRightMultipleUsersSelectionChange(value){
      this.createWokerGroupForm.rightUsersMultipleSelection = value
    },
    handleEditLeftMultipleUsersSelectionChange(value){
      this.editWokerGroupForm.leftUsersMultipleSelection = value
    },
    handleEditRightMultipleUsersSelectionChange(value){
      this.editWokerGroupForm.rightUsersMultipleSelection = value
    },
    changeWorkerGroupStatus(id,status,workerGroupName,workerGroupUserRoles){
      this.$confirm('确定修改该工作组状态：'+workerGroupName+' ？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          this.$http.put('sysmgr/nlsysmgr/v1/workergroups/'+id,{
            "workerGroupName":workerGroupName,
            "status":status,
            "workerGroupUserRoles":workerGroupUserRoles
          }).then(response=>{
            this.getWorkerGroupsInfo()
            this.curWorkerGroup.status = status
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }).catch(error=>{})  
        }).catch(error => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })       
        })
    },
    selectTenant(param){
      let tenantId = {tenantId:this[param].tenantId} 
      let tenantInfo = Base64.encode(JSON.stringify(tenantId))
      let pagination = {
        currentPage:1,
        pageSize:99999
      }
      let paginationString = JSON.stringify(pagination)
      let page = Base64.encode(paginationString)
      //获取当前租户下workergroups的信息
      this.$http.get('sysmgr/nlsysmgr/v1/workergroups/?q='+tenantInfo+'&p='+page+'&o=').then(res => {
          let parentLst = res.data.list
          this[param].parentLst =  parentLst
          this[param].parentId = ''
          this[param].isRoot = false        
      }).catch(error => {})
    },
    opencreateWorkerGroupForm(){
      this.createWokerGroupForm.dialogVisible = true
      this.queryTenant('')  //获取租户信息
      this.getUsersInfo('createWokerGroupForm') //获取用户信息
    },
    append(data){
      console.log(data)
    },
    renderContent(h, { node, data, store }) {    
      let delHTML = <i class="fa fa-trash-o fa-lg workerGroupNodeIcon" title="删除" on-click={ () => this.delWorkerGroup(node, data) }></i> 
      let circleHTML = <i class="fa fa-stop-circle-o workerGroupCircle"></i>
      let workerGroup = data.workerGroup
      let status = workerGroup.status
      
      if(data.children.length || (status == 1) ) delHTML=''   
      if(status == 1) circleHTML = <i class="fa fa-circle workerGroupCircle workerGroupIsOn"></i>
      return (
            <div>
                {circleHTML}
                <span class="workerGroupNodeName" title={node.data.workerGroup.workerGroupName}>{node.data.workerGroup.workerGroupName}</span>
                <span class="workerGroupNodeOperation">
                  <i class="fa fa-edit workerGroupNodeIcon" title="编辑" on-click={ () => this.editWorkerGroup(node, data) }></i>
                  {delHTML}
                </span>
            </div>
        )
    },
    //停用
    stopWorkerGroup(node, data){
      let workerGroupInfo = data.workerGroup
      let workerGroupId = workerGroupInfo.id
      let workerGroupName = workerGroupInfo.workerGroupName
      this.$confirm('确定停用该工作组：'+workerGroupName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.put('sysmgr/nlsysmgr/v1/workergroups/'+workerGroupId,{
            "workerGroupName":workerGroupName,
            "status":0
          }).then(response=>{
            this.getWorkerGroupsInfo()
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
    //启用
    startWorkerGroup(node, data){
      let workerGroupInfo = data.workerGroup
      let workerGroupId = workerGroupInfo.id
      let workerGroupName = workerGroupInfo.workerGroupName
      this.$confirm('确定启用该工作组：'+workerGroupName+' ？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => { 
          this.$http.put('sysmgr/nlsysmgr/v1/workergroups/'+ workerGroupId,{
            "workerGroupName":workerGroupName,
            "status":1
          }).then(response=>{
            this.getWorkerGroupsInfo()
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
    //删除
    delWorkerGroup(node, data){
      let workerGroupInfo = data.workerGroup
      let workerGroupId = workerGroupInfo.id
      let workerGroupName = workerGroupInfo.workerGroupName
      let msg = '确定删除 工作组：'+workerGroupName+' ？'
      this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('sysmgr/nlsysmgr/v1/workergroups/'+workerGroupId).then(response=>{
            this.getWorkerGroupsInfo()
            this.curWorkerGroup = {     //初始化面板数据
              workerGroupName:'',
              desc:'',
              createTime:'',
              status:3,
              workerGroupUserRoles:[],
              id:null
            },
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
    //编辑
    editWorkerGroup(node, data){   
      event.stopPropagation() //阻止冒泡
      let workerGroupInfo = data.workerGroup
      let workerGroupId = workerGroupInfo.id
      let workerGroupName = workerGroupInfo.workerGroupName
      this.editWorkerGroupCompareName = workerGroupName
      this.$http.get('sysmgr/nlsysmgr/v1/workergroups/'+workerGroupId+'/detail')
      .then(res=> {
        let workerGroupInfo = res.data
        this.queryTenant('')  //获取租户信息
        this.getUsersInfo('editWokerGroupForm') //获取用户信息
        this.editWokerGroupForm.dialogVisible =  true
        this.editWokerGroupForm.workerGroupName = workerGroupInfo.workerGroupName
        this.editWokerGroupForm.desc = workerGroupInfo.desc
        this.editWokerGroupForm.tenantId = workerGroupInfo.tenantId 
        this.editWokerGroupForm.workerGroupUserRoles = workerGroupInfo.workerGroupUserRoles
        this.editWokerGroupForm.selectUsersTable = workerGroupInfo.workerGroupUserRoles
        this.editWokerGroupForm.workerGroupId = workerGroupInfo.id
        this.selectTenant('editWokerGroupForm')  //parentId展示
        setTimeout(() => {
          this.editWokerGroupForm.parentId = workerGroupInfo.parentId
          if(this.editWokerGroupForm.parentId == '' || this.editWokerGroupForm.parentId == 0){
            this.editWokerGroupForm.isRoot = true
          }else{
            this.editWokerGroupForm.isRoot = false
          }
        },500)
      }).catch(error => {})
    },
    handleNodeClick(data) {
      let workerGroupId = data.workerGroup.id
      this.$http.get('sysmgr/nlsysmgr/v1/workergroups/'+workerGroupId+'/detail')
      .then(res=> {
        let resWorkerGroupInfo = res.data
        this.curWorkerGroup.workerGroupName = resWorkerGroupInfo.workerGroupName
        this.curWorkerGroup.desc = resWorkerGroupInfo.desc
        this.curWorkerGroup.createTime = resWorkerGroupInfo.createTime
        this.curWorkerGroup.status = resWorkerGroupInfo.status
        this.curWorkerGroup.id = resWorkerGroupInfo.id
        this.curWorkerGroup.workerGroupUserRoles = resWorkerGroupInfo.workerGroupUserRoles
      }).catch(error => {})    
    },
    getUsersInfo(formName){
      this.$http.get('sysmgr/nlsysmgr/v1/users/?q=&p=&o=')
      .then(response=> {
         let userLst =  response.data 
         this.getRoleGroupsInfo(userLst,formName) //获取角色组信息
      }).catch(error => {})
    },
    getRoleGroupsInfo(userLst,formName){
      this.$http.get('sysmgr/nlsysmgr/v1/rolegroups/?q=&p=&o=')
      .then(response=> {
         let roleGroupId = null
         let roleGroupName = ''
         this[formName].roleGroupOptions = response.data
         if(response.data.length) {
          this[formName].roleGroupId = response.data[0].id
          userLst.forEach((item,key) => {
            item.roleGroupName = response.data[0].roleGroupName   //初始角色组信息为角色组第一个
            item.roleGroupId = response.data[0].id
          })
          if(formName == 'editWokerGroupForm' && this[formName].selectUsersTable.length){
              for(var i=0;i<userLst.length;i++){
                for(var j=0;j<this[formName].selectUsersTable.length;j++){
                  if(this[formName].selectUsersTable[j].userId == userLst[i].id){
                    userLst.splice(i,1)
                    i--
                    break
                  }
                }
              }
          }
          this[formName].usersTable = userLst  //将获取到的user信息放置左侧表中
         }
      })
      .catch(error => {})
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
      this.getWorkerGroupsInfo()
    },
    handleCurrentChange(val){
      this.pagination.currentPage = val
      this.getWorkerGroupsInfo()
    },
    getWorkerGroupsInfo(){
      let searchworkerGroupName = this.searchContent.name
      let workerGroupNameLen = searchworkerGroupName.length
      let workerGroupName
      if(workerGroupNameLen){
        workerGroupName = Base64.encode(JSON.stringify({
          "workerGroupName":searchworkerGroupName+"%",
        }))
      }else{
        workerGroupName =''
      }
      let pagination = {
        currentPage:this.pagination.currentPage,
        pageSize:this.pagination.pageSize
      }
      let paginationString = JSON.stringify(pagination)
      let page = Base64.encode(paginationString)
      this.$http.get('sysmgr/nlsysmgr/v1/workergroups/?q=&p=&o=')
      .then(response=> {
         let workerGroupLst = response.data
         this.workerGroupData = response.data 
      })
      .catch(error => {})
    },
    createWorkerGroup(formName){
      let workerGroupName = this[formName].workerGroupName
      let tenantId = this[formName].tenantId
      let userLst = this[formName].users
      let desc =  this[formName].desc
      let workerGroupUserRoles = []
      let isRoot =  this[formName].isRoot
      let parentId =  this[formName].parentId
      if(isRoot || !parentId) parentId = 0
      let selectUsers = this[formName].selectUsersTable
      selectUsers.forEach((user,key) => {
      let userRole = {
          "userId":user.id, 
          "roleGroupId":user.roleGroupId
        }
        workerGroupUserRoles.push(userRole)
      })
      if(formName == 'createWokerGroupForm'){
        this.$http.post('sysmgr/nlsysmgr/v1/workergroups',{
          "workerGroupName":workerGroupName,
          "tenantId":tenantId,
          "workerGroupUserRoles":workerGroupUserRoles,
          "desc":desc,
          "parentId":parentId
        }).then(response=>{
          this.resetForm('createWokerGroupForm')
          this.getWorkerGroupsInfo()
          this.$message({
             message: '创建成功',
             type: 'success'
          })  
        }).catch(error=>{})
      }else{
        let workerGroupId = this[formName].workerGroupId
        this.$http.put('sysmgr/nlsysmgr/v1/workergroups/'+ workerGroupId,{
          "workerGroupName":workerGroupName,
          "tenantId":tenantId,
          "workerGroupUserRoles":workerGroupUserRoles,
          "desc":desc,
          "parentId":parentId
        }).then(response=>{
          this.resetForm('editWokerGroupForm')
          this.getWorkerGroupsInfo()
          this.$message({
             message: '编辑成功',
             type: 'success'
          })  
        }).catch(error=>{})
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.createWorkerGroup(formName)  
        } else {
          this.$message({
              type: 'error',
              message: '校验未通过，请重新检查输入!'
          })
          return false
        }
      })
    },
    resetForm(formName) { 
      this[formName]={
        dialogVisible:false,
        roleGroupOptions:[],
        roleGroupId:'',
        innerVisible:false,
        workerGroupName: '',
        active:1,
        tenantId:'',
        parentId:'',
        desc:'',
        isRoot:false,
        parentLst:[{workerGroup:{}}],
        workerGroupUserRoles:[],
        usersTable:[],//左侧：用户表格
        leftUsersMultipleSelection:[],//左侧：记录多选用户信息
        selectUsersForRoleGroup:[],//记录批量和单个操作用户信息
        selectUsersTable:[],//右侧：已经添加用户表格
        rightUsersMultipleSelection:[] //右侧：记录多选用户信息
      }
      if(formName == 'editWokerGroupForm') this[formName].workerGroupId = null
      this.$refs[formName].resetFields()
    },
    resetInnerForm(formName){
      this[formName].innerVisible = false
    },
  },
  mounted(){
    this.getWorkerGroupsInfo() 
  }
}
</script>
<style>
.el-dialog__body{background-color: #fff}
#workerGroupTree{width:300px;float:left;height:100%;margin-right:20px;}
.el-tree{width:300px;height:600px;overflow:auto;}
.el-tree::-webkit-scrollbar{width: 8px;height: 8px;}
.el-tree::-webkit-scrollbar-thumb{background: rgba(0,0,0,0.3);border-radius: 6px}
.el-tree::-webkit-scrollbar-track{background-color: #ddd;border-radius: 6px;}
.el-tree>.el-tree-node{display: inline-block !important;min-width:100%;}
.el-tree-node.is-expanded.is-current.is-focusable>.el-tree-node__content>.workerGroupNode>.workerGroupNodeOperation{display:block}
.workerGroupNodeName{margin-right:10px;font-size:14px;display:inline-block;max-width:180px;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;}
.workerGroupNodeOperation{display:inline-block;}
.workerGroupNodeIcon{font-size:13px;color:#409eff;margin-right:5px;position:relative;top:-4px;} 
.workerGroupNodeIcon.fa-trash-o{position:relative;top:-6px;}
.workerGroupCircle{font-size:12px;margin-right:3px;color:#f56c6c;position:relative;top:-5px;}
.workerGroupIsOn{color:#67c23a}
#workerGroupPanel{width:calc(100% - 320px);float:left;height:100%;border:1px solid #333;background-color:#fff;box-sizing:border-box;overflow:auto}
.workerGroupPanelTitle{font-size:16px;text-align:center;margin-top:10px;}
.workerGroupPanelLine{margin:15px 25px;} 
.workerGroupPanelLabel{margin-right:5px;}
.workerGroupPanelConent{text-decoration:underline;}
.workerGroupTable{padding:0 25px 0}
.workerGroupPanelDescLabel{width:50px;float:left}
.workerGroupPanelDesc{width:calc(100% - 50px);float:left;word-wrap: break-word;text-decoration:underline;}
</style>
<style scoped>
.consoleRightBar{background-color: #fff}
.operate{color:#409eff;font-size: 13px;cursor: pointer;padding:0 5px;}
</style>