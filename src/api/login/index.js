import axios from 'axios'

const login=(data)=>(
    axios.post('http://rinlink-iot-asset-api-test.rinlink.com/create_token',data)
)

const userEdit = (data) => (
    axios.put('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/user',data)
)
const outuser = (data) => { //退出登录
    return axios.post('http://rinlink-iot-asset-api-test.rinlink.com/delete_token', data)
}

export default {
    login,
    userEdit,
    outuser
}