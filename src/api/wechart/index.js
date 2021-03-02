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
    deleModel
}