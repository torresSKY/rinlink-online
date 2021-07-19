import axios from 'axios'

const login=(data)=>(
    axios.post('http://iot-asset-api-test.rinlink.com/enterprise/create_token',data)
    // axios.post('http://192.168.1.184:9999/create_token',data)
)

const userEdit = (data) => (
    axios.put('http://iot-asset-api-test.rinlink.com/enterprise/user',data)
    // axios.put('http://192.168.1.184:9999/user',data)
)
const outuser = (data) => { //退出登录
    return axios.post('http://iot-asset-api-test.rinlink.com/enterprise/delete_token', data)
    // return axios.post('http://192.168.1.184:9999/delete_token', data)
}
const getInfo = (data) => { //获取当前用户信息
    return axios.post('http://iot-asset-api-test.rinlink.com/enterprise/get_current_user_info', data)
    // return axios.post('http://192.168.1.184:9999/get_current_user_info', data)
}

export default {
    login,
    userEdit,
    outuser,
    getInfo
}