<template>
    <div>
        <el-table
        class="particular-table"
        :header-cell-style="{background:'#E7f2fe',color:'#5F636B'}"
        style="width:100%;overflow:auto;"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
        :row-class-name="tableRowClassName"
        :fit="true"
        :data='dataList'
        :height="height">
            <template v-for='item in tableLabel'>
                <el-table-column  v-if="item.type == 'clickEvent'"  align='center' min-width="50px" show-overflow-tooltip  :label='item.label' :prop='item.prop' :key="item.index">
                    <template slot-scope="scope">
                        <el-button @click.native.prevent='item.tableClick(scope.row)' type="text">{{item.label}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'selection'" align='center' type="selection" width="50" :label="item.label"></el-table-column>
                <el-table-column  v-else-if="item.type == 'clickSelect'"  align='center' min-width="50px" show-overflow-tooltip  :label='item.label' :prop='item.prop' :key="item.index">
                    <template class="scope" slot-scope="scope">
                        <el-dropdown @command="item.selectOperation($event,scope.row)">
                        <el-button type="primary" size="small">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="selectItem in item.selectText" :key="selectItem.index" :command="selectItem.command">
                              <span v-if="selectItem.status===1&&scope.row.handleStatus==0">
                                {{selectItem.text}}
                              </span>
                              <span v-else-if="selectItem.status===2&&scope.row.handleStatus==1">
                                {{selectItem.text}}
                              </span>
                              <span v-else-if='!selectItem.status'>{{selectItem.text}}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
                <el-table-column v-else-if="item.type == 'index'" align='center' type="index" width="50" :label="item.label"></el-table-column>
                <el-table-column v-else-if="item.type == 'renderNew'" align='center' min-width="40px"  :label='item.label' :prop='item.prop' :key="item.index">
                    <template slot-scope="scop">
                        <!-- <span v-if="item.type == 'renderNew'" :formatter='item.formatter(scop.row)'>{{scop.row[item.prop]}}</span> -->
                        <div :formatter='item.formatter(scop.row)' v-html="scop.row[item.prop]"></div>
                    </template>
                </el-table-column>
                <el-table-column v-else align='center' min-width="50px" show-overflow-tooltip  :label='item.label' :prop='item.prop' :key="item.index">
                    <template slot-scope="scop">
                        <span v-if="item.type == 'number'">{{Number(scop.row[item.prop]).toFixed(2)}}</span>
                        <span v-else-if="item.type == 'Timestamp'">{{scop.row[item.prop] | formatDate2}}</span>
                        <span v-else-if="item.type == 'TimestampDate'">{{scop.row[item.prop] | formatDate3}}</span>
                        <span v-else-if="item.type == 'render'" :formatter='item.formatter(scop.row)'>{{scop.row[item.prop]}}</span>
                        <span v-else>{{scop.row[item.prop]}}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>

    </div>
</template>
<script>
import { formatDate } from '@/plugins/date.js'

export default {
  name: 'BaseTable',
  props: {
    dataList: Array,
    tableLabel: Array,
    align: String,
    minWidth: String,
    height: Number
  },
  data () {
    return {
      multipleSelection: null
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.$emit('childByValue', this.multipleSelection)
    },
    getRowKeys (row) {
      return row.id
    },
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2) {
        return 'table-stripe'
      } else {
        return ''
      }
    },
    tableClick (val) {
      console.log('table表格中事件被触发')
      this.$emit('textClick')
    },
    selectOperation (val) {
      this.$emit('command', val)
    }
  },
  filters: {
    //  时间格式自定义 只需把字符串里面的改成自己所需的格式
    formatDate2 (time) {
      // debugger
      if (!time||time == -1) {
        return '--'
      }
      if (time != '--') {
        let date = new Date(Number(time))
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      } else {
        return time
      }

      // let date = new Date(time)
      // return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    formatDate3 (time) {
      // debugger
      if (!time) {
        return '--'
      }
      if (time != '--') {
        let date = new Date(Number(time))
        return formatDate(date, 'yyyy-MM-dd')
      } else {
        return time
      }
    }
  }
}
</script>
<style>
  .particular-table .table-stripe{
    background:#f4f4f4 !important;
  }
  .particular-table .el-table__body tr:hover>td {
    background-color: #fbec88 !important;
  }
</style>
