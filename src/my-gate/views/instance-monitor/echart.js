import Echart from 'echarts'

export const EchartUtils = {
    clearChart(el) {
        if (el && el.chart) {
            el.chart.clear()
        }
    },
    /*    drawCircle(el, title, params) {
            let option = {
                title: [{
                    left: '10px',
                    top: '10px',
                    text: title,
                    textStyle: {
                        fontWeight: '600',
                        fontSize: 15,
                        color: '#fff'
                    }
                }],
                tooltip: {
                    formatter: '%%%'
                },
                series: [
                    {
                        name: title,
                        type: 'gauge',
                        detail: {formatter: '{value}', color: '#ffffff', fontSize: 25, offsetCenter: [0, "80%"]},//数字
                        data: [{value: 50,}],
                        pointer: {length: '60%', width: 5},
                        itemStyle: {color: '#ff6a00'},//指针颜色
                        axisLine: {lineStyle: {shadowBlur: 2, width: 15}},//
                        // axisLine: {lineStyle: {shadowBlur: 2, color: [[0.3, '#585f77'], [0.8, '#63869e'], [1, '#c23531']]}},
                        splitLine: {show: true, length : 25},
                        axisTick: {show: true},//是否刻度
                        axisLabel: {show: true, color: '#63869e', fontSize: 11}, //刻度字
                    }
                ],
            };

            let myChart = Echart.init(el)
            option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
            myChart.setOption(option, true);
        },*/


    drawCircle(el, title, current, max) {
        EchartUtils.clearChart(el)
        let myChart = Echart.init(el)
        myChart.setOption({
            title: {
                text: title + ":" + current,
                //subtext: '数据指标:', // 子标题
                x: 'center',
                bottom: 50,
                textStyle: {
                    fontWeight: 'normal',
                    color: '#fff',
                    fontSize: '20'
                },
                subtextStyle: {
                    fontWeight: 'normal',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14'
                }
            },
            tooltip: {
                formatter: "{c}"
            },
            series: [
                {
                    name: title,
                    type: 'gauge',
                    max: max, // 最大刻度--------
                    splitNumber: 10, // 刻度数量
                    // radius: '80%',
                    title: { // tilte隐藏
                        show: false
                    },
                    splitLine: { // 分隔线
                        length: 15, // 属性length控制线长
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: { // 指针
                        width: 2,
                        shadowColor: '#fff', // 默认透明
                        shadowBlur: 5
                    },
                    axisTick: { // 坐标轴小标记
                        show: false,
                        length: 10, // 属性length控制线长
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: 'auto',
                            shadowColor: '#fff', //默认透明
                            shadowBlur: 10
                        }
                    },
                    detail: {
                        show: false,
                        // 数据详情显示
                        fontSize: '12',
                        textStyle: { // 其余属性默认使用全局文本样式
                            color: '#fff'
                        },
                        offsetCenter: [0, '90%'],
                        formatter: [
                            '已用{value} ',
                            '总数：' + name
                        ].join('\n')
                    },
                    axisLabel: {
                        color: 'auto',
                        distance: 1
                    },
                    axisLine: { // 坐标轴线
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: [[0.5, '#3DBDCB'], [0.8, '#FFB12A'], [1, '#FF7281']],
                            width: 6,
                            // shadowColor : '#fff', //默认透明
                            // shadowBlur: 10
                        }
                    },
                    data: [{name: '', value: current}] // 使用---------
                }
            ]
        })
    },

    drawChart(el, title, params, isArea = false) {
        EchartUtils.clearChart(el)
        //
        let paramsKeys = Object.keys(params) || []
        if (paramsKeys.length === 0) {
            return
        }
        // 防止null null>[]
        paramsKeys.forEach(key => params[key] = (params[key] || []))
        //
        if (params.total) {
            paramsKeys.splice(paramsKeys.indexOf('total'), 1)
            paramsKeys.unshift('total')
        }
        ///
        let myChart = Echart.init(el)
        let colorList = ['#FFB029', '#946CFF', '#F26186', '#E91E63', '#2196F3', '#0AA194']
        let seriesList = []
        let legendData = []
        paramsKeys.forEach((ele, index) => {
            let title = ele === 'total' ? '总量' : ele
            legendData.push(title)
            let list = []
            params[ele].forEach(function (val) {
                //let timer = new Date(val.key).getTime();
                //console.log(val.key, timer)
                list.push([val.key, val.value])
            })
            seriesList.push({
                name: title,
                type: 'line',
                smooth: true, // 是否平滑曲线显示
                showSymbol: true,
                symbolSize: 1, // 数据点的大小，[0,0]//b表示宽度和高度
                itemStyle: {
                    normal: {
                        // color: 'rgba(255,139,119, 0.9)'
                        color: colorList[index] || '#946CFF'
                    }
                },
                areaStyle: isArea ? {} : undefined,
                data: list
            })
        })
        myChart.setOption({
            legend: { //图例
                // top: '10px',
                // right: '10px',
                // backgroundColor: 'rgba(128, 128, 128, 0.2)',
                data: legendData,
                // left: 'right', // 像右对齐
                // orient: 'vertical',
                textStyle: {
                    color: '#ffffff'
                },
                bottom: '10px',
                icon: 'circle',
                itemWidth: 12, // 设置宽度
                itemHeight: 10 // 设置高度
            },
            title: [{
                left: '10px',
                top: '10px',
                text: title,
                textStyle: {
                    fontWeight: '600',
                    fontSize: 15,
                    color: '#fff'
                }
            }],
            tooltip: {
                trigger: 'axis', // 触发类型。[ default: 'item' ] :数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用;'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用
                axisPointer: {
                    lineStyle: {
                        color: '#57617B'
                    }
                },
                formatter: function (params) {
                    var relVal = params[0].name
                    for (var i = 0, l = params.length; i < l; i++) {
                        relVal += '<br/>' + ((params[i].seriesName === 'total' ? '总量' : params[i].seriesName) + ':' + params[i].value)
                    }
                    return relVal
                }
            },
            xAxis: [{
                type: 'category',
                ///data: dateList,
                boundaryGap: true,
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#6C7B8A' //坐标轴线线的颜色
                    }
                },
                axisLabel: {
                    // margin: 10, // 刻度标签与轴线之间的距离
                    textStyle: {
                        color: '#6C7B8A',
                        fontSize: 10 // 文字的字体大小
                    },
                    margin: 15,
                    align: 'center',
                    formatter: function (value, index) {
                        return value.split(' ')[0] + '\n' + value.split(' ')[1]
                    }
                }
            }],
            yAxis: [{
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#718190' //坐标轴线线的颜色
                    }
                },
                axisTick: {
                    show: false,//是否显示坐标轴刻度
                },
                axisLabel: {
                    margin: 10, //刻度标签与轴线之间的距离
                    textStyle: {
                        color: '#BDCADB',
                        fontSize: 10 //文字的字体大小
                    }
                },
                splitLine: {
                    show: true, //分割线
                    lineStyle: {
                        color: '#56616f' //分隔线颜色设置
                    }
                }
            }],
            grid: [{
                bottom: '80px',
                right: '20px',
                top: '50px',
                left: '45px'
            }],
            series: seriesList
        })
        return myChart
    },


    drawAreaChart(el, title, params) {
        return this.drawChart(el, title, params, true)
    },
}

