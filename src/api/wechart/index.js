import axios from 'axios'

axios.defaults.headers.common['Authorization'] = sessionStorage['token']

const login=(data)=>(
    axios.post('/users/login',data)
)

const getzhucheList = (imei) => (
    axios.get(`/deviceInfos?imei=${imei}`)
)

const getEqulistnew = (data) => {  // 获取所有设备
    return axios.get('/device', data)
}

const getzhucheListPagination = (data) => (
    axios.post('/deviceInfos/pagination',data)
)

const zhucheAdd = (data) =>(
    axios.post('/deviceInfos',data)
)

const zhucheEdit = (id,data) =>(
    axios.put('/deviceInfos/'+id,data)
)

const zhucheDelete=(id)=>(
    axios.delete('/deviceInfos/'+id)
)

const getEquList = (data) => (  //查询单个设备
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/check`, data)
)

const getEquListtwo = (data) => (   //模糊查询设备
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/getDevInfoByLike`, data)
)

const getEquListPagination = (data) => (
    axios.post('/devices/pagination',data)
)

const equAdd = (data) =>(
    axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device',data)
)

const equEdit = (data) => (
   axios.put('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device',data)
)

const equDelete=(id)=>(
    axios.delete('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/' + id)
)

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
export default {
    login,
    getEqulistnew,
    getzhucheList,
    getzhucheListPagination,
    zhucheAdd,
    zhucheEdit,
    zhucheDelete,
    getEquList,
    getEquListtwo,
    getEquListPagination,
    equAdd,
    equEdit,
    equDelete,
    getUsersList,
    getModelList,
    getServices
}