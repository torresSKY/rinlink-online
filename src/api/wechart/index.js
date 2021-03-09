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
const getBusinessUserinfo = (data) => (   //获取客户信息
    axios.post(url+'/get_business_user_info', data)
)
const searchBusiness = (data) => (   //获取客户信息
    axios.post(url+'/search_business_users', data)
)
const getModelList = (data) => (   //分页查询设备型号
    axios.post(url+'/paging_query_device_models', data)
)
const getBusiness = (data) => (   //查询代理商
    axios.post(url+'/query_business_users', data)
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
    axios.post(url + '/statistics_online_device',data)
)
const getOfflineDevice = (data) => ( //统计离线设备
    axios.post(url + '/statistics_offline_device',data)
)
const getActivated = (data) => ( //统计激活设备
    axios.post(url + '/statistics_activated', data)
)
const getUnactivated_device =(data) => ( //统计未激活设备
    axios.post(url + '/statistics_unactivated_device', data)
)
const getUsing_device = (data) => ( //正在使用中的设备
    axios.post(url + '/statistics_using_device', data)
)
const getUnexpired_device = (data) => ( //未过期设备
    axios.post(url + '/statistics_unexpired_device', data)
)
const getExpired_device = (data) => ( //已过期设备
    axios.post(url + '/statistics_expired_device', data)
)
const getInventory_device = (data) => ( //设备库存
    axios.post(url + '/statistics_inventory_device', data)
)
const getSold_device = (data) => ( //已销售设备
    axios.post(url + '/statistics_sold_device', data)
)
const createCircleFence = (data) => ( //添加圆形电子围栏
    axios.post(url + '/create_circle_fence',data)
)
const createPolygonFence = (data) => ( //添加多边形围栏
    axios.post(url + '/create_polygon_fence',data)
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
    getBusinessUserinfo,
    searchBusiness,
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
    createCircleFence,
    createPolygonFence
}