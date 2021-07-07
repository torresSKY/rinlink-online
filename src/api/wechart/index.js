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
// const url = 'http://rap2api.taobao.org/app/mock/277955/post'
const url = 'http://rinlink-iot-asset-api-test.rinlink.com'

const getDevicesList = (data,type) => (   //分页查询设备列表
    axios.post(url+'/paging_devices?__OPERATOR_TYPE=' + type, data)
)
const searchDevices = (data) => (   //搜索设备列表
    axios.post(url+'/search_devices?__OPERATOR_TYPE=2', data)
)
const queryDevices = (data,type) => (   //查询设备列表
    axios.post(url+'/query_devices?__OPERATOR_TYPE='+type, data)
)
const editDevices = (data,type) => (   //更新设备
    axios.post(url+'/update_device?__OPERATOR_TYPE='+type, data)
)
const sellDevices = (data,type) => (   //销售设备
    axios.post(url+'/sell_devices?__OPERATOR_TYPE='+type, data)
)
const getManagerList = (data,type) => (   //分页查询系统管理员
    axios.post(url+'/paging_query_system_manager_users?__OPERATOR_TYPE='+type, data)
)
const addManager = (data,type) => (   //添加系统管理员
    axios.post(url+'/create_system_manager_user?__OPERATOR_TYPE='+type, data)
)
const editManager = (data,type) => (   //修改系统管理员
    axios.post(url+'/update_system_manager_user?__OPERATOR_TYPE='+type, data)
)
const deleManager = (data,type) => (   //删除系统管理员
    axios.post(url+'/delete_system_manager_user?__OPERATOR_TYPE='+type, data)
)
const upsetPwd = (data,type) => (   //重置系统管理员密码
    axios.post(url+'/reset_system_manager_user_password?__OPERATOR_TYPE='+type, data)
)
const update_current_system_manager_user_password = (data,type) => (   //更新当前系统管理员用户的密码
    axios.post(url+'/update_current_system_manager_user_password?__OPERATOR_TYPE='+type, data)
)
const getBManagerList = (data,type) => (   //分页查询B端管理员
    axios.post(url+'/paging_business_manager_users?__OPERATOR_TYPE='+type, data)
)
const addBManager = (data,type) => (   //添加B端管理员
    axios.post(url+'/create_business_manager_user?__OPERATOR_TYPE='+type, data)
)
const editBManager = (data,type) => (   //修改B端管理员
    axios.post(url+'/update_business_manager_user?__OPERATOR_TYPE='+type, data)
)
const deleBManager = (data,type) => (   //删除B端管理员
    axios.post(url+'/delete_business_manager_user?__OPERATOR_TYPE='+type, data)
)
const upsetBPwd = (data,type) => (   //重置B端管理员密码
    axios.post(url+'/reset_business_manager_user_password?__OPERATOR_TYPE='+type, data)
)
const getAuthority = (data) => (   //查询权限
    axios.post(url+'/query_system_manager_user_authorities', data)
)
const getCheckedAuthority = (data) => (   //查询选中的权限
    axios.post(url+'/query_system_manager_user_role_authorities', data)
)
const getRolesList = (type,data) => (   //分页查询角色
    axios.post(url+'/paging_query_system_manager_user_roles?__OPERATOR_TYPE='+type, data)
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
const getShipmentList = (data,type) => (   //分页查询出货的设备
    axios.post(url+'/paging_devices?__OPERATOR_TYPE='+type, data)
)
const shipment = (data,type) => (   //出货
    axios.post(url+'/shipment_device?__OPERATOR_TYPE='+type, data)
)
const batchShipment = (data,type) => (   //批量出货
    axios.post(url+'/batch_shipment_device?__OPERATOR_TYPE='+type, data)
)
const uploadDeviceNumber = (data,type) => (   //上传文件-设备号
    axios.post(url+'/upload_device_number?__OPERATOR_TYPE='+type, data)
)
const deleteDevice = (data,type) => (   //删除设备
    axios.post(url+'/delete_device?__OPERATOR_TYPE='+type, data)
)
const batchDeleteDevice = (data,type) => (   //批量删除设备
    axios.post(url+'/batch_delete_device?__OPERATOR_TYPE='+type, data)
)
const getBusinessList = (data,type) => (   //分页查询客户
    axios.post(url+'/paging_query_business_users?__OPERATOR_TYPE='+type, data)
)
const addBusiness = (data,type) => (   //添加客户
    axios.post(url+'/create_business_user?__OPERATOR_TYPE='+type, data)
)
const editBusiness = (data,type) => (   //修改客户
    axios.post(url+'/update_business_user?__OPERATOR_TYPE='+type, data)
)
const deleBusiness = (data,type) => (   //删除客户
    axios.post(url+'/delete_business_user?__OPERATOR_TYPE='+type, data)
)
const resetBusiness = (data,type) => (   //重置客户密码
    axios.post(url+'/reset_business_user_password?__OPERATOR_TYPE='+type, data)
)
const getBusinessUserinfo = (data,type) => (   //获取客户信息
    axios.post(url+'/get_business_user_info?__OPERATOR_TYPE='+type, data)
)
const editBusinessUserinfo = (data,type) => (   //更新客户信息
    axios.post(url+'/update_current_business_user?__OPERATOR_TYPE='+type, data)
)
const updateCurrentPwd = (data,type) => (   //更新当前用户密码
    axios.post(url+'/update_current_business_user_password?__OPERATOR_TYPE='+type, data)
)
const update_current_business_user_password = (data,type) => (   //更新D端用户密码
    axios.post(url+'/update_current_business_user_password?__OPERATOR_TYPE='+type, data)
)
const updateConsumer = (data,type) => (   //更新C端客户信息
    axios.post(url+'/update_current_consumer_user?__OPERATOR_TYPE='+type, data)
)
const resetConsumer = (data,type) => (   //更新C端用户密码
    axios.post(url+'/reset_consumer_user_password?__OPERATOR_TYPE='+type, data)
)
const update_current_consumer_user_password = (data,type) => (   //更新C端用户密码
    axios.post(url+'/update_current_consumer_user_password?__OPERATOR_TYPE='+type, data)
)
const create_device_order = (data,type) => (   //创建订单
    axios.post(url+'/create_device_order?__OPERATOR_TYPE='+type, data)
)
const get_device_order = (data,type) => (   //查询设备订单
    axios.post(url+'/get_device_order?__OPERATOR_TYPE='+type, data)
)
const paging_query_device_order = (data,type) => (   //分页查询设备订单
    axios.post(url+'/paging_query_device_order?__OPERATOR_TYPE='+type, data)
)
const paging_device_mileage_statistics = (data,type) => (   //分页查询设备的里程统计
    axios.post(url+'/paging_device_mileage_statistics?__OPERATOR_TYPE='+type, data)
)
const searchBusiness = (data,type) => (   //搜索客户信息
    axios.post(url+'/search_business_users?__OPERATOR_TYPE='+type, data)
)
const getAlarmsDetail = (data,type) => (   //分页查询报警详情
    axios.post(url+'/paging_device_alarms?__OPERATOR_TYPE='+type, data)
)
const handleDeviceAlarm = (data,type) => (   //处理报警
    axios.post(url+'/handle_device_alarm?__OPERATOR_TYPE='+type, data)
)
const handleDeviceAlarms = (type,data) => (   //全部处理报警
    axios.post(url+'/handle_device_alarms?__OPERATOR_TYPE='+type, data)
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
const alarmStatistic = (data,type) => (   //分页查询设备报警统计
    axios.post(url+'/paging_device_alarm_statistic?__OPERATOR_TYPE='+type, data)
)
const getModelList = (data,type) => (   //分页查询设备型号
    axios.post(url+'/paging_query_device_models', data)
)
const getBusiness = (data,type) => (   //查询代理商
    axios.post(url+'/query_business_users?__OPERATOR_TYPE='+type, data)
)
const getTopBusiness = (data,type) => (   //查询一级代理商
    axios.post(url+'/get_top_business_user_info?__OPERATOR_TYPE='+type, data)
)
const getServices = (type,data) => (   //查询所有IOT服务
    axios.post(url+'/query_all_iot_services?__OPERATOR_TYPE='+type, data)
)
const getRangeinfo = (type,data) => (   //查询使用范围信息
    axios.post(url+'/query_device_use_range_info?__OPERATOR_TYPE='+type, data)
)
const getCmdTemplates = (data) => (   //查询指令模板
    axios.post(url+'/list_device_command_templates', data)
)
const createCmdTemplates = (data,type) => (   //创建指令模板
    axios.post(url+'/create_device_command_template?__OPERATOR_TYPE='+type, data)
)
const updateCmdTemplates = (data,type) => (   //修改指令模板
    axios.post(url+'/update_device_command_template?__OPERATOR_TYPE='+type, data)
)
const deleteCmdTemplates = (data,type) => (   //删除指令模板
    axios.post(url+'/delete_device_command_template?__OPERATOR_TYPE='+type, data)
)
const getDeviceCmdTemplates = (data,type) => (   //获取指令模板
    axios.post(url+'/get_device_command_template?__OPERATOR_TYPE='+type, data)
)
const createDeviceCmd = (data,type) => (   //下发指令
    axios.post(url+'/create_device_cmd?__OPERATOR_TYPE='+type, data)
)
const addModel = (data,type) => (   //创建设备型号
    axios.post(url+'/create_device_model?__OPERATOR_TYPE='+type, data)
)
const updateModel = (data,type) => (   //修改设备型号
    axios.post(url+'/update_device_model?__OPERATOR_TYPE='+type, data)
)
const deleModel = (data,type) => (   //删除设备型号
    axios.post(url+'/delete_device_model?__OPERATOR_TYPE='+type, data)
)
const getOnlineDvice = (data,type) => ( //统计在线设备
    axios.post(url + '/statistics_online_devices?__OPERATOR_TYPE=' + type,data)
)
const getOfflineDevice = (data,type) => ( //统计离线设备
    axios.post(url + '/statistics_offline_devices?__OPERATOR_TYPE=' + type,data)
)
const getActivated = (data,type) => ( //统计激活设备
    axios.post(url + '/statistics_activated_devices?__OPERATOR_TYPE=' + type, data)
)
const getUnactivated_device =(data,type) => ( //统计未激活设备
    axios.post(url + '/statistics_unactivated_devices?__OPERATOR_TYPE=' + type, data)
)
const getUsing_device = (data,type) => ( //正在使用中的设备
    axios.post(url + '/statistics_using_devices?__OPERATOR_TYPE=' + type, data)
)
const getUnexpired_device = (data,type) => ( //未过期设备
    axios.post(url + '/statistics_unexpired_devices?__OPERATOR_TYPE=' + type, data)
)
const getExpired_device = (data,type) => ( //已过期设备
    axios.post(url + '/statistics_expired_devices?__OPERATOR_TYPE=' + type, data)
)
const getInventory_device = (data,type) => ( //设备库存
    axios.post(url + '/statistics_inventory_devices?__OPERATOR_TYPE=' + type, data)
)
const getSold_device = (data,type) => ( //已销售设备
    axios.post(url + '/statistics_sold_devices?__OPERATOR_TYPE=' + type, data)
)

const queryPen = (data,type) => ( //查询电子围栏
    axios.post(url + '/paging_fences?__OPERATOR_TYPE=' + type,data)
)
// 添加、更新圆形电子围栏
const createUpdateCircleFence = (sort,data,type) => {
    if (sort == 'create'){
       return axios.post(url + '/create_circle_fence?__OPERATOR_TYPE=' + type,data)
    }
    if (sort == 'update'){
       return axios.post(url + '/update_to_circle_fence?__OPERATOR_TYPE=' + type,data)
    }
}
// 添加、更新多边形电子围栏
const createUpdatePolygonFence = (sort,data,type) => {
    if (sort == 'create'){
        return axios.post(url + '/create_polygon_fence?__OPERATOR_TYPE=' + type,data)
    }
    if (sort == 'update'){
        return axios.post(url + '/update_to_polygon_fence?__OPERATOR_TYPE=' + type,data)
    }
}
// 添加、更新行政区域电子围栏
const createUpdateDistrictFence = (sort,data,type) => {
    if(sort == 'create'){
        return axios.post(url + '/create_district_fence?__OPERATOR_TYPE=' + type,data)
    }
    if(sort == 'update'){
        return axios.post(url + '/update_to_district_fence?__OPERATOR_TYPE=' + type,data)
    }
}
const deleteFence = (data,type) => ( //删除电子围栏
    axios.post(url + '/delete_fence?__OPERATOR_TYPE=' + type,data)
)
const deviceBindFence = (data,type) => ( //设备绑定围栏
    axios.post(url + '/devices_bind_fence?__OPERATOR_TYPE=' + type,data)
)
const searchFences = (data,type) => ( //搜索电子围栏
    axios.post(url + '/search_fences?__OPERATOR_TYPE=' + type,data)
)
const getDeviceDetail = (data,type) => ( //获取设备详细信息
    axios.post(url + '/get_device_detail?__OPERATOR_TYPE=' + type,data)
)
const getRangeIconList = (data,type) => ( //获取设备使用范围的icon
    axios.post(url + '/query_device_use_range_info',data)
)
const queryDeviceCmds = (data,type) => ( //获取设备历史指令
    axios.post(url + '/paging_query_device_cmds?__OPERATOR_TYPE=' + type,data)
)
const queryDeviceTracks = (data,type) => (//查询设备轨迹
    axios.post(url + '/query_device_tracks?__OPERATOR_TYPE=' + type,data)
)
const getDeviceLastCoordinate = (data,type) => (
    axios.post(url + '/get_device_last_coordinate?__OPERATOR_TYPE=' + type,data)
)
const queryCommandTemplate = (data,type) => (
    axios.post(url + '/list_device_command_templates?__OPERATOR_TYPE=' + type,data)
)
const getDeviceCommand = (data,type) => (
    axios.post(url + '/get_device_command_template?__OPERATOR_TYPE=' + type,data)
)
const sendCommand = (data,type) => (
    axios.post(url + '/create_device_cmd?__OPERATOR_TYPE=' + type,data)
)
const queryBusinessUserInfo = (data,type) => {//获取客户服务商信息
    if(type == '2'){
        return axios.post(url + '/get_business_user_info?__OPERATOR_TYPE=' + type, data)
    }else if(type == '3'){
        return axios.post(url + '/get_current_consumer_user_info?__OPERATOR_TYPE=' + type,data)
    }
}
const getCurrentUserInfo = (data) => (
    axios.post(url + '/get_current_user_info',data)
)
const queryFenceDevices = (data,type) => (
    axios.post(url + '/query_fence_devices?__OPERATOR_TYPE=' + type,data)
)
const downloadDeviceTracks = (data,type) => (//导出轨迹
    axios.post(url + '/download_device_tracks?__OPERATOR_TYPE=' + type,data,{responseType: 'arraybuffer'})
)
export default {
    login,
    getManagerList,
    addManager,
    editManager,
    deleManager,
    upsetPwd,
    update_current_system_manager_user_password,
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
    getTopBusiness,
    uploadDeviceNumber,
    deleteDevice,
    batchDeleteDevice,
    getBusinessList,
    addBusiness,
    editBusiness,
    deleBusiness,
    resetBusiness,
    getBusinessUserinfo,
    editBusinessUserinfo,
    updateCurrentPwd,
    update_current_business_user_password,
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
    getRangeinfo,
    getCmdTemplates,
    createCmdTemplates,
    updateCmdTemplates,
    deleteCmdTemplates,
    getDeviceCmdTemplates,
    createDeviceCmd,
    getBManagerList,
    addBManager,
    editBManager,
    deleBManager,
    upsetBPwd,
    updateConsumer,
    resetConsumer,
    update_current_consumer_user_password,
    create_device_order,
    get_device_order,
    paging_query_device_order,
    paging_device_mileage_statistics,
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
    updateModel,
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
    deleteFence,
    deviceBindFence,
    searchFences,
    getDeviceDetail,
    getRangeIconList,
    queryDeviceCmds,
    queryDeviceTracks,
    getDeviceLastCoordinate,
    queryCommandTemplate,
    getDeviceCommand,
    sendCommand,
    queryBusinessUserInfo,
    getCurrentUserInfo,
    queryFenceDevices,
    downloadDeviceTracks
}