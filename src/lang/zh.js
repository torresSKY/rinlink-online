
export default {
  // 导航栏
  navbar: {
    // 'title': '零零AEP资产管理平台',
    'title': '零零在线',
    // 'title': '中国联通资产管理平台',
    'languageSwitch': 'languageSwitch',
    'theme': 'Theme'
  },
  route: {
    Home: '首页',
    Equmanage: '设备管理',
    List: '设备列表',
    Data: '设备数据',
    Add: '添加设备',
    Location: '设备定位',
    Trajectory: '设备轨迹',
    Group: '设备分组',
    Historical: '历史数据',
    Alarm: '设备报警',
    aladata: '报警数据',
    showala: '报警管理',
    User: '用户管理',
    tongji: '报警统计',
    fence: '围栏管理',
    control:'控制台',
    statistics:'统计列表',
    setting:'系统设置'
  }, 
  button: {
    editAdmin:'编辑管理员',
    addAdmin:'添加管理员',
    editrole:'编辑角色',
    addrole:'新增角色',
    addpiliang: '批量添加',
    download: '导出',
    login: '登录',
    search: '查询',
    dele: '删除',
    add: '添加',
    refresh: '刷新',
    save: '保存',
    determine: '确定',
    prompt: '提示',
    editor: '编辑',
    cancel: '取消',
    send: '下发指令',
    historysend: '历史指令',
    changepassword: '修改密码',
    logout: '退出登录',
    open: '开',
    close: '关',
    fen: '分钟',
    miao: '秒',
    shewei: '电子围栏',
    delewei: '删除电子围栏',
    ch: '中文',
    en: '英文',
    jpn: '日文',
    more: '更多',
    clickip: '点击上传 ',
    control:'控制台',
    addCustomer:'添加客户',
    editCustomer:'编辑客户'
  },
  view: {
    permission:'权限配置',
    user:'角色',
    admin:'登录账号',
    username:'用户名称',
    superiorUser:'上级用户',
    customerList:'客户列表',
    customerManage:'客户管理',
    usersManage:'角色管理',
    adminManage:'管理员管理',
    customerType:'客户类型',
    allCust:'全部客户',
    expire:'到期',
    searchUser:'请输入客户名称或账号',
    subordinate:'包含下级',
    mi: '米',
    dengji: '等级',
    close: '关闭',
    upfile: '上传文件',
    inputimei: '请输入设备IMEI',
    inputgroup: '请选择查询分组',
    inputstate: '请选择设备状态',
    inputlabel: '请选择设备标签',
    inputtext: '请输入内容',
    inputele: '请选择报警类型',
    dataxi: '详细数据',
    deviceinfo: '设备详情',
    inputstate2: '请输入设备使用状态',
    homedata: '设备概况',
    homeall: '设备总数',
    homeon: '在线设备',
    homeoff: '离线设备',
    homeon2: '在线',
    homeoff2: '离线',
    homeala: '告警设备',
    email: '邮箱',
    paw: '密码',
    confirmPaw:'确认密码',
    oldpaw: '旧密码',
    newpaw: '新密码',
    again: '重复新密码',
    region: '地区',
    region0: '中国境内',
    region1: '其他',
    ele: '电量',
    bangding: '绑定记录',
    radius: '半径范围',
    fence1: '围栏列表',
    fence2: '围栏名称',
    fence3: '围栏半径(米)',
    fence4: '围栏地址',
    fence5: '编辑围栏',
    fence6: '添加围栏',
    fence7: '进出围栏报警',
    fence8: '进',
    fence9: '出',
    Photosensitive: '光敏开关触发报警',
    select2: '请选择',
    userLogin:'用户登录',
    sel: '请选择设备'
  },
  table: {
    status: '设备状态',
    usestatus: '使用状态',
    label:'标签',
    adminName:'管理员名称',
    roleName:'角色名称',
    roleType:'角色类型',
    index:'序号',
    customerName:'客户名称',
    count:'账号',
    phone:'电话',
    contacts:'联系人',
    equNo:'设备数量',
    seachtime: '选择查询时间',
    selopentime: '选择开始时间',
    selendtime: '选择结束时间',
    list: '设备数据',
    chart: '折线图',
    heart: '心率',
    step: '步数',
    charttab: '心率变化折线图',
    alertmess: '告警次数',
    shewei: '电子围栏',
    clicktext: '只能上传excel文件，且不超过5M',
    equloctype: '基站',
    equlocation: '定位类型',
    equadmin: '设备管理员',
    equinfo: '设备详情',
    inputtext: '请输入内容',
    inputele: '请选择报警类型',
    day: '按日选择',
    mounth: '按月选择',
    year: '按年选择',
    Year: '年',
    Mounth: '月',
    Day: '日',
    ci: '次',
    chuli: '处理',
    addsend: '下发指令',
    timetext: '数据上报间隔为：',
    warntime: '注意：如果自定义时间请将频率选择为自定义',
    pinlv: '默认频率',
    ziding: '自定义',
    zitime: '自定义时间',
    two: '2分钟',
    five: '5分钟',
    ten: '10分钟',
    minute: '分钟',
    sendtime: '静止模式上报间隔',
    order1: '运动模式的上报间隔',
    order2: '触发fato升级指令',
    faillist: '获取列表失败',
    failsearch: '查找失败',
    clear: '清空',
    loctype: '定位方式',
    nouser: '暂无用户',
    searchimei: '请输入设备imei号',
    devuser: '设备管理员',
    userid: '管理员ID',
    Device: '设备名称',
    imei: '设备imei',
    equgroup: '设备分组',
    groupname: '分组名称',
    equgro: '所属分组',
    frequency: '采集频率',
    Reportfrequency: '上报频率',
    frequency2: '异常采集频率',
    Reportfrequency2: '异常上报频率',
    type: '设备类型',
    operation: '操作',
    defaultgroup: '默认分组',
    defaultdevice: '默认设备',
    temperature: '温度',
    humidity: '湿度',
    Update: '更新时间',
    Detailed: '详细地址',
    seletime: '选择时间',
    addtime: '添加时间',
    temporarily: '暂无数据',
    alarno: '暂无报警',
    alarmrecord: '报警记录',
    alarmvalue: '报警设备值',
    alartime: '报警时间',
    temalarm: '温度告警',
    humalarm: '湿度告警',
    batalarm: '电量告警',
    moveala: '超出电子围栏',
    sosala: 'sos告警',
    dropala: '跌落告警',
    lightala: '光感告警',
    vibala: '震动报警',
    disala: '拆机告警',
    smokeala: '烟雾告警',
    gasala: '燃气告警',
    timealarm: '上报间隔与采集间隔',
    caiji: '采集时间',
    randomtime: '任意时间点',
    randomdata: '请输入具体值',
    inputno: '输入不得为空',
    powerala: '低电量告警',
    changeinfo: '修改设备信息',
    touser: '分配用户',
    adress: '地址',
    deladress: '详细地址',
    jing: '经度',
    wei: '纬度',
    sendtype: '下发指令类型',
    zhitype: '指令类型',
    zhidata: '指令数据',
    creattime: '创建时间',
    // '光感触发',
    // '光感灵敏度触发',
    // '震动触发',
    // '震动灵敏度触发',
    // '最低MAC地址个数',
    didian: '低电量报警阈值',
    jie: '执行结果',
    wait: '等待设备执行',
    alatype: '报警类型',
    default: '默认',
    chosetime: '选择日期',
    startdata: '开始日期',
    timeerror: '结束时间必须晚于开始时间',
    enddata: '结束日期',
    update: '数据上传时间',
    datacon: '数据内容',
    datatype: '数据类型',
    note: '备注',
    zhudate: '注册时间',
    username: '用户名',
    addgn: '添加设备分组',
    editgroup: '编辑分组',
    dergroup: '分组描述',
    nowdata: '设备实时信息',
    seleall: '全选',
    chexiao: '撤销',
    lora: 'LoRa模块',
    ble: 'BLE模块',
    pastcl: '已处理',
    nocl: '未处理',
    chuli: '处理',
    out: '出电子围栏',
    in: '入电子围栏',
    noalarm: '无报警',
    temupala: '温度上限报警',
    temlowala: '温度下限报警',
    temupcanael: '温度上限报警解除',
    temlowcanael: '温度下限报警解除',
    humupala: '湿度上限报警',
    humlowala: '湿度下限报警',
    humupcanael: '湿度上限报警解除',
    humlowcanael: '湿度下限报警解除',
    mechanical: '机械开关触发报警',
    mechanicalcancel: '机械开关触发报警解除',
    Photosensitive: '光敏开关触发报警',
    Photosensitivecancel: '光敏开关触发报警解除',
    tiltalarm: '倾斜报警',
    tiltalarmc: '倾斜报警解除',
    capsizedalarm: '倾覆报警',
    capsizedalarmc: '倾覆报警解除',
    doorala: '开门报警',
    dooralac: '关门告警',
    waterala: '水浸报警',
    wateralac: '水浸报警解除',
    powerala: '低电量报警',
    poweralac: '低电量报警解除',
    menciala: '开门报警',
    mencialac: '开门报警解除',
    sosala: 'SOS报警',
    sosalac: 'SOS报警解除',
    wdcancl: '湿度告警解除',
    sdcancl: '温度告警解除',
    fccancl: '防拆告警解除',
    qxcanal: '倾斜告警解除',
    mjcancl: '开门告警解除',
    ddcancl: '低电量告警解除',
    sportala: '运动告警',
    sportcancl: '运动告警解除',
    offala: '断电告警',
    offcancl: '断电告警解除',
    outele: '出围栏告警',
    inele: '进围栏告警',
    External: '外部掉电报警',
    model: '设备型号',
    opentam: '开启防拆',
    closetam: '关闭防拆',
    temlower: '设置温度下限值',
    humlower: '设置湿度下限值',
    temupper: '设置温度上限值',
    humupper: '设置湿度上限值',
    inputstart: '开始时间',
    inputend: '结束时间',
    Alarmtime: '报警时长',
    zdzhouqi: '震动检测周期',
    orderdata: '指令内容',
    alarm1: '外供电报警',
    alarm2: '外供电报警解除',
    alarm3: '温度报警解除',
    alarm4: '湿度报警解除',
    alarm5: '震动报警',
    alarm6: '震动告警解除',
    alarm7: '防拆告警',
    alarm8: '高温告警',
    alarm9: '高温告警解除',
    alarm10: '低温告警',
    alarm11: '低温告警解除',
    alarm12: '浸水报警',
    alarm13: '浸水报警解除',
    alarm14: '火警报警',
    alarm15: '火警报警解除',
    alarm16: '红外报警',
    alarm17: '红外报警解除',
    alarm18: '微波报警',
    alarm19: '微波报警解除',
    alarm20: '遮挡报警',
    alarm21: '遮挡报警解除',
    alarm22: '超出电子围栏报警',
    alarm23: '跌落报警',
    alarm24: '光感报警',
    alarm25: '拆机报警',
    alarm26: '烟雾报警',
    alarm27: '燃气报警',
    alarm28: '温度报警',
    alarm29: '湿度报警解除',
    alarm30: '湿度报警',
    alarm31: '湿度报警解除',
    alarm32: '进区域报警',
    alarm33: '出区域报警',
    alarm34: '心率过速报警',
    alarm35: '心率过低报警',
    sendfc:'防拆功能启停',
    sendqx:'倾斜功能启停',
    sendmj:'门禁功能启停',
    sendnow:'安装就绪',
    sendcs:'超限时设备上报间隔与采集间隔',
    sendsj:'升级固件',
    sendsos:'SOS启停',
    sendfmq:'蜂鸣器功能启停',
    sendled:'LED灯功能启停',
    sendbj:'报警持续重复推送次数',
    senddl:'电量报警阈值',
    sendzd:'震动告警开关',
    sendlm:'设置设备灵敏度',
    sendfmq2:'设置蜂鸣报警时长',
    sendled2:'设置LED报警时长',
    sendopenala:'开启关闭报警',
    sendstart:'每天亮屏开始时间',
    sendend:'每天亮屏结束时间',
    sendwd:'温度上下限阈值',
    sendsd:'湿度上下限阈值',
    sendqx2:'倾斜参数',
    sendstart2:'每天亮屏时间',
    sendgm:'设置光敏触发开关',
    sendzd2:'设置光敏震动开关',
    sendzd3:'设置震动灵敏度',
    sendyd:'运动模式',
    sendjz:'静止模式',
    sendzz:'追踪模式',
    sendpv: '心跳间隔',
    sendxlval: '使能心率阈值报警',
    sendxlmax: '心率过速值',
    sendxlmin: '心率过缓值',
    addequ: '关联设备',
    butgl: '关联',
    canaleadd: '取消关联',
    select: '选择',
    Sensitivity1: '低',
    Sensitivity2: '中',
    Sensitivity3: '高',
    Sensitivity4: '超高',
    params1:'终端心跳发送间隔（s）',
    params2:'主服务器 APN',
    params3:'主服务器地址,IP',
    params4:'备份服务器地址,IP',
    params5:'服务器 TCP 端口',
    params6:'位置汇报策略',
    params7:'休眠时汇报时间间隔（s）',
    params8:'缺省时间汇报间隔（s）',
    params9:'缺省距离汇报间隔（m）',
    params10:'拐点补传角度',
    params11:'工作模式',
    params12:'最高速度（km/h）',
    params13:'超速持续时间（s）',
    params14:'碰撞报警参数设置',
    params15:'侧翻报警参数设置',
    params16:'车辆里程表读数（1/10km）',
    params17:'车辆所在的省域 ID（1～255）',
    params18:'车辆所在的市域 ID（1～255）',
    params19:'机动车号牌',
    params20:'车牌颜色',
    params21:'信息服务',
    strategy1:'定时汇报',
    strategy2:'定距汇报',
    strategy3:'定时和定距汇报',
    model1:'关闭休眠',
    model2:'静止超过 10 分钟关闭 GPS，但不关闭 GPRS，设备保持在线',
    model3:'静止超过 10 分钟关闭 GPS，关闭 GPRS，设备将会离线',
    orderCode:'指令代码',
    operLog:'系统操作日志',
    pengTime:'碰撞时间（4ms）',
    pengSpeed:'碰撞加速度（0.1g）',
    carNo:'车牌号',
    chaichuala:'拆除报警',
    jiasuala:'急加速报警',
    jiansuala:'急减速报警',
    zhuanwanala:'急转弯报警',
    jinjiala:'紧急报警',
    chaosuala:'超速报警',
    power1ala:'终端主电源欠压',
    power2ala:'终端主电源掉电',
    weiyiala:'车辆非法位移',
    pengzhuangala:'碰撞预警',
    cefanala:'侧翻预警',
    params22:'服务器地址,IP',
    params23:'终端复位(重启)',
    params24:'终端恢复出厂设置',
    params25:'断油电',
    params26:'通油电',
    params27:'设防',
    params28:'撤防',
    blue:'蓝色',
    yellow:'黄色',
    black:'黑色',
    white:'白色',
    other:'其他'
  },
  message: {
    equdele: '删除后无法恢复, 是否继续?',
    xuanze: '请选择电子围栏中心',
    delesuc: '删除成功',
    delefail: "删除失败",
    undele: '已取消删除',
    changesuc: '修改成功',
    changefail: "修改失败",
    addfail: "添加失败",
    addsuc: '添加成功',
    userempty: '用户名或密码不能为空',
    usererror: '用户名或密码错误',
    usertwo: '用户名已存在',
    sendsuc: '指令下发成功',
    imeiempty: 'imei不能为空',
    existed: '该imei已存在',
    errorno: '该设备不存在',
    locationno: '没有定位数据',
    allterloca: "部分设备没有定位数据",
    noweilan: '该设备没有设置电子围栏',
    hisempty: '轨迹为空',
    pawempty: '旧密码或新密码不允许为空',
    erroepaw: '旧密码错误,请重试',
    erroryan: '验证失败,请重试',
    newpawempty: '新密码不一致',
    loginuser: '用户名不能小于3位',
    pawuser: '密码不能小于6位',
    fail: '执行失败',
    success: '执行完成',
    savesuc: '保存成功',
    timeno: '时间输入有误',
    outele: '是否确认删除该电子围栏?',
    outlog: '是否确认退出登录?',
    delegroup: '是否确定删除分组?',
    alachuli: '是否确定报警以处理?',
    newtitle: '提示',
    oldin: '请输入旧密码',
    newin: '请输入新密码',
    newagin: '请再次输入新密码',
    long: '最低长度为3',
    namelong: '用户名最低长度为3',
    pawlong: '密码最低长度为6',
    geshi: '用户名只能是3至15的数字字母或下划线',
    geshi2: '密码只能是6至15的数字字母或下划线',
    fanwei: '范围1~65536分钟',
    errordata: '数据超出30s~86400s范围',
    fanwei2: '范围0~100',
    fanwei3: '范围40~180',
    errordata2: '数据超出0~100范围',
    chongfu: '分组名称已存在',
    alaedit: '处理成功',
    modelerror:'设备型号不能为空',
    fanwei4:'范围>0',
    fanwei5:'范围1~179',
    fanwei6:'范围0~255',
    fanwei7:'范围1~255',
    fanwei8:'范围0~79',
    canshu:'参数不能为空',
    selectGuanLian:'请选择需要取消关联的设备',
    cancelGuanLian:'是否取消关联?',
    guid15:'请输入11~15位数字',
    devicename:'请输入设备名称',
    area:'请选择地区',
    checkmsg:'请补全信息',
    weilanpath:'围栏半径需大于0',
    selGuanLian:'请选择需要关联的设备',
    grouperror:'设备分组不能为空'
  }
}
