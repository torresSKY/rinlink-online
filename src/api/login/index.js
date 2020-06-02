import axios from 'axios'

const login=(data)=>(
    axios.post('http://aep-location.beijing.rinlink.com/token/user/web',data)
)

const userEdit = (data) => (
    axios.put('http://aep-location.beijing.rinlink.com/user',data)
)
const outuser = (data) => { //退出登录
    return axios.post('http://aep-location.beijing.rinlink.com/token/user/logout', data)
}

export default {
    login,
    userEdit,
    outuser
}