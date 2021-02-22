<template>
    <div id="alarmOverview" >
        <el-row :gutter="22">
            <el-col :span='24'>
                <el-row :gutter="22" style="margin-top:10px">
                     <el-col :span='2' style="line-height:40px">
                        <el-select v-model="value" >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='5' >
                        <el-date-picker
                          style="width:98%"
                          v-model="value1"
                          type="datetimerange"
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="value" >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='3'>
                        <el-input v-model="input3" :placeholder="$t('view.inputimei')"></el-input>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="value" >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='3' style="line-height:40px">
                        <el-select v-model="value" >
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span='2' style="line-height:40px">
                      <el-checkbox v-model="checked">{{$t('view.subordinate')}}</el-checkbox>
                    </el-col>
                    <el-col :span='3'>
                      <el-button class="butresh" >{{$t('button.search')}}</el-button>
                      <el-button class="butadd" >{{$t('button.download')}}</el-button>
                    </el-col>
                </el-row>
                <el-row style="margin-top:10px">
                    <BaseTable v-loading="loading" :dataList="dataList" :tableLabel="tableLabel"  style="height:60vh" ></BaseTable>
                </el-row>
            </el-col>
        </el-row>
        

    </div>
</template>
<script>
import api from "@/api/wechart/index"
import mixin from "@/mixins/index"
import { mapState } from "vuex"
import BaseTable from '@/components/table'
export default {
  name: "punchReport",
  components:{ BaseTable },
  mixins: [mixin],
  computed: {
    ...mapState({ user: "user", adminRoles: "roles" })
  },
  data() {
    return {
      input3:'',
      data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        value:'',
        options:[],
        checked:true,
        loading:false,
        dataList: [],
        tableLabel: [
        {label: this.$t('table.Device'), prop: 'serial_number'},
        {label: this.$t('table.imei'), prop: 'category'},
         {label: this.$t('table.equPhone'), prop: 'partner_contacts'},
        {label: this.$t('table.groupname'), prop: 'partner_contacts'},
        {label: this.$t('table.model'), prop: 'partner_contacts'},
        {label: this.$t('table.clockTime'), prop: 'partner_contacts'},
        {label: this.$t('table.clockType'), prop: 'partner_contacts'},
        {label: this.$t('table.clockAddress'), prop: 'partner_contacts'},
   
      ],
      value1:[]

    }
  },
  mounted() {

  },
  methods: {
    handleNodeClick(data) { // 选择用户节点
        console.log(data)
    },

  }
}
</script>
<style type="stylesheet/scss" lang="scss" scoped>
</style>
