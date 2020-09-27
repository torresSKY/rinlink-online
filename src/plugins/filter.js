import i18n from '../lang'
function alatype (val) {
  // eslint-disable-next-line no-return-assign
  // return val === 0 ? i18n.t('table.noalarm') : val === 1 ? i18n.t('table.powerala') : val === 2 ? i18n.t('table.moveala')
  //   : val === 3 ? i18n.t('table.sosala') : val === 4 ? i18n.t('table.dropala') : val === 5 ? i18n.t('table.lightala')
  //     : val === 6 ? i18n.t('table.vibala') : val === 7 ? i18n.t('table.disala') : val === 8 ? i18n.t('table.smokeala')
  //       : val === 9 ? i18n.t('table.gasala') : val === 10 ? i18n.t('table.temalarm') : val === 11 ? i18n.t('table.humalarm')
  //         : val === 18 ? i18n.t('table.External') : val === 13 ? i18n.t('table.inele') : val === 14 ? i18n.t('table.outele') : val
  return val === 0 ? i18n.t('table.noalarm') : val === 1 ? i18n.t('table.temupala') : val === 2 ? i18n.t('table.temlowala')
  : val === 3 ? i18n.t('table.noalarm') : val === 4 ? i18n.t('table.alarm3') : val === 5 ? i18n.t('table.sosala')
    : val === 6 ? i18n.t('table.sosalac') : val === 7 ? i18n.t('table.alarm1') : val === 8 ? i18n.t('table.alarm2')
      : val === 9 ? i18n.t('table.humupala') : val === 10 ? i18n.t('table.humlowala') : val === 11 ? i18n.t('table.alarm4')
        : val === 12 ? i18n.t('table.alarm4') : val === 13 ? i18n.t('table.mechanical') : val === 14 ? i18n.t('table.mechanicalcancel')
          : val === 15 ? i18n.t('table.Photosensitive') : val === 16 ? i18n.t('table.Photosensitivecancel') : val === 17 ? i18n.t('table.tiltalarm')
            : val === 18 ? i18n.t('table.tiltalarmc') : val === 19 ? i18n.t('table.capsizedalarm') : val === 20 ? i18n.t('table.capsizedalarmc')
              : val === 21 ? i18n.t('table.doorala') : val === 22 ? i18n.t('table.dooralac') : val === 23 ? i18n.t('table.powerala')
                : val === 24 ? i18n.t('table.poweralac') : val === 25 ? i18n.t('table.alarm5') : val === 26 ? i18n.t('table.alarm6')
                  : val === 27 ? i18n.t('table.alarm7') : val === 28 ? i18n.t('table.fccancl') : val === 29 ? i18n.t('table.offala')
                    : val === 30 ? i18n.t('table.offcancl') : val === 31 ? i18n.t('table.alarm8') : val === 32 ? i18n.t('table.alarm9')
                      : val === 33 ? i18n.t('table.alarm10') : val === 34 ? i18n.t('table.alarm11') : val === 35 ? i18n.t('table.alarm12')
                        : val === 36 ? i18n.t('table.alarm13') : val === 37 ? i18n.t('table.alarm14') : val === 38 ? i18n.t('table.alarm15')
                          : val === 39 ? i18n.t('table.alarm16') : val === 40 ? i18n.t('table.alarm17') : val === 41 ? i18n.t('table.alarm18')
                            : val === 42 ? i18n.t('table.alarm19') : val === 43 ? i18n.t('table.alarm20') : val === 44 ? i18n.t('table.alarm21')
                            : val === 45 ? i18n.t('table.alarm22') : val === 46 ? i18n.t('table.alarm23') : val === 47 ? i18n.t('table.alarm24')
                            : val === 48 ? i18n.t('table.alarm25') : val === 49 ? i18n.t('table.alarm26') : val === 50 ? i18n.t('table.alarm27')
                            : val === 51 ? i18n.t('table.alarm28') : val === 52 ? i18n.t('table.alarm4') : val === 53 ? i18n.t('table.alarm30')
                            : val === 54 ? i18n.t('table.alarm4') : val === 55 ? i18n.t('table.alarm32') : val === 56 ? i18n.t('table.alarm33')
                            : val === 58 ? i18n.t('table.alarm34') : val === 59 ? i18n.t('table.alarm35') : val
}
function order (val) {
  if(val.indexOf(',')){
    let str = val.split(',')
    let b = []
    str.forEach(item => {
      let a = item == 0? i18n.t('table.timealarm') :item == 1? i18n.t('table.sendfc')
      //  : item == 2? '温度上下限阈值':item ==3? '湿度上下限阈值' 
       :item ==4? i18n.t('table.sendqx') : item ==5? i18n.t('table.sendmj') :item == 6? i18n.t('table.sendnow')
        // :item == 7? '倾斜参数'
         : item == 8? i18n.t('table.sendcs') :item == 9? i18n.t('table.sendsj'):item == 10? i18n.t('table.Reportfrequency'):item == 11? i18n.t('table.didian')
      :item == 12? i18n.t('table.sendsos'):item == 13? i18n.t('table.sendfmq'):item == 14? i18n.t('table.sendled')
      // :item == 15? '报警时长'
      :item == 16? i18n.t('table.sendbj'):item == 17? i18n.t('table.senddl')
      :item == 18? i18n.t('table.sendzd'):item == 19? i18n.t('table.sendlm')
      // :item == 20? '设备告警'
      :item == 30? i18n.t('table.sendfmq2') :item == 31? i18n.t('table.sendled2') : item == 32? i18n.t('table.sendopenala')
      :item == 33? i18n.t('table.sendstart') :item == 34? i18n.t('table.sendend')
      :item ==35? i18n.t('table.timealarm') :item == 36? i18n.t('table.sendcs') : item == 37? i18n.t('table.sendwd') 
      : item == 38 ? i18n.t('table.sendsd') :item == 39? i18n.t('table.sendqx2') : item == 40? i18n.t('table.sendstart2')
      : item == 41 ? i18n.t('table.sendgm') :item == 42? i18n.t('table.sendad2') : item == 43? i18n.t('table.sendzd3')
      : item == 44 ? i18n.t('table.sendyd') :item == 45? i18n.t('table.sendjz') : item == 46? i18n.t('table.sendzz')
      : val == 52? i18n.t('table.sendxlval'): val == 53? i18n.t('table.sendxlmax'): val == 54? i18n.t('table.sendxlmin'):''
      b.push(a)
    })
      console.log(val,b)
    return b
  }else{
    return val = val == 0? i18n.t('table.timealarm') :val == 1? i18n.t('table.sendfc') : val == 2? i18n.t('table.sendwd')
      :val ==3? i18n.t('table.sendsd') :val ==4? i18n.t('table.sendqx') : val ==5? i18n.t('table.sendmj') 
      :val == 6? i18n.t('table.sendnow')  :val == 7? i18n.t('table.sendqx2') : val == 8? i18n.t('table.sendcs')
      :val == 9? i18n.t('table.sendsj'):val == 10? i18n.t('table.Reportfrequency'):val == 11? i18n.t('table.didian')
      :val == 12? i18n.t('table.sendsos'):val == 13? i18n.t('table.sendfmq'):val == 14? i18n.t('table.sendled')
      :val == 15? i18n.t('table.Alarmtime'):val == 16? i18n.t('table.sendbj'):val == 17? i18n.t('table.senddl')
      :val == 18? i18n.t('table.sendzd'):val == 19? i18n.t('table.sendlm'):val == 20? i18n.t('route.Alarm')
      :val == 30? i18n.t('table.sendfmq2') :val == 31? i18n.t('table.sendled2') : val == 32? i18n.t('table.sendopenala')
      :val ==35? i18n.t('table.timealarm') :val == 36? i18n.t('table.sendcs') : val == 37? i18n.t('table.sendwd') 
      : val == 38 ? i18n.t('table.sendsd') :val == 39? i18n.t('table.sendqx2') : val == 40? i18n.t('table.sendstart2')
      : val == 52? i18n.t('table.sendxlval'): val == 53? i18n.t('table.sendxlmax'): val == 54? i18n.t('table.sendxlmin'):''
  }
}
export {alatype, order}