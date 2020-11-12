const mapKey = '2XRBZ-P4LK3-BGU3Q-YGSXQ-B3TXE-MWFEO'//腾讯地图 获取 KEY
const weatherKey = 'SUUrfM4HnaoF6Iph5'//需要注册账号获取心知天气 获取KEY
// map url
// map url
const locationUrl = 'https://apis.map.qq.com/ws/geocoder/v1/'
//天气url
const weatherUrl = 'https://api.seniverse.com/v3/weather/now.json'
//24小时内 每小时
const everyhoursUrl = 'https://api.seniverse.com/v3/weather/hourly.json'
// 一周内
const everyWeekUrl = 'https://api.seniverse.com/v3/weather/daily.json'
//空气质量
const airQualityUrl = 'https://api.seniverse.com/v3/air/now.json'
// 汽车限号
const drivingRestrictionUrl = 'https://api.seniverse.com/v3/life/driving_restriction.json'
// 生活指数
const lifeStyle = 'https://api.seniverse.com/v3/life/suggestion.json'
// 农历、节气、生肖
const chineseCalendarUrl = 'https://api.seniverse.com/v3/life/chinese_calendar.json'
// 气象灾害预警
const alarmStyleUrl = 'https://api.seniverse.com/v3/weather/alarm.json'
// 降水量
const minutelyUrl = 'https://api.seniverse.com/v3/weather/grid/minutely.json'


// 根据当前位置的坐标反得到当前位置的详细信息
export const getPosition = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: locationUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat},${lon}`,
      key: mapKey,
      get_poi: 0
    },
    success,
    fail
  })
}

// 根据location得到天气信息
export const getWeaterInfo = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: weatherUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      key: weatherKey,
      location: `${lat}:${lon}`,
      language: 'zh-Hans',
      unit: 'c'
    },
    success,
    fail
  })
}

// 根据location信息得到24小逐小时天气情况

export const getEveryHoursWeather = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: everyhoursUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat}:${lon}`,
      unit: 'c',
      key: weatherKey,
      language:'zh-Hans',
      start:'0',
      hours:'24'
    },
    success,
    fail
  })
}

// 根据location信息得到一周内天气情况
export const getWeekWeather = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: everyWeekUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat}:${lon}`,
      language	: 'zh-Hans',
      unit: 'c',
      key: weatherKey,
      start:'0',
      days:'7'
    },
    success,
    fail
  })
}

// 空气质量
export const getAirQuality = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: airQualityUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      key: weatherKey,
      location: `${lat}:${lon}`,
      language: 'zh-Hans',
    },
    success,
    fail
  })
}

// 汽车限号
export const getDrivingRestriction = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: drivingRestrictionUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat}:${lon}`,
      key: weatherKey
    },
    success,
    fail
  })
}

// 生活指数

export const getLifeStyle = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: lifeStyle,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat}:${lon}`,
      language: 'zh-Hans',
      key: weatherKey
    },
    success,
    fail
  })
}
  
  // 农历节气

export const getChineseCalendar = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: chineseCalendarUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      key: weatherKey,
      start:'0',
      days:'3'
    },
    success,
    fail
  })
}
// 气象灾害预警
export const getAlarmStyle = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: alarmStyleUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat}:${lon}`,
      key: weatherKey,
    },
    success,
    fail
  })
}
// 气象灾害预警
export const getMinutely = (lat, lon, success = {}, fail = {}) => {
  return wx.request({
    url: minutelyUrl,
    header: {
      'Content-Type': 'application/json'
    },
    data: {
      location: `${lat}:${lon}`,
      key: weatherKey,
    },
    success,
    fail
  })
  
}