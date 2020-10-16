import axios from 'axios'

axios.defaults.headers.common['Authorization'] = sessionStorage['token']

const login=(data)=>(
    axios.post('/users/login',data)
)

const getzhucheList = (imei) => (
    axios.get(`/deviceInfos?imei=${imei}`)
)

const getEqulistnew = (data) => {  // 获取所有设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device', data)
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

const getUsersListPagination = (data) => (  // 获取用户
    axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/user',data)
)

const userAdd = (data) =>(
    axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/user',data)
)

const userRegister = (data) =>(
    axios.post('/users/register',data)
)

const userEdit = (data) => (
    axios.put('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/user/child',data)
)


const userDelete=(id)=>(
    axios.delete('/users/'+id)
)

const deleteBindRecord = (id) => (
    axios.delete('/requests/'+id)
)

const getUserCount = () => (
    axios.get('/users/count')
)

const getUserEqu = (id) => (
    axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/total/' + id)
)

const getCount = (id) => (
    axios.get('/device/total/' + id)
)

const getUserCounts = (day) => (
    // axios.get(`/users/count`)
    axios.get(`/users/count?days=${day.day}`)
)

const getEquCount = () => (
    axios.get('/devices/count')
)

const getEquCounts = (day) => (
    axios.get(`/devices/count?days=${day.day}`)
)

const getEquCity = () => (
    axios.get('/devices/count/region',)
)

const getEquModel = () => (
    axios.get('/devices/count/model',)
)

const getHistory = (id,data) => ( 
    axios.get(`/devices/${id}/positions?startTime=${data.startTime}&endTime=${data.endTime}`)
)

const getLocation = (imei) => (
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/location/${imei}`)
)

const getGroupList = (obj) => ( 
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/location`,{
        params:{
            ...obj
        }
    })
)

const getGroupListPagination = (data) => ( // 获取所有分组
    axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicegroup',data)
)

const groupAdd = (data) =>( // 添加分组
    axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicegroup',data)
)

const groupEdit = (data) => ( // 编辑分组
    axios.put('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicegroup',data)
)

const groupDelete=(data)=>( // 删除分组
    axios.delete('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicegroup',data)
)


const addCoor=(imei)=>(
    axios.post('/devices/bind',{imei:imei})
)

const relieveCoor=(id,equId)=>(
    axios.delete(`/users/${id}/devices/${equId}`)
)

const getMessageListPagination = (data) => ( //获取报警数据
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/warning`,data)
)

const getMessageChuli = (val) => ( //报警数据处理
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/warningProcess?alarmId=`+ val +`&isProcess=1`)
)

const getMessageCount = (data) => ( //获取报警统计
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/warningCount`,data)
)

const getMessageDown = (data) => ( //报警统计柱状图
    axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/exportWarningExcelImpage`,data)
)

const sendorder = (data) => {
   return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/order', data)
}

const historyOrder = (data) => {
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/order', data)
}

const getfence = (data) => { //电子围栏列表
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/addFence', data)
}
const delefence = (data) => { //删除电子围栏
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/addFence', data)
}
const fenceequ = (data) => { //查询围栏下的设备
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/addFence', data)
}
const otherequ = (data) => { //查询电子围栏外的设备
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/addFence', data)
}
const fenceadd = (data) => { //添加电子围栏
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/addFence', data)
}
// const sendele = (data) => { //移除设备
//     return axios.post('http://aep-location.beijing.rinlink.com/device/addFence', data)
// }


const addmoreequ = (data,file) => { //批量添加设备
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/uploadDevExcel?deviceGroup='+data.deviceGroup+'&deviceModel='+data.deviceModel,file)
}

const getowern = (data) => { //批量添加设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/getUserIdList/' + data)
}

const downalalist = (data) => { //批量添加设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/devicedata/exportAlarm' , data)
}
const getall = () => { //首页所有设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/home')
}
const deleuser = (data) => { //删除子用户
    return axios.delete('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/user/'+data)
}
const downlist = (data) => { //下载所有设备列表
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/exportDevices',data)
}
const getData = (data) => { //600N历史数据
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/d600n',data)
}
const searone = (data) => { //查询单设备电子围栏
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/device/getDeviceFences/'+data)
}
const deledian = (data) => { //删除电子围栏
    return axios.delete('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence?fenceId=' + data)
}
const sendele = (data) => { //添加电子围栏
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence', data)
}
const editele = (data) => { //编辑电子围栏
    return axios.put('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence', data)
}
const unlikeequ = (data) => { //取消关联
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence/fenceBindRelieveDev', data)
}
const likeequ = (data) => { //关联设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence/fenceBindDev', data)
}
const oldequlist = (data) => { //查询单个围栏已绑定所有设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence/getFenceBindDevCondition/', data)
}
const searchdian = (data) => { //查询电子围栏列表
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence', data)
}
const newequlist = (data) => { //查询单个围栏未绑定设备
    return axios.get('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/fence/getDeviceList/', data)
}
const getOrder = (imei) => { //查询指定终端参数
    return axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/cmd/queryTerminalParameter/${imei}`)
}
const sendOrder = (data) => { //设置终端参数
    return axios.post(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/cmd/setTerminalParameter/`, data)
}
const sendControl = (imei,cmdWord) => { //设置终端控制参数
    return axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/cmd/terminalControl/${imei}/${cmdWord}`)
}
const sendInform = (data) => { //设置信息服务
    return axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/cmd/informationServer/`, data)
}
const queryOrder = (data) => { //查询历史下发的指令记录(报表)
    return axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/cmd/queryCmd/`, data)
}
const queryLog = (data) => { //查询操作日志
    return axios.get(`http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/cmd/operation/`, data)
}
export default {
    getOrder,
    sendOrder,
    sendControl,
    sendInform,
    queryOrder,
    queryLog,
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
    getUsersListPagination,
    userAdd,
    userRegister,
    userEdit,
    userDelete,
    deleteBindRecord,
    getUserCount,
    getUserCounts,
    getUserEqu,
    getEquCount,
    getEquCounts,
    getEquCity,
    getEquModel,
    getHistory,
    getLocation,
    getGroupList,
    getGroupListPagination,
    groupAdd,
    groupEdit,
    groupDelete,
    addCoor,
    relieveCoor,
    getMessageListPagination,
    getMessageChuli,
    getMessageCount,
    getMessageDown,
    sendorder,
    getCount,
    historyOrder,
    addmoreequ,
    getowern,
    downalalist,
    getall,
    deleuser,
    downlist,
    getData,
    searone,
    deledian,
    sendele,
    editele,
    unlikeequ,
    likeequ,
    oldequlist,
    searchdian,
    newequlist,
}