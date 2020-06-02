import i18n from '../lang'
function alatype (val) {
  console.log(i18n.t('table.searchimei'))
  // eslint-disable-next-line no-return-assign
  // return val === 0 ? i18n.t('table.noalarm') : val === 1 ? i18n.t('table.powerala') : val === 2 ? i18n.t('table.moveala')
  //   : val === 3 ? i18n.t('table.sosala') : val === 4 ? i18n.t('table.dropala') : val === 5 ? i18n.t('table.lightala')
  //     : val === 6 ? i18n.t('table.vibala') : val === 7 ? i18n.t('table.disala') : val === 8 ? i18n.t('table.smokeala')
  //       : val === 9 ? i18n.t('table.gasala') : val === 10 ? i18n.t('table.temalarm') : val === 11 ? i18n.t('table.humalarm')
  //         : val === 18 ? i18n.t('table.External') : val === 13 ? i18n.t('table.inele') : val === 14 ? i18n.t('table.outele') : val
  return val === 0 ? '无报警' : val === 1 ? '温度上限报警' : val === 2 ? '温度下限报警'
  : val === 3 ? '温度报警解除' : val === 4 ? '温度报警解除' : val === 5 ? 'SOS报警'
    : val === 6 ? 'SOS报警解除' : val === 7 ? '外供电报警' : val === 8 ? '外供电报警解除'
      : val === 9 ? '湿度上限报警' : val === 10 ? '湿度下限报警' : val === 11 ? '湿度报警解除'
        : val === 12 ? '湿度报警解除' : val === 13 ? '机械开关触发报警' : val === 14 ? '机械开关触发报警解除'
          : val === 15 ? '光敏开关触发报警' : val === 16 ? '光敏开关触发报警解除' : val === 17 ? '倾斜报警'
            : val === 18 ? '倾斜报警解除' : val === 19 ? '倾覆报警' : val === 20 ? '倾覆报警解除'
              : val === 21 ? '开门报警' : val === 22 ? '关门报警' : val === 23 ? '低电量报警'
                : val === 24 ? '低电量报警解除' : val === 25 ? '震动告警' : val === 26 ? '震动告警解除'
                  : val === 27 ? '防拆告警' : val === 28 ? '防拆告警解除' : val === 29 ? '断电告警'
                    : val === 30 ? '断电告警解除' : val === 31 ? '高温告警' : val === 32 ? '高温告警解除'
                      : val === 33 ? '低温告警' : val === 34 ? '低温告警解除' : val === 35 ? '浸水报警'
                        : val === 36 ? '浸水报警解除' : val === 37 ? '火警报警' : val === 38 ? '火警报警解除'
                          : val === 39 ? '红外报警' : val === 40 ? '红外报警解除' : val === 41 ? '微波报警'
                            : val === 42 ? '微波报警解除' : val === 43 ? '遮挡报警' : val === 44 ? '遮挡报警解除'
                            : val === 45 ? '超出电子围栏报警' : val === 46 ? '跌落报警' : val === 47 ? '光感报警'
                            : val === 48 ? '拆机报警' : val === 49 ? '烟雾报警' : val === 50 ? '燃气报警'
                            : val === 51 ? '温度报警' : val === 52 ? '湿度报警解除' : val === 53 ? '湿度报警'
                            : val === 54 ? '湿度报警解除' : val === 55 ? '进围栏报警' : val === 56 ? '出围栏报警' : '--'
}
function order (val) {
  if(val.indexOf(',')){
    let str = val.split(',')
    let b = []
    str.forEach(item => {
      let a = item == 0? '上报间隔与采集间隔' :item == 1? '防拆功能启停'
      //  : item == 2? '温度上下限阈值':item ==3? '湿度上下限阈值' 
       :item ==4? '倾斜功能启停' : item ==5? '门禁功能启停' :item == 6? '安装就绪'
        // :item == 7? '倾斜参数'
         : item == 8? '超限时设备上报间隔与采集间隔' :item == 9? '升级固件':item == 10? '上报频率':item == 11? '低电量阈值'
      :item == 12? 'SOS启停':item == 13? '蜂鸣器功能启停':item == 14? 'LED灯功能启停'
      // :item == 15? '报警时长'
      :item == 16? '报警持续重复推送次数':item == 17? '电量报警阈值'
      :item == 18? '震动告警开关':item == 19? '设置设备灵敏度'
      // :item == 20? '设备告警'
      :item == 30? '设置蜂鸣报警时长' :item == 31? '设置LED报警时长' : item == 32? '开启关闭报警'
      :item == 33? '每天亮屏开始时间' :item == 34? '每天亮屏结束时间'
      :item ==35? '上报间隔与采集间隔' :item == 36? '超限时设备上报间隔与采集间隔' : item == 37? '温度上下限阈值' 
      : item == 38 ? '湿度上下限阈值' :item == 39? '倾斜参数' : item == 40? '每天亮屏时间'
      : item == 41 ? '光敏触发开关' :item == 42? '震动触发开关' : item == 43? '震动灵敏度'
      : item == 44 ? '运动上报间隔' :item == 45? '静止上报间隔' : item == 46? '追踪模式启停':''
      b.push(a)
    })
      console.log(val,b)
    return b
  }else{
    return val = val == 0? '上报间隔与采集间隔' :val == 1? '防拆功能启停' : val == 2? '温度上下限阈值'
      :val ==3? '湿度上下限阈值' :val ==4? '倾斜功能启停' : val ==5? '门禁功能启停' 
      :val == 6? '安装就绪' :val == 7? '倾斜参数' : val == 8? '超限时设备上报间隔与采集间隔'
      :val == 9? '升级固件':val == 10? '上报频率':val == 11? '低电量阈值'
      :val == 12? 'SOS启停':val == 13? '蜂鸣器功能启停':val == 14? 'LED灯功能启停'
      :val == 15? '报警时长':val == 16? '报警持续重复推送次数':val == 17? '电量报警阈值'
      :val == 18? '震动告警开关':val == 19? '设置设备灵敏度':val == 20? '设备告警'
      :val == 30? '设置蜂鸣报警时长' :val == 31? '设置LED报警时长' : val == 32? '开启关闭报警'
      :val ==35? '上报间隔与采集间隔' :val == 36? '超限时设备上报间隔与采集间隔' : val == 37? '温度上下限阈值' 
      : val == 38 ? '湿度上下限阈值' :val == 39? '倾斜参数' : val == 40? '每天亮屏时间':''
  }
}
export {alatype, order}