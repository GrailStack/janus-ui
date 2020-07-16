<template>
    <div class="dispatch-system-default task-manage-list-page">
        <div class="section-container">
            <div class="section-header">
                <span class="select-item">Filter管理</span>
                <el-button class="refresh-btn btn-ml-auto" icon="el-icon-refresh" :loading="loadingRefresh"
                           @click="clickRefresh">{{loadingRefresh?'加载中':'刷新'}}
                </el-button>
                <el-button class="btn create-btn" @click="clickAddNew()">新建</el-button>
            </div>
            <div class="section-content" id="section-content">
                <el-tabs v-model="tabActiveName" @tab-click="clickTab">
                    <el-tab-pane v-for="(item, index) in filterTypeConfig" :label="item.label" :name="item.value"
                                 :key="index">
                    </el-tab-pane>
                </el-tabs>

                <CardList ref='cardlist' :metaConfig="metaConfig"
                          @edit="clickEdit"
                          :cardlist="cardlist" :selectedIndex="selectedIndex"
                />
                <Detail ref="detail" :metaConfig="metaConfig"
                        :detail="detail"></Detail>
            </div>
        </div>
        <EditorDialog ref="editDialog"></EditorDialog>
    </div>
</template>

<script>
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";
    import Vue from "vue";
    import CardList from "./component/CardList";
    import Detail from "./component/Detail";
    import EditorDialog from "./component/EditDialog";


    export default {
        name: 'GroupManageListPage',
        components: {EditorDialog, CardList, Detail},
        data() {
            return {
                tabActiveName: '',
                metaConfig: {
                    filter_type: [],
                    // filter_module_type: [],
                    filter_execute_place: [],
                    filter_status: []
                },
                cardlist: [
                    /*{
                        "classCode": "pre_in",
                        "classType": "fiter_classify_security",
                        "creator": "chenglong.ren",
                        "description": "描述",
                        "filterArgs": "test args",
                        "filterOrder": 0,
                        "gmtCreate": "2020-04-23 03:45:51",
                        "gmtModified": "2020-06-03 00:38:28",
                        "id": 1,
                        "isDeleted": 0,
                        "isGlobal": 0,
                        "isShare": 0,
                        "modifier": null,
                        "name": "filterName",
                        "status": "发布状态"
                    }*/
                ],
                //
                selectedIndex: 0,


                loadingRefresh: false,

            }
        },
        computed: {
            filterTypeConfig() {
                return this.metaConfig.filter_type || []
            },
            detail() {
                if (0 <= this.selectedIndex && this.selectedIndex < this.cardlist.length) {
                    return this.cardlist[this.selectedIndex]
                } else {
                    return {}
                }
            }
        },
        async mounted() {
            await this.loadTabConfig()
            // 初始化第一个Tab
            Vue.nextTick(() => {
                this.tabActiveName = this.filterTypeConfig[0].value
                this.refresh()
            })
        },
        methods: {
            async loadTabConfig() {
                let keys = Object.keys(this.metaConfig)
                let config = await MetaUtils.loadOptions(keys)
                MetaUtils.transformOptionsFrom(config, keys)
                this.metaConfig = config
            },

            async refresh() {
                let data = await this.$axios({
                        url: '/admin/filter/listFilters',
                        method: 'get',
                        params: {
                            pageNo: 1,
                            pageSize: 388,
                            classCode: this.tabActiveName
                        },
                    }
                )
                this.cardlist = data || []
                //
                Vue.nextTick(() => {
                    this.$refs.cardlist.reset()
                    this.selectedIndex = 0
                })
            },

            clickTab(tab) {
                let index = tab.index
                this.tabActiveName = this.filterTypeConfig[index].value
                this.refresh()
            },
            // 刷新按钮
            clickRefresh() {
                this.loadingRefresh = true
                this.refresh()
                setTimeout(() => {
                    this.loadingRefresh = false
                }, 2000)
            },

            clickAddNew() {
                this.$refs.editDialog.openEditDialog(undefined, this.metaConfig)
            },

            clickEdit() {
                setTimeout(() => {
                    this.$refs.editDialog.openEditDialog(this.detail, this.metaConfig)
                }, 100)
            }

        }
    }
</script>
<style lang="less" scoped>
    .task-manage-list-page {
        background:  #393e50;
        position: absolute;
        left: 10px;
        right: 10px;
        top: 70px;
        bottom: 10px;
        overflow-y: auto;
        transition: all .25s ease;
        @import '../../../common/styles/theme/simple/scroll';

        & > .section-container {
            width: 100%;
            height: 100%;

            .section-header {
                border-bottom-width: 0;

                .ml {
                    margin-left: 10px;
                }

                .button {
                    margin-left: auto;
                }

                .upload-demo {
                    margin-left: 10px;
                }
            }

            .section-content {
                overflow-y: auto;

                .el-tabs {

                }
            }
        }
    }
</style>
<style lang="less">
    @bar-active-color: #ff6a00; // 头bar选中色

    .task-manage-list-page {
        & > .section-container {
            & > .section-content {
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
        }
    }
</style>
