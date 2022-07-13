const mainEl=document.querySelector('#main');
const sixEl = document.querySelector("#six");
const countyEl = document.querySelector("#county");

const pm25HighSite = document.querySelector("#pm25_high_site");
const pm25HighValue = document.querySelector("#pm25_high_value");
const pm25LowSite = document.querySelector("#pm25_low_site");
const pm25LowValue = document.querySelector("#pm25_low_value");

let chart1 = echarts.init(sixEl);
let chart2 = echarts.init(mainEl);
let chart3 = echarts.init(countyEl);

document.querySelector('#county_btn').addEventListener('click',() => {
  let city=document.querySelector('#select_county').value;

  console.log(city);
  drawCityPM25(city);
})


$(document).ready(()=>{
drawPM25();


});

window.onresize = function () {
  chart1.resize();
  chart2.resize();
  chart3.resize();
};

function renderMaxPM25(data) {
  let result = data["result"];
  let statinName = data["stationName"];

  let maxIndex = result.indexOf(Math.max(...result));
  let minIndex = result.indexOf(Math.min(...result));

  pm25HighSite.innerText = statinName[maxIndex];
  pm25HighValue.innerText = result[maxIndex];
  pm25LowSite.innerText = statinName[minIndex];
  pm25LowValue.innerText = result[minIndex];

  console.log(maxIndex, minIndex);
}

function drawCityPM25(city) {
  chart3.showLoading();
  $.ajax({
    url: `/city-pm25/${city}`,
    type: "POST",
    dataType: "json",
    success: (data) => {
      chart3.hideLoading();
      drawChart3(data);
    },
    error: () => {
      chart3.hideLoading();
      alert(`讀取${city}數據錯誤!`);
    },
  });
}

function drawSixPM25() {
  chart1.showLoading();
  $.ajax({
    url: "/six-pm25-json",
    type: "POST",
    dataType: "json",
    success: (data) => {
      chart1.hideLoading();
      console.log(data);
      drawChart1(data);
    },
    error: () => {
      chart1.hideLoading();
      alert("讀取六都數據錯誤!");
    },
  });
}





 function drawPM25(){

  pm25HighSite.innerText = "更新中";
  pm25HighValue.innerText = "N/A";
  pm25LowSite.innerText = "更新中";
  pm25LowValue.innerText = "N/A";

  chart2.showLoading();   
  $.ajax(
         {
             url:'/pm25-json',
             type:'POST',
             dataType:'json',
             success:(data)=>{
               chart2.hideLoading();
                 console.log(data);

                 $("#date").text(data["date"]);
                drawChart2(data);
                renderMaxPM25(data);
                drawSixPM25();
                drawCityPM25("南投縣");
                // drawChart2(data);
             
             
              },error:()=>{
                chart2.hideLoading();
                    alert('讀取數據錯誤!');
                }

         }
     )
 }

 //  一般柱狀圖
 function drawChart1(data){
    //  let myChart = echarts.init(mainEl);

            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: 'PM2.5 數據圖'
                },
                toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'center',
            feature: {
                magicType: { show: true, type: ['line', 'bar', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {
            trigger: 'axis'
        },
                legend: {
                    data: ['PM2.5']
                },
                xAxis: {
                    data: data['citys'],
                    axisLabel: {fontSize: 20}
                },
                yAxis: {},
                series: [
                    {
                        name: 'PM2.5',
                        type: 'bar',
                        data: data['result']
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            chart1.setOption(option);
 }
 
//  縮放柱狀圖
 function drawChart2(data2){
     var chartDom = document.getElementById('main');
var myChart = echarts.init(chartDom);
var option;

// prettier-ignore
let dataAxis = data2['stationName'];
// prettier-ignore
let data = data2['result'];
let yMax = 500;
let dataShadow = [];
for (let i = 0; i < data.length; i++) {
  dataShadow.push(yMax);
}
option = {
  title: {
    text: '特性示例：渐变色 阴影 点击缩放',
    subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
  },
  xAxis: {
    data: dataAxis,
    axisLabel: {
      inside: true,
      color: '#FFB562',
      fontSize: 20
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    z: 10
  },
  yAxis: {
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      color: '#999'
    }
  },
  dataZoom: [
    {
      type: 'inside'
    }
  ],
  series: [
    {
      type: 'bar',
      showBackground: true,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#2378f7' },
            { offset: 0.7, color: '#2378f7' },
            { offset: 1, color: '#83bff6' }
          ])
        }
      },
      data: data
    }
  ]
};
// Enable data zoom when user click bar.
const zoomSize = 6;
myChart.on('click', function (params) {
  console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
  myChart.dispatchAction({
    type: 'dataZoom',
    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
    endValue:
      dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
  });
});
option &&chart2.setOption(option);
// option && myChart.setOption(option);
 }

 function drawChart3(data){
    //  let myChart = echarts.init(mainEl);

            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: 'PM2.5 數據圖'
                },
                toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'center',
            feature: {
                magicType: { show: true, type: ['line', 'bar', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {
            trigger: 'axis'
        },
                legend: {
                    data: ['PM2.5']
                },
                xAxis: {
                    data: data['stationName'],
                    axisLabel: {fontSize: 20}
                },
                yAxis: {},
                series: [
                    {
                       itemStyle: {color: "#D3CEDF",},
                        name: 'PM2.5',
                        type: 'bar',
                        data: data['result']
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            chart3.setOption(option);
 }
 
 
 
 
 
 