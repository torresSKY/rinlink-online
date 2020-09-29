import axios from 'axios'

const login=(data)=>(
    axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/token/user/web',data)
)

const userEdit = (data) => (
    axios.put('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/user',data)
)
const outuser = (data) => { //退出登录
    return axios.post('http://rinlink-tracker.beijing-cn-k8s-test.rinlink.com/token/user/logout', data)
}

export default {
    login,
    userEdit,
    outuser
}