<template>
    <div class="desktopPage">
        <div class="pageHead">
            <el-form class="shearchForm" :inline="true" size="small" label-width="120px">
                <el-form-item label="搜索关键字:">
                    <el-input type="text" auto-complete="off" placeholder="请输入关键字"
                              v-model="formData.keyword"></el-input>
                </el-form-item>
            </el-form>
            <el-radio-group class="filterHead" v-model="formData.filter" size="mini">
                <el-radio-button label="me">我的集群</el-radio-button>
                <el-radio-button label="all">所有集群</el-radio-button>
            </el-radio-group>
            <el-button size="small" @click="handleClickSearch">查询</el-button>
        </div>
        <div class="tabelType">
            <el-radio-group v-model="modelType" size="mini">
                <el-radio-button label="grid"><i class="el-icon-menu"></i></el-radio-button>
                <el-radio-button label="tabel"><i class="el-icon-notebook-2"></i></el-radio-button>
            </el-radio-group>
        </div>
        <CardList v-loading="loading" v-if="modelType==='grid'" :listData="tabelData" :metaConfig="metaConfig"></CardList>
        <Table v-loading="loading" v-if="modelType==='tabel'" :tableData="tabelData" :metaConfig="metaConfig"></Table>
        <TablePager :pagerData="pagerData" @pageChange="onPagerChange"/>
    </div>
</template>

<script>

    import CardList from "./component/CardList";
    import {TablePager} from "../../../common/components/tabelPager/TablePager";
    import Table from "./component/Table";
    import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";
    import MetaConfigMixin from "../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: 'DeskTopPage',
        components: {Table, CardList, TablePager},
        mixins: [MetaConfigMixin],
        data() {
            return {

                metaConfig: {
                    cluster_status: []
                },
                modelType: "grid",//展示方式 "grid","tabel"
                loading: true,
                formData: {
                    keyword: "",
                    filter: 'all',//'me'/'all'
                },
                pagerData: {
                    page: 1, size: 8, total: 0, sizes: [8, 15, 20, 30, 50], layout: "total, prev, pager, next",
                },
                tabelData: [],
            }
        },
        async created() {
            this.loadConfig()
            this.handleClickSearch()
        },
        methods: {
            handleClickSearch() {
                this.pagerData.page = 1
                this.search()
            },
            onPagerChange(page) {
                this.pagerData = Object.assign(this.pagerData, page)
                this.search()
            },
            search() {
                this.loading = true
                let params = {
                    ...deleteUndefinedParams(this.formData),
                    pageNo: this.pagerData.page,
                    pageSize: this.pagerData.size
                }
                this.$axios({
                    url: '/admin/cluster/page',
                    method: 'get',
                    params: params,
                }).then(data => {
                    if (data) {
                        this.pagerData.total = data.totalCount;
                        this.tabelData = data.list;
                    }
                }).finally(() => {
                    this.loading = false
                })
            },
        }
    }
</script>

<style lang="less" scoped>
    .desktopPage {
        background: #393e50;
        position: absolute;
        left: 10px;
        right: 10px;
        top: 70px;
        bottom: 10px;
        padding: 0 13px 13px 13px;
        overflow-y: auto;
        transition: all .25s ease;
        @import '../../../common/styles/theme/simple/scroll';

        .pageHead {
            margin-top: 16px;
            line-height: 30px;

            .shearchForm {
                display: inline-block;
            }

            .filterHead {
                margin: 0 10px;

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

    .desktopPage {
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