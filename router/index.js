import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Home from '@/page/home'
import CloudCompute from '@/page/cloudCompute'
import PhysicaMachineEnv from '../page/cloudCompute/compute/physicalMachineEnv.vue'
import VirtualMachineEnv from '../page/cloudCompute/compute/virtualMachineEnv.vue'
import K8SContainerEnv from '../page/cloudCompute/compute/k8sContainerEnv.vue'
import newCreate from '../page/cloudCompute/compute/newCreate.vue'
import newCreateK8SMonitor from '../page/cloudCompute/compute/newCreateK8SMonitor.vue'
import infoDetail from '../page/cloudCompute/compute/infoDetail.vue'
import MessosEnv from '../page/cloudCompute/compute/messosEnv.vue'
import YarnEnv from '../page/cloudCompute/compute/yarnEnv.vue'
import ObjectStorage from '../page/cloudCompute/storage/objectStorage.vue'
import BlockStorage from '../page/cloudCompute/storage/blockStorage.vue'
import ShareStorage from '../page/cloudCompute/storage/shareStorage.vue'
import Network from '../page/cloudCompute/network.vue'
/*import resourceManage from '../page/cloudCompute/resourceManage.vue'*/
/*import addHost from '../page/cloudCompute/addHost.vue'*/
import RelationDatabase from '../page/serviceMangement/databaseService/relationDatabase.vue'
import CreateMysql from '../page/serviceMangement/databaseService/createMysql.vue'
import Zookeeper from '../page/serviceMangement/zookeeper.vue'
import Redis from '../page/serviceMangement/redis.vue'
import Kafka from '../page/serviceMangement/kafka.vue'
import Flume from '../page/serviceMangement/flume.vue'
import Nginx from '../page/serviceMangement/ngix.vue'
import LoadBalance from '../page/serviceMangement/middleWare/loadBalance.vue'
import CreateLoadBalance from '../page/serviceMangement/middleWare/createLoadBalance.vue'
import MonitorSet from '../page/serviceMangement/middleWare/monitorSet.vue'
import MicroServiceApply from '../page/applicationMangement/microServiceApply.vue'
import CreateMicroServiceApply from '../page/applicationMangement/createMicroServiceApply.vue'
import BatchProcessApply from '../page/applicationMangement/batchProcessApply.vue'
import CreateBatchProcessApply from '../page/applicationMangement/createBatchProcessApply.vue'
import GeneralApply from '../page/applicationMangement/generalApply.vue'
import CreateGeneralApply from '../page/applicationMangement/createGeneralApply.vue'
import ProcessScheduleApply from '../page/applicationMangement/processScheduleApply.vue'
import ApiRegister from '../page/apiMangement/apiRegister.vue'
import ApiMain from '../page/apiMangement/apiMain.vue'
import ApiTest from '../page/apiMangement/apiTest.vue'
import apiInfo from '../page/apiMangement/apiInfo.vue'
import PoliceSecurity from '../page/solution/bigData/policeSecurity.vue'
import Traffic from '../page/solution/bigData/traffic.vue'
import DatabaseMirror from '../page/mirrorAndAssetMarkets/databaseMirror.vue'
import BaseMirror from '../page/mirrorAndAssetMarkets/BaseMirror.vue'
import Log from '../page/managementAndMonitor/log.vue'
import HelpAndSupport from '../page/helpAndSupport/helpAndSupport.vue'
import Login from '../page/login.vue'
import Main from '../page/main.vue'
import DevOps from '../page/DevOpsPlatform/DevOps.vue'
import project from '../page/DevOpsPlatform/project.vue'
import workPlatform from '../page/DevOpsPlatform/workPlatform.vue'
import proPlan from '../page/DevOpsPlatform/proPlan.vue'
import menuList from '../page/DevOpsPlatform/menuList.vue'
import newWorkTab from '../page/DevOpsPlatform/newWorkTab.vue'
import newFilterTab from '../page/DevOpsPlatform/newFilterTab.vue'
import feature from '../page/DevOpsPlatform/feature.vue'
import backLog from '../page/DevOpsPlatform/backLog.vue'
import interation from '../page/DevOpsPlatform/interation.vue'
import document from '../page/DevOpsPlatform/document.vue'
import codePlatForm from '../page/DevOpsPlatform/codePlatForm.vue'
import storeHouse from '../page/DevOpsPlatform/storeHouse.vue'
import dynamicWork from '../page/DevOpsPlatform/dynamicWork.vue'
import fileWork from '../page/DevOpsPlatform/fileWork.vue'
import submitTask from '../page/DevOpsPlatform/submitTask.vue'
import houseNetwork from '../page/DevOpsPlatform/houseNetwork.vue'
import houseStatistic from '../page/DevOpsPlatform/houseStatistic.vue'
import mergeRequest from '../page/DevOpsPlatform/mergeRequest.vue'
import branchProtection from '../page/DevOpsPlatform/branchProtection.vue'
import deployKey from '../page/DevOpsPlatform/deployKey.vue'
import checkTask from '../page/DevOpsPlatform/checkTask.vue'
import newStoreHouse from '../page/DevOpsPlatform/newStoreHouse.vue'
import checkRule from '../page/DevOpsPlatform/checkRule.vue'
import ConsolePage from  '../page/console/consolePage.vue'
import ConsolePageHome from '../page/console/consolePageHome.vue'
import Kubernet from '../page/console/kubernete.vue'
import ColonyInfo from '../page/console/colonyInfo.vue'
import BusinessCenterInfo from '../page/console/businessCenterInfo.vue'
import ApplicationInfo from '../page/console/applicationInfo.vue'
import ServiceInfo from '../page/console/serviceInfo.vue'
import ContainerColony from '../page/console/myresource/containerColony.vue'
import ClusterDetail from '../page/console/myresource/k8sClusterDetail.vue'
import newCreateK8SCluster from '../page/console/myresource/newCreateK8SCluster.vue'
import Host from '../page/console/myresource/host.vue'
import addHost from '../page/console/myresource/addHost.vue'
import Storage from '../page/console/myresource/storage.vue'
import Application from '../page/console/application/application.vue'
import ApplicationDetail from  '../page/console/application/applicationDetail.vue'
import ApplicationConfig from '../page/console/application/applicationConfig.vue'
import Region from '../page/console/resourceManagement/region.vue'
import Computer from '../page/console/resourceManagement/computer.vue'
import Resource from '../page/console/resourceManagement/resource.vue'
import ResourceUsageQuery from '../page/console/resourceManagement/resourceUsageQuery.vue'
import menuManagement from '../page/console/systemManagement/menuManagement.vue'
import moduleManagement from '../page/console/systemManagement/moduleManagement.vue'
import permissionManagement from '../page/console/systemManagement/permissionManagement.vue'
import TenantManagement from '../page/console/systemManagement/tenantManagement.vue'
import UserManagement from '../page/console/systemManagement/userManagement.vue'
import UserGroupManagement from '../page/console/systemManagement/userGroupManagement.vue'
import FieldManagement from '../page/console/systemManagement/fieldManagement.vue'
import RoleManagement from '../page/console/systemManagement/roleManagement.vue'
import editRole from '../page/console/systemManagement/editRole.vue'
import RoleGroupManagement from '../page/console/systemManagement/roleGroupManagement.vue'
import editRoleGroup from '../page/console/systemManagement/editRoleGroup.vue'
import ClusterManagement from '../page/console/systemManagement/clusterManagement.vue'
import workOrderManagement from '../page/console/maintenanceManagement/workOrderManagement.vue'
import logSearch from '../page/console/logManagement/logSearch.vue'
import logCollect from '../page/console/logManagement/logCollect.vue'
import auditLog from '../page/console/logManagement/auditLog.vue'
import indexManagement from '../page/console/logManagement/indexManagement.vue'
import logContent from '../page/console/logManagement/logContent.vue'
import createLogCluster from '../page/console/logManagement/createLogCluster.vue'
import logCluster from '../page/console/logManagement/logCluster.vue'
import logClusterIndex from '../page/console/logManagement/logClusterIndex.vue'
import workOrderContent from '../page/console/maintenanceManagement/workOrderContent.vue'
import indexListDetail from '../page/console/logManagement/indexListDetail.vue'
import addNode from '../page/console/myresource/addNode.vue'
import NotFound from '../page/404.vue'
Vue.use(Router)
export default new Router({
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }, 
  routes: [
    {
	    path: '*',
        redirect: '404'
    },
    {
        path: '',
        redirect: 'login'
    },
    {
        path:'/404',
        name:'NotFound',
        component:NotFound
    },

    {
        path:'/login',
        name:'Login',
        component:Login,
        meta : {
            requireAuth :false
        }
    },
    {
        path:'/main',
        name:'Main',
        component:Main,
        meta : { requireAuth :true },
        children:[
           {
                path:'/home',
                name:'Home',
                component: Home,
                meta : {  requireAuth :true }
           },
           //DevOps
           {
				        path:'/project',
				        name:'project',
				        component: project,
                        meta : {  requireAuth :true }
			     },
           {
				        path:'/DevOps',
				        name:'DevOps',
				        component:DevOps,
                        meta : {  requireAuth :true }
				   },
           {
			        path:'/menuList',
			        name:'menuList',
			        component: menuList,
                    meta : {  requireAuth :true },
			        children:[
			        	{
						        path:'/workPlatform',
						        name:'workPlatform',
						        component:workPlatform,
                                meta : {  requireAuth :true }
						    },
						    
						    {
						        path:'/proPlan',
						        name:'proPlan',
						        component:proPlan,
                                meta : {  requireAuth :true }
						    },
						    
						    {
				        		path:'/newWorkTab',
				        		name:'newWorkTab',
				        		component:newWorkTab,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/newFilterTab',
				        		name:'newFilterTab',
				        		component:newFilterTab,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/feature',
				        		name:'feature',
				        		component:feature,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/backLog',
				        		name:'backLog',
				        		component:backLog,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/interation',
				        		name:'interation',
				        		component:interation,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/document',
				        		name:'document',
				        		component:document,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/codePlatForm',
				        		name:'codePlatForm',
				        		component:codePlatForm,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/storeHouse',
				        		name:'storeHouse',
				        		component:storeHouse,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/dynamicWork',
				        		name:'dynamicWork',
				        		component:dynamicWork,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/fileWork',
				        		name:'fileWork',
				        		component:fileWork,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/submitTask',
				        		name:'submitTask',
				        		component:submitTask,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/houseNetwork',
				        		name:'houseNetwork',
				        		component:houseNetwork,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/houseStatistic',
				        		name:'houseStatistic',
				        		component:houseStatistic,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/mergeRequest',
				        		name:'mergeRequest',
				        		component:mergeRequest,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/branchProtection',
				        		name:'branchProtection',
				        		component:branchProtection,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/deployKey',
				        		name:'deployKey',
				        		component:deployKey,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/checkTask',
				        		name:'checkTask',
				        		component:checkTask,
                                meta : {  requireAuth :true }
						    },
						    {
				        		path:'/newStoreHouse',
				        		name:'newStoreHouse',
				        		component:newStoreHouse,
                                meta : {  requireAuth :true }
						    },
						    {
						    	path:'/checkRule',
			        		name:'checkRule',
			        		component:checkRule,
                            meta : {  requireAuth :true }
						    }
			        ]
			     },
           
           //云计算
            {
                path:'/cloudCompute',
                name:'CloudCompute',
                component:CloudCompute,
                meta : {  requireAuth :true }
            },
            //物理机环境
            {
                path:'/cloudCompute/compute/physicalMachineEnv',
                name:'PhysicaMachineEnv',
                component:PhysicaMachineEnv,
                meta : {  requireAuth :true }
            },
            //虚拟机环境
            {
                path:'/cloudCompute/compute/virtualMachineEnv',
                name:'VirtualMachineEnv',
                component:VirtualMachineEnv,
                meta : {  requireAuth :true }
            },
            //k8s容器环境
            {
                path:'/cloudCompute/compute/k8sContainerEnv',
                name:'K8SContainerEnv',
                component:K8SContainerEnv,
                meta : {  requireAuth :true }
            },
            //新建域
            {
                path:'/cloudCompute/compute/newCreate',
                name:'newCreate',
                component:newCreate,
                meta : {  requireAuth :true }
            },
            //新建K8S集群
            {
                path:'/console/newCreateK8SCluster',
                name :'newCreateK8SCluster',
                component:newCreateK8SCluster,
                meta : {  requireAuth :true }
            },
            //新建k8s告警监控
            {
                path:'/cloudCompute/compute/newCreateK8SMonitor',
                name :'newCreateK8SMonitor',
                component:newCreateK8SMonitor,
                meta : {  requireAuth :true }
            },
            //域的详细信息
            {
                path:'/cloudCompute/compute/infoDetail',
                name:'infoDetail',
                component:infoDetail,
                meta : {  requireAuth :true }
            },
            //Messos环境
            {
                path:'/cloudCompute/compute/messosEnv',
                name:'MessosEnv',
                component: MessosEnv,
                meta : {  requireAuth :true }
            },
            //yarn环境
            {
                path:'/cloudCompute/compute/yarnEnv',
                name:'YarnEnv',
                component:YarnEnv,
                meta : {  requireAuth :true }
            },
            //对象存储
            {
               path:'/cloudCompute/storage/objectStorage',
               name:'ObjectStorage',
               component:ObjectStorage,
               meta : {  requireAuth :true }
            },
            //共享存储
            {
               path:'/cloudCompute/storage/shareStorage',
               name:'ShareStorage',
               component:ShareStorage,
               meta : {  requireAuth :true }
            },
            //块存储
            {
               path:'/cloudCompute/storage/blockStorage',
               name:'BlockStorage',
               component:BlockStorage,
               meta : {  requireAuth :true }
            },
            //网络
            {
                path:'/cloudCompute/network',
                name:'Network',
                component:Network,
                meta : {  requireAuth :true }
            },
            //资源管理
            
            //添加主机
            /*{
                path:'/cloudCompute/addHost',
                name:'addHost',
                component:addHost
            },*/
            //关系数据库
            {
                path:'/databaseService/relationDatabase',
                name:'RelationDatabase',
                component:RelationDatabase,
                meta : {  requireAuth :true }
            },
             //创建关系数据库mysql
            {
                path:'/databaseService/createMysql',
                name:'CreateMysql',
                component:CreateMysql,
                meta : {  requireAuth :true }
            },
            //zookeeper
            {
                path:'/serviceMangement/zookeeper',
                name:'Zookeeper',
                component:Zookeeper,
                meta : {  requireAuth :true }
            },
            //ngix
            {
                path:'/serviceMangement/nginx',
                name:'Nginx',
                component:Nginx,
                meta : {  requireAuth :true }
            },
            //redis
            {
                path:'/serviceMangement/redis',
                name:'Redis',
                component:Redis,
                meta : {  requireAuth :true }
            },
            //redis
            {
                path:'/serviceMangement/kafka',
                name:'Kafka',
                component:Kafka,
                meta : {  requireAuth :true }
            },
            //flume
            {
                path:'/serviceMangement/flume',
                name:'Flume',
                component:Flume,
                meta : {  requireAuth :true }
            },
            //微服务应用
            {
                path:'/applicationMangement/microServiceApply',
                name:'MicroServiceApply',
                component:MicroServiceApply,
                meta : {  requireAuth :true }
            },
            //创建微服务应用
            {
                path:'/applicationMangement/createMicroServiceApply',
                name:'CreateMicroServiceApply',
                component:CreateMicroServiceApply,
                meta : {  requireAuth :true }
            },
               //流程调度应用
            {
                path:'/applicationMangement/processScheduleApply',
                name:'ProcessScheduleApply',
                component:ProcessScheduleApply,
                meta : {  requireAuth :true }
            },
             //批处理应用
            {
                path:'/applicationMangement/batchProcessApply',
                name:'BatchProcessApply',
                component:BatchProcessApply,
                meta : {  requireAuth :true }
            },
             //创建批处理应用
            {
                path:'/applicationMangement/createBatchProcessApply',
                name:'CreateBatchProcessApply',
                component:CreateBatchProcessApply,
                meta : {  requireAuth :true }
            },
             //普通应用
            {
                path:'/applicationMangement/generalApply',
                name:'GeneralApply',
                component:GeneralApply,
                meta : {  requireAuth :true }
            },
            //创建普通应用
            {
                path:'/applicationMangement/createGeneralApply',
                name:'CreateGeneralApply',
                component:CreateGeneralApply,
                meta : {  requireAuth :true }
            },
            //API注册
            {
                path:'/apiMangement/apiRegister',
                name:'ApiRegister',
                component:ApiRegister,
                meta : {  requireAuth :true }
            },
            //api测试
            {
                path:'/apiMangement/apiTest',
                name:'ApiTest',
                component:ApiTest,
                meta : {  requireAuth :true }
            },
            {
                path:'/apiMangement/apiInfo',
                name:'apiInfo',
                component:apiInfo,
                meta : {  requireAuth :true }
            },
              //api
            {
                path:'/apiMangement/apiMain',
                name:'ApiMain',
                component:ApiMain,
                meta : {  requireAuth :true }
            },
            //公安安防
            {
                path:'/solution/bigData/policeSecurity',
                name:'PoliceSecurity',
                component:PoliceSecurity,
                meta : {  requireAuth :true }
            },
            //交通
            {
                path:'/solution/bigData/traffic',
                name:'Traffic',
                component:Traffic,
                meta : {  requireAuth :true }
            },
            //数据库镜像
            {
                path:'/mirrorAndAssetMarkets/databaseMirror',
                name:'DatabaseMirror',
                component:DatabaseMirror,
                meta : {  requireAuth :true }
            },
           //基础镜像
           {
            path:'/mirrorAndAssetMarkets/BaseMirror',
            name:'BaseMirror',
            component:BaseMirror,
            meta : {  requireAuth :true }
           },
            //日志
            {
                path:'/managementAndMonitor/Log',
                name:'Log',
                component:Log,
                meta : {  requireAuth :true }
            },
          //负载均衡
          {
            path:'/serviceMangement/Middleware/loadBalance',
            name:'LoadBalance',
            component:LoadBalance,
            meta : {  requireAuth :true }
          },
          //创建负载均衡
          {
            path:'/serviceMangement/Middleware/createLoadBalance',
            name:'CreateLoadBalance',
            component:CreateLoadBalance,
            meta : {  requireAuth :true }
          },
          {
            path:'/serviceMangement/Middleware/monitorSet',
            name:'MonitorSet',
            component:MonitorSet,
            meta : {  requireAuth :true }
          },
            //入门指南
            {
                path:'/helpAndSupport/helpAndSupport',
                name:'helpAndSupport',
                component:HelpAndSupport,
                meta : {  requireAuth :true }
            },
          //控制台页面
          {
            path:'/console/consolePage',
            name:'ConsolePage',
            component:ConsolePage,
            meta : {  requireAuth :true },
            children:[
                {
                    path:'/console/consoleHome',
                    name:'ConsolePageHome',
                    component:ConsolePageHome,
                    meta : {  requireAuth :true }
                },
                //集群页面
               {
                    path:'/console/colonyInfo',
                    name:'ColonyInfo',
                    component:ColonyInfo,
                    meta : {  requireAuth :true }
               },
               {
                    path:'/console/Kubernet',
                    name:'Kubernet',
                    component:Kubernet,
                    meta : {  requireAuth :true }
               },
               //业务中心
              {
                path:'/console/businessCenterInfo',
                name:'BusinessCenterInfo',
                component:BusinessCenterInfo,
                meta : {  requireAuth :true }
              },

              //应用
              {
                path:'/console/applicationInfo',
                name:'ApplicationInfo',
                component:ApplicationInfo,
                meta : {  requireAuth :true }
              },
              //服务
              {
                path:'/console/serviceInfo',
                name:'ServiceInfo',
                component:ServiceInfo,
                meta : {  requireAuth :true }
              },
              //容器集群
              {
                path:'/console/ContainerColony',
                name:'ContainerColony',
                component:ContainerColony,
                meta : {  requireAuth :true }
              },
              //集群详情
              {
                //ClusterDetail
                path:'/console/ClusterDetail',
                name:'ClusterDetail',
                component:ClusterDetail,
                meta : {  requireAuth :true }
              },
              //主机
              {
                path:'/console/Host',
                name:'Host',
                component:Host,
                meta : {  requireAuth :true }
              },
              {
                path:'/console/addHost',
                name:'addHost',
                component:addHost,
                meta : {  requireAuth :true }
              },
              {
                path:'/console/addNode',
                name:'addNode',
                component:addNode,
                meta : {  requireAuth :true }
              },
              //存储
              {
                path:'/console/storage',
                name:'Storage',
                component:Storage,
                meta : {  requireAuth :true }
              },
              //应用
              {
                path:'/console/application',
                name:'Application',
                component:Application,
                meta : {  requireAuth :true }
              },
              //应用详情
              {
                path:'/console/applicationDetail',
                name: 'ApplicationDetail',
                component:ApplicationDetail,
                meta : {  requireAuth :true }
              },
              //配置
              {
                path:'/console/ApplicationConfig',
                name:'ApplicationConfig',
                component:ApplicationConfig,
                meta : {  requireAuth :true }
              },
              //地域管理
              {
                path:'/console/Region',
                name:'Region',
                component:Region,
                meta : {  requireAuth :true }
              },
              //机房管理
              {
                path:'/console/Computer',
                name:'Computer',
                component:Computer,
                meta : {  requireAuth :true }
              },
              //资源管理
              {
                path:'/console/Resource',
                name:'Resource',
                component:Resource,
                meta : {  requireAuth :true }
              },
              //资源管理查询页面
              {
                path:'/console/ResourceUsageQuery',
                name:'ResourceUsageQuery',
                component:ResourceUsageQuery,
                meta : {  requireAuth :true }
              },
              //租户管理
              {
                path:'/console/TenantManagement',
                name:'TenantManagement',
                component:TenantManagement,
                meta : {  requireAuth :true }
              },
              //用户管理
              {
                path:'/console/UserManagement',
                name:'UserManagement',
                component:UserManagement,
                meta : {  requireAuth :true }
              },
              //用户组管理
              {
                path:'/console/UserGroupManagement',
                name:'UserGroupManagement',
                component:UserGroupManagement,
                meta : {  requireAuth :true }
              },
              //域管理
              {
                path:'/console/FieldManagement',
                name:'FieldManagement',
                component:FieldManagement,
                meta : {  requireAuth :true }
              },
              //角色管理
              {
                path:'/console/RoleManagement',
                name:'RoleManagement',
                component:RoleManagement,
                meta : {  requireAuth :true }
              },
               //编辑角色
              {
                path:'/console/editRole',
                name:'editRole',
                component:editRole,
                meta : {  requireAuth :true }
              },
              //角色组管理
              {
                path:'/console/RoleGroupManagement',
                name:'RoleGroupManagement',
                component:RoleGroupManagement,
                meta : {  requireAuth :true }
              },
              //编辑角色组
              {
                path:'/console/editRoleGroup',
                name:'editRoleGroup',
                component:editRoleGroup,
                meta : {  requireAuth :true }
              },
              //菜单管理
              {
                path:'/console/menuManagement',
                name:'menuManagement',
                component:menuManagement,
                meta : {  requireAuth :true }
              },
              //权限管理
              {
                path:'/console/permissionManagement',
                name:'permissionManagement',
                component:permissionManagement,
                meta : {  requireAuth :true }
              },
              //模块管理
              {
                path:'/console/moduleManagement',
                name:'moduleManagement',
                component:moduleManagement,
                meta : {  requireAuth :true }
              },
              //集群管理
              {
                path:'/console/ClusterManagement',
                name:'ClusterManagement',
                component:ClusterManagement,
                meta : {  requireAuth :true }
              },
              //工单管理
              {
                path:'/console/workOrderManagement',
                name:'workOrderManagement',
                component:workOrderManagement,
                meta : {  requireAuth :true }
              },
              //工单内容
              {
                path:'/console/workOrderContent',
                name:'workOrderContent',
                component:workOrderContent,
                meta : {  requireAuth :true }
              },
              //日志检索
              {
                path:'/console/logSearch',
                name:'logSearch',
                component:logSearch,
                meta : {  requireAuth :true }
              },
              //日志采集设置
              {
                path:'/console/logCollect',
                name:'logCollect',
                component:logCollect,
                meta : {  requireAuth :true }
              },
              //统一日志集群列表
			  //审计日志
              //统一日志集群列表
			  //审计日志
              {
                path:'/console/auditLog',
                name:'auditLog',
                component:auditLog,
                meta : {  requireAuth :true }
              },
              //统一日志集群列表
              {
                path:'/console/logClusterIndex',
                name:'logClusterIndex',
                component:logClusterIndex,
                meta : {  requireAuth :true }
              },
			  //统一日志集群详情
              {
                path:'/console/logCluster',
                name:'logCluster',
                component:logCluster,
                meta : {  requireAuth :true }
              },
              //新增统一日志集群
              {
                path:'/console/createLogCluster',
                name:'createLogCluster',
                component:createLogCluster,
                meta : {  requireAuth :true }
              },
              //索引管理
              {
                path:'/console/indexManagement',
                name:'indexManagement',
                component:indexManagement,
                meta : {  requireAuth :true }
              },
              //索引列表页面
              {
                path:'/console/indexListDetail',
                name:'indexListDetail',
                component:indexListDetail,
                meta : {  requireAuth :true }
              },
              //日志内容
              {
                path:'/console/logContent',
                name:'logContent',
                component:logContent,
                meta : {  requireAuth :true }
              }
            ]
          }

        ]
    },

  ]
})
