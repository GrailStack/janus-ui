<template>
    <div class="apiManegePage page">
        <div class="pageHead">
            <el-form class="shearchForm" :inline="true" size="small" label-width="120px">
                <el-form-item label="搜索:">
                    <el-input type="text" auto-complete="off" placeholder="请输入关键字"
                              v-model="formData.searchKey"></el-input>
                </el-form-item>
                <el-select v-model="formData.clusterCode" placeholder="请输入集群编码" size="small" >
                    <el-option  v-for="item in metaConfig.used_cluster"
                                :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
                <el-form-item style="margin-left: 35px">
                    <el-button size="small" @click="handleClickSearch">查询</el-button>
                    <el-button class="resetBtn" size="small" @click="handleClickReset">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="bg-empty"></div>
        <div class="section-content">
            <div class="button-bar">
                <el-radio-group v-model="isDraft" size="mini" style="margin-left: 20px" @change="switchModel">
                    <el-radio-button :label="false">正式</el-radio-button>
                    <el-radio-button :label="true">待下发</el-radio-button>
                </el-radio-group>
                <div style="position: absolute;right: 0;top:7px">
                    <el-button class="refresh-btn" :loading="loadingRefresh" @click="search" size="small" icon="el-icon-refresh">{{loadingRefresh?'加载中':'刷新'}}</el-button>
                    <el-button class="addBtn" type="success" size="small" @click="handleClickAddNew">新建API</el-button>
                    <el-button v-if="isDraft" class="addBtn" type="success" size="small" @click="handleClickSubmit">提交变更</el-button>
                </div>
            </div>

            <Table :metaConfig="metaConfig" :tableData="tabelData" :isDraft="isDraft"></Table>
            <TablePager :pagerData="pagerData" @pageChange="onPagerChange"/>

            <SelectClusterDialog ref="selectClusterDialog"/>
        </div>
    </div>
</template>

<script>

    import {createPagerData, TablePager} from "../../../common/components/tabelPager/TablePager";
    import Table from "./component/Table";
    import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";
    import Viewer from "../api-create/APIViewDialog";
    import SelectClusterDialog from "./component/SelectClusterDialog";
    import MetaConfigMixin from "../../../system/views/metaData/MetaConfigMixin";
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";
    import {UserClusterService} from "./service";

    const emptyForm = {
        searchKey: "",
        clusterCode: '',
    }
    export default {
        name: 'apiManegePage',
        components: {SelectClusterDialog, Table, TablePager, Viewer},
        mixins: [MetaConfigMixin],
        data() {
            return {
                metaConfig: {
                    api_release_status: [],
                    api_operate_type: [],
                    api_draft_status: [],
                    used_cluster:[],
                },
                isDraft: false,//是否草稿
                loadingRefresh: false,
                formData: {...emptyForm},
                pagerData: createPagerData(),
                tabelData: [],
            }
        },
        computed: {},
        async mounted() {
            await this.loadConfig()
            let {query} = this.$route
            this.isDraft = query.isDraft === "true"
            this.handleClickSearch()
        },
        methods: {
            async loadConfig() {
                let keys = Object.keys(this.metaConfig)
                let config = await MetaUtils.loadOptions(keys)
                MetaUtils.transformOptionsFrom(config, keys)
                config.used_cluster = await UserClusterService.getUserCluster()
                this.metaConfig = config
            },
            //==============================
            handleClickReset() {
                this.formData = {...emptyForm}
            },
            handleClickSearch() {
                this.pagerData.page = 1
                this.search()
            },
            onPagerChange(page) {
                this.pagerData = Object.assign(this.pagerData, page)
                this.search()
            },
            switchModel() {
                setTimeout(() => {
                    this.handleClickSearch()
                }, 100)
            },
            search() {
                this.loadingRefresh = true
                let params = {
                    ...deleteUndefinedParams(this.formData),
                    pageNo: this.pagerData.page,
                    pageSize: this.pagerData.size
                }
                let url = this.isDraft ? '/admin/api/pageQueryDraft' : '/admin/api/pageQuery'
                this.$axios.post(url, params).then(data => {
                    if (data) {
                        this.pagerData.total = data.totalCount;
                        this.tabelData = data.list;
                    }
                }).finally(() => {
                    this.loadingRefresh = false
                })
            },
            //=============
            handleClickAddNew() {
                this.$router.push(`/myGate/APICreate`)
            },
            handleClickSubmit() {
                this.$refs.selectClusterDialog.visible = true
            }
        }
    }
</script>

<style lang="less" scoped>
    .apiManegePage {


        .pageHead {
            padding: 8px 18px;
            line-height: 35px;
        }

        .section-content {
            padding: 15px;

            .button-bar {
                margin-bottom: 15px;
                position: relative;
            }

        }


        .tabelType {
            padding: 0 30px;
            margin-bottom: 15px;
        }

    }
</style>
<style lang="less">
    @radio-color: #ff6a00;

    .apiManegePage {
        .el-radio-button__inner:hover {
            color: @radio-color;
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: @radio-color;
            border-color: @radio-color;
            box-shadow: -1px 0 0 0 @radio-color;
        }
    }
</style>