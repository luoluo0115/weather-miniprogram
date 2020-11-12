import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
import {
  getPosition,
  getWeaterInfo,
  getEveryHoursWeather,
  getWeekWeather,
  getAirQuality,
  getWeatherLive,
  getLifeStyle,
  getMinutely,
  getChineseCalendar,
  getDrivingRestriction
} from '../../utils/api'

var chart = null;
function initChart(canvas, width, height, dpr) {
    chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

 
    var option = {
      // Make gradient line here
      color: ["#9FE6B8", "#37A2DA", "#67E0E3"],
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
          show: true,
          feature: {
              // dataZoom: {
              //     yAxisIndex: 'none'
              // },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
          }
      },
      xAxis: [{
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五','周六','周日'],
          show: false
      }, {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五','周六','周日'],
          gridIndex: 1,
          show: false
      }],
      yAxis: [{
          type: 'value',
          axisLabel: {
              formatter: '{value} °C'
          },
          show: false,
          scale : true,
          splitLine: {
            lineStyle: {
              type: 'dashed',
              width:0.1
            }
          }
      }, {
          type: 'value',
          axisLabel: {
              formatter: '{value} °C'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              width:0.1
            }
          },
          gridIndex: 1,
          show: false
      }],
      grid: [{
        top: '0%'
      }, {
        bottom: '0%'
      }],
      series: [{
          type: 'line',
          smooth: true,
          data: [20,20,20,20,20,20,20],
         
          itemStyle : { normal: {label : {show: true}}}
      }, {
          type: 'line',
          smooth: true,
          data: [12,12,12,12,12,12,12],
         
          itemStyle : { normal: {label : {show: true}}}
      }],

    }
  chart.setOption(option);
  return chart;
}

