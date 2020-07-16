<template>
    <div class="cardList">
        <div class="cardListWrapper">
            <el-card :key="index" v-for="(item,index ) in listData" class="itemCard" @click.native="clickItem(item)">
                <div class="cardTitle">
                    <img class="icon" :src="iconImg(item.alarm)"/>
                    <div>{{item.name}}</div>
                    <div>{{item.code}}</div>
                    <el-rate v-model="item.stars" disabled text-color="#ff9900">
                    </el-rate>
                </div>
                <div class="properGrid">
                    <div class="pRow">
                        <div class="pCol">
                            <div>status</div>
                            <div>{{optValueToLabelOf('cluster_status',item.state)}}</div>
                        </div>
                        <div class="pCol">
                            <div>instance</div>
                            <div>{{item.instance}}</div>
                        </div>
                        <div class="pCol">
                            <div>owner</div>
                            <div>{{item.ownerName}}</div>
                        </div>
                    </div>
                    <div class="pRow">
                        <div class="pCol">
                            <div>alarm</div>
                            <div>{{item.alarm}}</div>
                        </div>
                        <div class="pCol">
                            <div>share</div>
                            <div>{{''+item.isShare==="1"?"是":"否"}}</div>
                        </div>
                        <div class="pCol">
                            <div>change</div>
                            <div>{{item.change}}</div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import MetaConfigMixin from "../../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "CardList",
        mixins: [MetaConfigMixin],
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            listData: {
                type: Array,
                default: () => []
            },
        },
        data() {
            return {
                // 自适应的
                gridResizeData: {
                    resizeInterval: -1,
                    gridWidth: 0,
                }
            }
        },
        mounted() {
            this.gridResizeData.resizeInterval = setInterval(this.gridResize.bind(this), 200)
        },
        destroyed() {
            clearInterval(this.gridResizeData.resizeInterval)
        },
        computed: {},
        methods: {
            clickItem(item) {
                this.$router.push(`/myGate/instance?clusterCode=${item.code}`)
            },
            gridResize() {
                let grid = document.getElementsByClassName('cardListWrapper')[0]
                if (grid) {
                    let gridWidth = grid.getBoundingClientRect().width
                    if (this.gridResizeData.gridWidth !== gridWidth) {
                        this.gridResizeData.gridWidth = gridWidth
                        let num = Math.floor(gridWidth / 304)
                        let left = (gridWidth % 304) / num / 2
                        console.log(gridWidth, num, left)
                        let item = Array.from(document.getElementsByClassName('itemCard') || []);
                        item.forEach(element => {
                            element.style['margin-left'] = element.style['margin-right'] = left + "px"
                        })
                    }
                }
            },
            iconImg(alarm) {
                if (alarm <= 0) {
                    return require('!!file-loader!./img/gatewayNormal.png')
                } else {
                    return require('!!file-loader!./img/gatewayAlarm.gif')
                }
            }
        }
    }
</script>

<style scoped lang="less">
    @card-bk-color: #292D40;
    @card-font-color: white;
    @card-border-color: #292D40;

    .cardList {
        min-height: 600px;

        .cardListWrapper {
            display: flex;
            width: 100%;
            flex-wrap: wrap;

            .itemCard {
                flex: none;
                flex-direction: row;
                margin: 0px 15px 30px 15px;
                cursor: pointer;

                width: 300px;
                height: 260px;
                border-radius: 12px;
                border: 1.5px solid @card-border-color;
                background-color: @card-bk-color;
                color: @card-font-color;

                .el-card__body {
                    padding: 10px;
                }

                .cardTitle {
                    height: 75px;
                    padding-left: 70px;
                    position: relative;

                    .icon {
                        width: 55px;
                        height: 55px;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                }

                @card-grid-border-color: #3c3f5e;

                .properGrid {
                    border-radius: 5px;
                    border: 0.1px solid @card-grid-border-color;

                    .pRow {
                        display: flex;

                        .pCol {
                            border: 0.1px solid @card-grid-border-color;
                            flex: none;
                            width: 86px;
                            height: 66px;
                            text-align: center;
                            line-height: 25px;
                            color: #eee;
                            padding: 5px 0;

                            div {
                                display: block;
                                width: 100%;
                                white-space: nowrap;
                                overflow: hidden;
                            }
                        }
                    }
                }
            }
        }
    }
</style>