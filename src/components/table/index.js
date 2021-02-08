import BaseTable from './table'

BaseTable.install = (val) => {
  // eslint-disable-next-line no-undef
  Vue.component(BaseTable.name, BaseTable)
}
export default BaseTable
