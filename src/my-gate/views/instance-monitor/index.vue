<template>
    <div class="page paddingPage instanceMonitorPage">
        <div class="pagehead">
            <div class="headTitle">实例监控
                <el-button class="backbtn" @click="back" size="mini">返 回</el-button>
            </div>
            <div class="content">当前实例:{{info.host}} 集群：{{info.clusterName}}</div>
        </div>
        <div class="box">
            <el-tabs v-model="selectedIndex" class="tab" @tab-click="onChangeTab">
                <el-tab-pane v-for="item in tab" :key="item" :label="item" :name="item"/>
            </el-tabs>

            <div class="charts" v-if="selectedIndex!=='系统'" :key="1">
                <el-row>
                    <el-col :span="12">
                        <div ref="monitorChart0"></div>
                    </el-col>
                    <el-col :span="12">
                        <div ref="monitorChart1"></div>
                    </el-col>
                </el-row>
                <!--<el-row>
                    <el-col :span="12">
                        <div ref="monitorChart2"></div>
                    </el-col>
                    <el-col :span="12">
                        <div ref="monitorChart3"></div>
                    </el-col>
                </el-row>-->
            </div>

            <div class="charts2" v-if="selectedIndex==='系统'" :key="2">
                <el-row>
                    <el-col :span="6">
                        <div ref="monitorChart0"></div>
                    </el-col>
                    <el-col :span="6">
                        <div ref="monitorChart1"></div>
                    </el-col>
                    <!--<el-col :span="6">
                        <div ref="monitorChart2"></div>
                    </el-col>
                    <el-col :span="6">
                        <div ref="monitorChart3"></div>
                    </el-col>-->
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {EchartUtils} from "./echart";

    export default {
        name: "InstanceMonitor",
        data() {
            return {
                selectedIndex: '',
                tab: ['探测', '内存', 'GC', "系统"],
                info: {
                    clusterName: 'clusterName',
                    host: 'host',
                    config: [],
                }
            }
        },
        mounted() {
            Object.assign(this.info, this.$route.query)
            this.selectedIndex = this.tab[0]
            this.onChangeTab()
        },
        methods: {
            back() {
                this.$router.back()
            },
            onChangeTab() {
                if (this.selectedIndex === '探测') {
                    this.refresh1()
                } else if (this.selectedIndex === '内存') {
                    this.refresh2()
                } else if (this.selectedIndex === '系统') {
                    this.refresh4()
                }
            },
            async refresh1() {
                let {clusterCode, host} = this.info;
                let config = [
                    ['路由变化曲线', '/admin/influxDB/searchRouteCount'],
                    ['请求总数和Error数', '/admin/influxDB/searchRequestError'],
                    //['假数据', '/admin/influxDB/searchQPS',],
                    //['假数据', '/admin/influxDB/searchQPS',]
                ]
                config.forEach(async (configItem, index) => {
                    let params = await this.$axios.get(configItem[1], {params: {clusterCode: clusterCode, host: host}})
                    if (params.list) {
                        params.total = params.list
                        delete params.list
                    }
                    let ref = 'monitorChart' + index
                    let el = this.$refs[ref]
                    if (el) {
                        el.chart = EchartUtils.drawChart(el, configItem[0], params)
                    }
                })
            },

            async refresh2() {
                let {clusterCode, host} = this.info;
                let config = [
                    ['JVM Heap', async () => await this.$axios.get('/admin/influxDB/searchJvmHeapInfo',
                        {params: {clusterCode: clusterCode, host: host, area: "heap"}}
                    )],
                    ['JVM Non-Heap', async () => await this.$axios.get('/admin/influxDB/searchJvmHeapInfo',
                        {params: {clusterCode: clusterCode, host: host, area: "nonheap"}}
                    )],
                    //['假数据', '/admin/influxDB/searchQPS',],
                    //['假数据', '/admin/influxDB/searchQPS',]
                ]
                config.forEach(async (configItem, index) => {
                    let params = await configItem[1]()
                    if (params.list) {
                        params.total = params.list
                        delete params.list
                    }
                    let ref = 'monitorChart' + index
                    let el = this.$refs[ref]
                    if (el) {
                        el.chart = EchartUtils.drawAreaChart(el, configItem[0], params)
                    }
                })
            },


            //================================
            async refresh4() {
                [
                    [this.loadDiskFree,],
                    [this.loadJvmMemory]
                ].forEach(async (configItem, index) => {

                    let fn = configItem[0]
                    console.log(index, fn)
                    let params = await fn()

                    let ref = 'monitorChart' + index
                    let el = this.$refs[ref]
                    if (el) {
                        el.chart = EchartUtils.drawCircle(el, params.title, params.current, params.max)
                    }
                })
            },

            async loadDiskFree() {
                let {clusterCode, host} = this.info;
                let params = await this.$axios.get('/admin/influxDB/searchDiskFree', {params: {clusterCode: clusterCode, ip: host}})
                let current = params.diskFreeResult.value || 0
                let max = params.diskTotalResult.value || 0
                return {title: "Disk", current, max}
            },
            async loadJvmMemory() {
                let {clusterCode, host} = this.info;
                let params = await this.$axios.get('/admin/influxDB/searchJvmMemory', {params: {clusterCode: clusterCode, ip: host}})
                let current = params.memoryUsed.value || 0
                let max = params.memoryMax.value || 0
                return {title: "Memory", current, max}
            }
        }
    }
</script>

<style scoped lang="less">
    .instanceMonitorPage {
        .pagehead {

            .headTitle {
                background: #585f77;
                /* border: 1px solid gray;*/
                border-left: #FF6A04 3px solid;
                font-size: 16px;
                padding: 8px 18px;
                position: relative;

                .backbtn {
                    position: absolute;
                    right: 15px;
                    top: 6px;
                    padding: 5px 12px !important;
                    border: 1px solid white !important;
                    background: none !important;
                }
            }


            .content {
                color: #C1C5CF;
                padding-left: 15px;
                margin: 8px 0;
            }
        }

        .charts {
            .el-col {
                height: 350px;
                padding: 15px;

                & > div {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #787b83;
                }
            }
        }

        .charts2 {
            .el-col {
                height: 350px;
                padding: 15px;

                & > div {
                    width: 100%;
                    height: 100%;
                    border: 1px solid #787b83;
                }
            }
        }
    }
</style>

<style lang="less">
    @bar-active-color: #ff6a00; // 头bar选中色

    .instanceMonitorPage {

        .el-tabs {
            // tabs切换头部样式
            .el-tabs__header {
                margin: 0 0 25px;
                background: #292D40;
                // 头部下边框隐藏
                .el-tabs__nav-wrap::after {
                    z-index: -1;
                }

                .el-tabs__nav-scroll {
                    padding-left: 25px;
                }

                // tabs每一项
                .el-tabs__nav {
                    // 每一项字体颜色
                    .el-tabs__item {
                        color: #fff;
                        font-size: 15px;
                    }

                    // 选择tab字体样色
                    .el-tabs__item.is-active {
                        color: @bar-active-color;
                    }

                    // 选中边框颜色
                    .el-tabs__active-bar {
                        background-color: @bar-active-color;
                    }
                }
            }
        }

    }
</style>
