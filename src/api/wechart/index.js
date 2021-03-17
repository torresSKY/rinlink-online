import axios from 'axios'

axios.defaults.headers.common['Authorization'] = sessionStorage['token']

const login=(data)=>(
    axios.post('/users/login',data)
)

// const getzhucheList = (imei) => (
//     axios.get(`/deviceInfos?imei=${imei}`)
// )

// const getEqulistnew = (data) => {  // 获取所有设备
//     return axios.get('/device', data)
// }

// const getzhucheListPagination = (data) => (
//     axios.post('/deviceInfos/pagination',data)
// )

// const zhucheAdd = (data) =>(
//     axios.post('/deviceInfos',data)
// )

// const zhucheEdit = (id,data) =>(
//     axios.put('/deviceInfos/'+id,data)
// )

// const zhucheDelete=(id)=>(
//     axios.delete('/deviceInfos/'+id)
// )



const getUsersList = (obj) => {
    let data={}
    for(let i in obj){
        if(obj[i]===0||obj[i]){
            data[i]=obj[i]
        }
    }
    if(JSON.stringify(data)=='{}'){
        data={
            nickname:''
        }
    }
    return axios.get(`/users`,{
        params:{
            ...data
        }
    })
}
const url = 'http://rap2api.taobao.org/app/mock/277955'

const getDevicesList = (data) => (   //分页查询设备列表
    axios.post(url+'/paging_devices?__OPERATOR_TYPE=2', data)
)
const searchDevices = (data) => (   //搜索设备列表
    axios.post(url+'/search_devices?__OPERATOR_TYPE=2', data)
)
const queryDevices = (data) => (   //查询设备列表
    axios.post(url+'/query_devices?__OPERATOR_TYPE=2', data)
)
const editDevices = (data) => (   //更新设备
    axios.post(url+'/update_device?__OPERATOR_TYPE=2', data)
)
const sellDevices = (data) => (   //销售设备
    axios.post(url+'/sell_devices?__OPERATOR_TYPE=2', data)
)
const getManagerList = (data) => (   //分页查询系统管理员
    axios.post(url+'/paging_query_system_manager_users', data)
)
const addManager = (data) => (   //添加系统管理员
    axios.post(url+'/create_system_manager_user', data)
)
const editManager = (data) => (   //修改系统管理员
    axios.post(url+'/update_system_manager_user', data)
)
const deleManager = (data) => (   //删除系统管理员
    axios.post(url+'/delete_system_manager_user', data)
)
const upsetPwd = (data) => (   //重置系统管理员密码
    axios.post(url+'/reset_system_manager_user_password', data)
)
const getAuthority = (data) => (   //查询权限
    axios.post(url+'/query_system_manager_user_authorities', data)
)
const getCheckedAuthority = (data) => (   //查询选中的权限
    axios.post(url+'/query_system_manager_user_role_authorities', data)
)
const getRolesList = (data) => (   //分页查询角色
    axios.post(url+'/paging_query_system_manager_user_roles', data)
)
const addRoles = (data) => (   //添加角色
    axios.post(url+'/create_system_manager_user_role', data)
)
const editRoles = (data) => (   //更新角色
    axios.post(url+'/update_system_manager_user_role', data)
)
const deleRoles = (data) => (   //删除角色
    axios.post(url+'/delete_system_manager_user_role', data)
)
const getShipmentList = (data) => (   //分页查询出货的设备
    axios.post(url+'/paging_query_shipment_device', data)
)
const shipment = (data) => (   //出货
    axios.post(url+'/shipment_device', data)
)
const batchShipment = (data) => (   //批量出货
    axios.post(url+'/batch_shipment_device', data)
)
const uploadDeviceNumber = (data) => (   //上传文件-设备号
    axios.post(url+'/upload_device_number', data)
)
const getBusinessList = (data) => (   //分页查询客户
    axios.post(url+'/paging_query_business_users', data)
)
const addBusiness = (data) => (   //添加客户
    axios.post(url+'/create_business_user', data)
)
const editBusiness = (data) => (   //修改客户
    axios.post(url+'/update_business_user?__OPERATOR_TYPE=1', data)
)
const deleBusiness = (data) => (   //删除客户
    axios.post(url+'/delete_business_user', data)
)
const resetBusiness = (data) => (   //重置客户密码
    axios.post(url+'/reset_business_user_password', data)
)
const getBusinessUserinfo = (data) => (   //获取客户信息
    axios.post(url+'/get_business_user_info?__OPERATOR_TYPE=2', data)
)
const searchBusiness = (data) => (   //搜索客户信息
    axios.post(url+'/search_business_users?__OPERATOR_TYPE=2', data)
)
const getAlarmsDetail = (data) => (   //分页查询报警详情
    axios.post(url+'/paging_device_alarms?__OPERATOR_TYPE=2', data)
)
const handleDeviceAlarm = (data) => (   //处理报警
    axios.post(url+'/handle_device_alarm?__OPERATOR_TYPE=2', data)
)
const handleDeviceAlarms = (data) => (   //全部处理报警
    axios.post(url+'/handle_device_alarms?__OPERATOR_TYPE=2', data)
)
const platformExpire = (data) => (   //分页查询平台服务到期
    axios.post(url+'/paging_platform_device_expire_messages?__OPERATOR_TYPE=2', data)
)
const handlePlatformExpire = (data) => (   //单个处理平台服务到期
    axios.post(url+'/handle_platform_device_expire_message?__OPERATOR_TYPE=2', data)
)
const handlePlatformExpires = (data) => (   //全部处理平台服务到期
    axios.post(url+'/handle_platform_all_device_expire_messages?__OPERATOR_TYPE=2', data)
)
const systemMessages = (data) => (   //分页查询系统通知
    axios.post(url+'/paging_system_messages?__OPERATOR_TYPE=2', data)
)
const getAlarmType = (data) => (   //查询报警类型
    axios.post(url+'/query_alarm_type_info', data)
)
const alarmStatistic = (data) => (   //分页查询设备报警统计
    axios.post(url+'/paging_device_alarm_statistic?__OPERATOR_TYPE=2', data)
)
const getModelList = (data) => (   //分页查询设备型号
    axios.post(url+'/paging_query_device_models', data)
)
const getBusiness = (data) => (   //查询代理商
    axios.post(url+'/query_business_users?__OPERATOR_TYPE=2', data)
)
const getServices = (data) => (   //查询所有IOT服务
    axios.post(url+'/query_all_iot_services', data)
)
const addModel = (data) => (   //创建设备型号
    axios.post(url+'/create_device_model', data)
)
const deleModel = (data) => (   //删除设备型号
    axios.post(url+'/delete_device_model', data)
)
const getOnlineDvice = (data) => ( //统计在线设备
    axios.post(url + '/statistics_online_devices',data)
)
const getOfflineDevice = (data) => ( //统计离线设备
    axios.post(url + '/statistics_offline_devices',data)
)
const getActivated = (data) => ( //统计激活设备
    axios.post(url + '/statistics_activated_devices', data)
)
const getUnactivated_device =(data) => ( //统计未激活设备
    axios.post(url + '/statistics_unactivated_devices', data)
)
const getUsing_device = (data) => ( //正在使用中的设备
    axios.post(url + '/statistics_using_devices', data)
)
const getUnexpired_device = (data) => ( //未过期设备
    axios.post(url + '/statistics_unexpired_devices', data)
)
const getExpired_device = (data) => ( //已过期设备
    axios.post(url + '/statistics_expired_devices', data)
)
const getInventory_device = (data) => ( //设备库存
    axios.post(url + '/statistics_inventory_devices', data)
)
const getSold_device = (data) => ( //已销售设备
    axios.post(url + '/statistics_sold_devices', data)
)

