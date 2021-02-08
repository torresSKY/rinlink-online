import BaseTable from './table'
const components = {
  BaseTable
}
const install = (Vue) => {
  for (var key in components) {
    Vue.component(components[key].name, components[key])
  }
}
export default {
  install,
  BaseTable
}
