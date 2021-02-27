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