Component({

  options: {
    addGlobalClass: true,
  },

  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    itemIndex: String,
    itemStyle: Object,
    params: Object,
    
  },
    /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    data:'',
    weatherData: '',
    markers: [], 
    latitude:'',
    longitude:'' , 
    rgcData: {} ,
    location:'shanghai',
    weather:'',
    LocationName:'',
    Weathertext:'',
    Temperature:'',
    Weathercode:0,
    hourly:'',
    precipitation:'',
    quality:'',
    suggestion:'',
    flu:'',
    comfort:'',
    dressing:'',
    mood:'',
    makeup:'',
    sunscreen:'',
    daily:'',
    pm10:'',
    pm25:'',
    lunar_month_name:'',
    lunar_day_name:'',
    ganzhi_year:'',
    zodiac:'',
    ganzhi_month:'',
    ganzhi_day:'',
    ec: {
      //onInit:initChart
    },
    plates:'',
    memo:'',
    restriction:'',
  },
  lifetimes: {
    // 在组件完全初始化完毕、进入页面节点树后
    attached() {
     
      //this.getPosition()
    },
    ready(){
      this.getPosition()
    }
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      //this.getPosition()
      console.log(7788999)
    },
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    
    updateLocation: function(res) {
      console.log(res,'resupdateLocation')
      let _this = this;
      let {
        latitude: x,
        longitude: y,
        name
      } = res;
      let data = {
        location: {
          x,
          y,
          name: name || 'shanghai'
        },
      };
      _this.getLocation(x, y, name);
    },
    //获取定位
    getLocation: function(lat, lon) {
      let _this = this;
      wx.showLoading({
        title: "定位中",
        mask: true
      })
      getPosition(lat, lon, (res) => {
        console.log(res,'定位中')
        if (res.statusCode == 200) {
          wx.hideLoading()
          _this.getData(lat, lon);
        }
      }, (err => {
        console.log(err)
        wx.hideLoading()
      }))
    },
    getPosition: function() {
      let _this = this;
      wx.getLocation({
        type: 'gcj02',
        success(res){
          console.log(res,'getPosition查询')
          _this.getLocation(res.latitude, res.longitude);
        },
        fail: err => {
          console.log(err)
        }
      })
    },
    getData: function(lat, lon) {
      console.log(lat,'getData-lat')
      console.log(lon,'getData-lon')
      wx.showLoading({
        title: '加载中',
      })
      Promise.all([this.getWeather(lat, lon),  this.getHourWeather(lat, lon),this.getAir(lat, lon)],this.getLife(lat, lon),this.getWeek(lat, lon),this.getCalendar(lat, lon),this.getDriving(lat, lon)).then(res => {
        wx.hideLoading();
        wx.stopPullDownRefresh()
      });
    },
    chooseLocation: function() {
        let _this = this;
        var isopenLoction;
        wx.getSetting({
          success: (res) => {
           console.log(res,'选择')
            isopenLoction = res.authSetting["scope.userLocation"]
            //console.log(isopenLoction,'isopenLoction')
            if (isopenLoction) {
              wx.chooseLocation({
                success: res => {
                  let {
                    latitude,
                    longitude
                  } = res
                  let {
                    x,
                    y
                  } = this.data.location
                  console.log(res,'reschooseLocation')
                   _this.getData(res.latitude,res.longitude);
                }
              })
            } else {
              wx.showToast({
                title: '检测到您没获得位置权限，请先开启哦',
                icon: "none",
                duration: 3000
              })
              setTimeout(function () {
                //打开设置
                wx.openSetting({
                  success: (res) => {
                    // console.log(res)
                    isOpenSetting = res.authSetting["scope.userLocation"]
                    _this.getLocation(res.latitude,res.longitude);
                    //this.getLocationAction()
                  }
                })
              }, 3000)
            }
          }
        })
    },
   
    //获取天气实况
    getWeather: function(lat, lon, name){
      let _this = this;
      if (!lat || !lon) {
        return
      }
        getWeaterInfo(lat, lon, (res) => {
          console.log(res,'天气实况')
          _this.setData({
              weather:res.data.results[0],
              LocationName:res.data.results[0].location.name,
              Weathertext:res.data.results[0].now.text,
              Weathercode:res.data.results[0].now.code,
              Temperature:res.data.results[0].now.temperature+ "℃",
              pressure:res.data.results[0].now.pressure,
              humidity:res.data.results[0].now.humidity,
              wind_direction:res.data.results[0].now.wind_direction,
              wind_scale:res.data.results[0].now.wind_scale,
              last_update:res.data.results[0].last_update.substring(11,16)
            })
            console.log(_this.data.last_update,'last_update')
        }, (err => {
          console.log(err)
        }))
    },
    //获取节气
    getCalendar: function(lat, lon){
      let _this = this;
      if (!lat || !lon) {
        return
      }
        getChineseCalendar(lat, lon, (res) => {
          _this.setData({
              lunar_month_name:res.data.results.chinese_calendar[0].lunar_month_name,
              lunar_day_name:res.data.results.chinese_calendar[0].lunar_day_name,
              ganzhi_year:res.data.results.chinese_calendar[0].ganzhi_year,
              zodiac:res.data.results.chinese_calendar[0].zodiac,
              ganzhi_month:res.data.results.chinese_calendar[0].ganzhi_month,
              ganzhi_day:res.data.results.chinese_calendar[0].ganzhi_day
            })
           
        }, (err => {
          console.log(err)
        }))
    },
    //获取限号
    getDriving: function(lat, lon){
      let _this = this;
      if (!lat || !lon) {
        return
      }
      getDrivingRestriction(lat, lon, (res) => {
       
          if("{}" != JSON.stringify(res.data.results[0].restriction)){
            _this.setData({
              restriction:res.data.results[0].restriction,
              plates:res.data.results[0].restriction.limits[0].plates,
              memo:res.data.results[0].restriction.limits[0].memo,
              })
          }else{
            _this.setData({
              restriction:''
            })
            
          }
           
        }, (err => {
          console.log(err)
        }))
    },
    //获取24小时天气
    getHourWeather: function(lat, lon, name){
      let _this = this;
      if (!lat || !lon) {
        return
      }
      
      getEveryHoursWeather(lat, lon, (res) => {
          console.log(res,'24小时天气')
          _this.setData({
            hourly:res.data.results[0].hourly,
            })
        }, (err => {
          console.log(err)
          _this.setData({
            hourly:''
            })
        }))
    },
   //降水量
    getMinutelyWeather: function(lat, lon, name){
      let _this = this;
      if (!lat || !lon) {
        return
      }
    
      getMinutely(lat, lon, (res) => {
          console.log(res,'降水量')
          _this.setData({
            precipitation:res.data.results[0].precipitation,
            })
        }, (err => {
          console.log(err)
          _this.setData({
            precipitation:''
            })
        }))
    },
    //空气质量
    getAir: function(lat, lon, name){
      let _this = this;
      if (!lat || !lon) {
        return
      }
      getAirQuality(lat, lon, (res) => {
          console.log(res,'空气质量')
          _this.setData({
            quality:res.data.results[0].air.city.quality,
            pm25:res.data.results[0].air.city.pm25,
            pm10:res.data.results[0].air.city.pm10
            })
        }, (err => {
          console.log(err)
          _this.setData({
            quality:'',
            pm10:'',
            pm25:''
            })
        }))
    },
    //生活指数
    getLife: function(lat, lon, name){
      let _this = this;
      if (!lat || !lon) {
        return
      }
      
      getLifeStyle(lat, lon, (res) => {
          console.log(res,'生活指数')
          _this.setData({
            flu:res.data.results[0].suggestion.flu,
            comfort:res.data.results[0].suggestion.comfort,
            dressing:res.data.results[0].suggestion.dressing,
            mood:res.data.results[0].suggestion.mood,
            makeup:res.data.results[0].suggestion.makeup,
            sunscreen:res.data.results[0].suggestion.sunscreen,
            
            })
        }, (err => {
          console.log(err)
          _this.setData({
            flu:'',
            comfort:'',
            dressing:'',
            mood:'',
            makeup:'',
            sunscreen:'',
            })
        }))
    },
    
    //一周天气
    getWeek:function(lat, lon, name){
      let _this = this;
      if (!lat || !lon) {
        return
      }
      
      getWeekWeather(lat, lon, (res) => {
          console.log(res,'一周天气')
          _this.setData({
            daily:res.data.results[0].daily,
            })
            var highTempData=[];
            var lowTempData=[];
            for(var i in _this.data.daily){
              
              highTempData.push(_this.data.daily[i].high);
              lowTempData.push(_this.data.daily[i].low);
            }
            _this.setData({
              highTempData: highTempData,
              lowTempData: lowTempData,
               
              })
             
               console.log(chart,'chart')
              chart.setOption({
                grid: [{
                  top: '15%'
                }, {
                  bottom: '-5%'
                }],
                series: [{
                    type: 'line',
                    smooth: true,
                    data: highTempData,
                 
                    itemStyle : { normal: {label : {show: true}}}
                }, {
                    type: 'line',
                    smooth: true,
                    data: lowTempData,
                   
                    itemStyle : { normal: {label : {show: true}}}
                }],
               
              })
              //_this.echartInit(_this.data.postData);
             
        }, (err => {
          console.log(err)
          _this.setData({
            daily:'',
            
            })
        }))
    },
    echartInit (e) {
      console.log(e,'wwewe')
      let _this=this;
      
      initChart(e.detail.canvas, e.detail.width, e.detail.height,e.detail.dpr);
      
    },
  }

})