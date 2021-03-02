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
    axios.post(url+'/paging_query_system_manager_user', data)
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
const getRolesList = (data) => (   //分页查询角色
    axios.post(url+'/paging_query_system_manager_user_roles', data)
)
const getModelList = (data) => (   //分页查询设备型号
    axios.post(url+'/paging_query_device_model', data)
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
export default {
    login,
    getManagerList,
    addManager,
    editManager,
    deleManager,
    upsetPwd,
    getAuthority,
    getRolesList,
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
    getSold_device
}