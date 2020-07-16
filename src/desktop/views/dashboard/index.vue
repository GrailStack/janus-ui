<template>
    <div class="homePage page">
        <div class="row ">
            <div class="col">
                <div class="row ">
                    <div class="userBlock block">
                        <div class="user">
                            <img class="head" src="./img/logo-janus.png"/>
                            <div class="userName">{{userInfo.name}}</div>
                            <div class="email">{{userInfo.email}}</div>
                        </div>
                        <div class="loginInfo">
                            <div class="">
                                登录时间：{{userInfo.currentTime}}
                            </div>
                            <div class="">
                                版本：{{userInfo.version}}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row block">
                    <div class="alarmList ">
                        <div>监控告警</div>
                        <template v-if="alarms.length>0">
                            <div class="alarmListItem" v-for="item, index in alarms" :key="index">
                                • {{item.gmtCreate+"&nbsp;&nbsp;&nbsp;&nbsp;" +item.instanceHost}}
                                <div class="btn">查看</div>
                            </div>
                        </template>
                        <template v-else>
                            • 无
                        </template>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="row block numBlock">
                    <div class="numItem ">
                        <div class="left">
                            <img class="icon" src="./img/API3.svg"/>
                        </div>
                        <div class="right">
                            <div class="num">{{nums.countApi}}</div>
                            <div class="info">API数</div>
                        </div>
                    </div>

                    <div class="numItem ">
                        <div class="left">
                            <img class="icon" src="./img/jiqun.svg"/>
                        </div>
                        <div class="right">
                            <div class="num">{{nums.countCluster}}</div>
                            <div class="info">集群数</div>
                        </div>
                    </div>

                    <div class="numItem ">
                        <div class="left">
                            <img class="icon" src="./img/Instance.svg"/>
                        </div>
                        <div class="right">
                            <div class="num">{{nums.countInstance}}</div>
                            <div class="info">实例数</div>
                        </div>
                    </div>
                    <div class="numItem ">
                        <div class="left">
                            <img class="icon" src="./img/gaojing.svg"/>
                        </div>
                        <div class="right">
                            <div class="num">{{nums.countAlarm}}</div>
                            <div class="info">告警数</div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <div class="block" ref="chart1"></div>
                    </div>
                    <div class="col">
                        <div class="block" ref="chart2"></div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {EchartUtils} from "../../../my-gate/views/instance-monitor/echart";

    export default {
        name: "index",
        data() {
            return {
                userInfo: {
                    "currentTime": "",
                    "email": "",
                    "name": "",
                    "version": ""
                },
                nums: {
                    countAlarm: 0,
                    countApi: 0,
                    countCluster: 0,
                    countInstance: 0,
                },
                alarms: [],
                echart1: undefined, echart2: undefined,
            }

        },
        watch: {
            ['$store.state.frame.currentGatewayGroup']() {
                this.changeCluster()
            }
        },
        async mounted() {
            this.$axios.get('/admin/user/getUserInfo').then(data => {
                this.userInfo = data
            })

            this.$axios.get('/admin/influxDB/getAllNums').then(data => {
                this.nums = data
            })
            this.changeCluster()
        },
        methods: {
            changeCluster() {
                let selectedClusterCode = this.$store.state.frame.currentGatewayGroup.code
                if (selectedClusterCode) {
                    this.$axios.get('/admin/influxDB/searchQPS', {params: {clusterCode: selectedClusterCode}}).then(data => {
                        //趋势
                        this.invocationTrend(data)
                        //健康
                        this.apiHealth(data)
                    })
                    // 告警
                    this.$axios.get('/admin/alarm/page', {params: {clusterCode: selectedClusterCode, pageSize: 10, pageNo: 1}}).then(data => {
                        this.alarms = data.list || []
                    })
                }
            },
            //趋势
            invocationTrend: function (params) {
                EchartUtils.drawChart(this.$refs.chart1, '网关调用QPS ', params)
            },
            //健康
            apiHealth: function (params) {
                EchartUtils.drawChart(this.$refs.chart2, '网关健康状况 ', params)
            },


        }
    }
