import BMap from 'BMap'
import jsonp from 'jsonp'
export function getaddress (val) {
  var myGeo = new BMap.Geocoder()
  let srr = null
  myGeo.getLocation(new BMap.Point(val[1], val[0]), function (result) { // 根据坐标得到地址描述
    console.log('获取的地址')
    // srr = val
    if (result) {
      if (result.address) {
        srr = result.address
        console.log(result, '获取的地址')
        return srr
      } else {
        srr = '--'
        return srr
      }
    } else {
      return '--'
    }
  })
}
export function getbaidu (lat, lon) {
  return new Promise((resolve, reject) => {
    jsonp('http://api.map.baidu.com/geoconv/v1/?coords=' + lon + ',' + lat + '&from=1&to=5&ak=W7jjyY6GWGFaDO1iiStN3vQNlBx2pA6z',
      null, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data.result)
        }
      })
  })
}
