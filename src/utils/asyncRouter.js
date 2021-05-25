// asyncRouter.js
//判断当前角色是否有访问权限
function hasPermission(roles, route) {
    // debugger
    if (route.roles) {
        console.log(roles.some(role => route.roles.includes(role)))
      return roles.some(role => route.roles.includes(role))
    } else {
      return true
    }
  }
  // 递归过滤异步路由表，筛选角色权限路由
  export function filterAsyncRoutes(routes, roles) {
    //   debugger
    const res = [];
    routes.forEach(route => {
      const tmp = { ...route }
      if (hasPermission(roles, tmp)) {
        if (tmp.children) {
          tmp.children = filterAsyncRoutes(tmp.children, roles)
        }
        res.push(tmp)
      }
    })
  
    return res
  }