const queryPen = (data) => ( //查询电子围栏
    axios.post(url + '/paging_fences',data)
)
// 添加、更新圆形电子围栏
const createUpdateCircleFence = (type,data) => {
    if (type == 'create'){
       return axios.post(url + '/create_circle_fence?__OPERATOR_TYPE=2',data)
    }
    if (type == 'update'){
       return axios.post(url + '/update_to_circle_fence?__OPERATOR_TYPE=2',data)
    }
}
// 添加、更新多边形电子围栏
const createUpdatePolygonFence = (type,data) => {
    if (type == 'create'){
        return axios.post(url + '/create_polygon_fence?__OPERATOR_TYPE=2',data)
    }
    if (type == 'update'){
        return axios.post(url + '/update_to_polygon_fence?__OPERATOR_TYPE=2',data)
    }
}
// 添加、更新行政区域电子围栏
const createUpdateDistrictFence = (type,data) => {
    if(type == 'create'){
        return axios.post(url + '/create_district_fence?__OPERATOR_TYPE=2',data)
    }
    if(type == 'update'){
        return axios.post(url + '/update_to_district_fence?__OPERATOR_TYPE=2',data)
    }
}
const deleteFence = (data) => ( //删除电子围栏
    axios.post(url + '/delete_fence?__OPERATOR_TYPE=2',data)
)
export default {
    login,
    getManagerList,
    addManager,
    editManager,
    deleManager,
    upsetPwd,
    getAuthority,
    getCheckedAuthority,
    getRolesList,
    addRoles,
    editRoles,
    deleRoles,
    getShipmentList,
    shipment,
    batchShipment,
    getBusiness,
    uploadDeviceNumber,
    getBusinessList,
    addBusiness,
    editBusiness,
    deleBusiness,
    resetBusiness,
    getBusinessUserinfo,
    searchBusiness,
    getAlarmsDetail,
    handleDeviceAlarm,
    handleDeviceAlarms,
    platformExpire,
    handlePlatformExpire,
    handlePlatformExpires,
    systemMessages,
    getAlarmType,
    alarmStatistic,
    getDevicesList,
    searchDevices,
    queryDevices,
    editDevices,
    sellDevices,
    // getEqulistnew,
    // getzhucheList,
    // getzhucheListPagination,
    // zhucheAdd,
    // zhucheEdit,
    // zhucheDelete,
    getUsersList,
    getModelList,
    getServices,
    addModel,
    deleModel,
    getOnlineDvice,
    getOfflineDevice,
    getActivated,
    getUnactivated_device,
    getUsing_device,
    getUnexpired_device,
    getExpired_device,
    getInventory_device,
    getSold_device,
    queryPen,
    createUpdateCircleFence,
    createUpdatePolygonFence,
    createUpdateDistrictFence,
    deleteFence
}