</script>

<style scoped lang="less">


    .row {
        display: flex;
        flex-direction: row;
        /* border: 1px solid green;
         padding: 1px;*/
        overflow: hidden;
    }


    .col {
        display: flex;
        flex-direction: column;
        /* border: 1px solid yellow;
         padding: 1px;*/
        overflow: hidden;
    }

    .rowMargin(@halfGap) {
        margin: @halfGap 0;

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    .colMargin(@halfGap) {
        margin: 0 @halfGap;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }
    }

    .flexMixin(@flexs) {
        each(@flexs, {
            &:nth-child(@{index}) {
                flex: 0px @value @value;
            }
        });
    }


    @background-color: #393e50;

    .homePage {
        background-color: transparent;
        padding: 0 5px;
        /*overflow-y: scroll;*/

        // 最上面的
        .row:nth-child(1) {
            height: 510px;

            .col {
                .colMargin(6px);
                @flexs: 1, 2.5;
                .flexMixin(@flexs);

                //左面的 上下两row
                &:first-child {
                    .row {
                        .rowMargin(5px);
                        @flexs: 0.8, 1;
                        .flexMixin(@flexs);
                    }

                }

                //右面的
                &:last-child {
                    .row {
                        .rowMargin(-21px);
                        @flexs: 0.8, 2;
                        .flexMixin(@flexs);

                        //两表格
                        &:last-child {
                            .col {
                                .colMargin(5px);
                                @flexs: 1, 1;
                                .flexMixin(@flexs);
                            }
                        }
                    }
                }
            }
        }


        .block {
            overflow: hidden;
            background: @background-color;
            width: 100%;
            height: 100%;
        }


        .userBlock {
            .user {
                position: relative;

                .head {
                    width: 100px;
                    height: 100px;
                    margin: 15px 35px 0 35px;
                    background-image: linear-gradient(-135deg, #ff6a00 0%, #ff6a00 100%);
                    border-radius: 100%;
                }

                .userName {
                    position: absolute;
                    left: 160px;
                    top: 40px;
                    font-size: 35px;
                }

                .email {
                    position: absolute;
                    left: 160px;
                    top: 90px;
                }
            }

            .loginInfo {
                border-top: 1px solid white;
                margin: 0 15px;
                padding-left: 25px;
                padding-top: 8px;
                line-height: 30px;
            }

        }


        .numBlock {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            background: transparent !important;

            .numItem {
                .colMargin(5px);
                @flexs: 1, 1, 1, 1;
                .flexMixin(@flexs);
                background: @background-color;
                position: relative;
                display: flex;
                flex-direction: row;
                height: 100px;

                .left {
                    width: 40%;
                    height: 100%;
                    //background: #6e7899;
                    border-right: #dfe0e2 2px solid;
                    background-image: linear-gradient(-135deg, #333d52 20%, #ff6a00 80%);
                    display: flex;
                    justify-items: center;

                    .icon {
                        width: 76%;
                        max-width: 65px;
                        margin: 0 auto;
                        display: block;
                    }
                }

                .right {
                    width: 60%;
                    height: 100%;
                    padding-top: 18px;
                    text-align: center;


                    .num {
                        font-size: 25px;
                        margin: 0 auto;
                        display: block;
                    }

                    .info {
                        font-size: 18px;
                        margin: 0 auto;
                        display: block;
                    }
                }


            }
        }

        .alarmList {
            margin: 12px auto;
            overflow-x: hidden;
            overflow-y: hidden;
            /*border: 1px solid red;*/
            line-height: 26px;
            width: 100%;
            padding: 0 35px;

            .alarmListItem {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                .btn {
                    display: inline-block;
                    margin: 0 0 auto 0;
                    padding: 0px 5px;
                    line-height: 18px;
                    position: relative;
                    top: 3px;
                    background: #FF6A00;
                    border-radius: 10px;
                    cursor: pointer;
                }
            }
        }


    }

</style>