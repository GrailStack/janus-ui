<template>
    <div class="changeApprovePage page">
        <div class="pageHead">
            <el-form class="shearchForm" :inline="true" size="small" label-width="120px">
                <el-form-item label="搜索:">
                    <el-input type="text" auto-complete="off" placeholder="请输入关键字"
                              v-model="formData.searchKey"></el-input>
                </el-form-item>
                <el-form-item label="集群编码:">
                    <el-select v-model="formData.clusterCode" placeholder="请输入集群编码" size="small" >
                        <el-option  v-for="item in metaConfig.used_cluster"
                                    :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 35px">
                    <el-button size="small" @click="handleClickSearch">查询</el-button>
                    <el-button class="resetBtn" size="small" @click="handleClickReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="bg-empty"></div>
        <div style="margin: 15px">
            <Table :tableData="tableData" :metaConfig="metaConfig"/>
            <TablePager :pagerData="pagerData" @pageChange="onPagerChange"/>
        </div>
    </div>

</template>

<script>
    import Table from "./component/Table";
    import {createPagerData, TablePager} from "../../../common/components/tabelPager/TablePager";
    import {deleteUndefinedParams} from "../../../common/utils/paramsUtils";
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";
    import {UserClusterService} from "../../../my-gate/views/api-manage/service";

    const createEmptyForm = () => ({
        searchKey: '',
        clusterCode: ''
    })
    export default {
        name: "index",
        components: {
            Table, TablePager
        },
        data() {
            return {
                formData: createEmptyForm(),
                metaConfig: {
                    change_apply_status: [],
                    used_cluster: []
                },
                tableData: [],
                pagerData: createPagerData(),
            }
        },
        async mounted() {
            await this.loadConfig()
            await this.search()
        },
        methods: {
            // $parent调用
            async loadConfig() {
                let key = Object.keys(this.metaConfig)
                let config = await MetaUtils.loadOptions(key)
                MetaUtils.transformOptionsFrom(config, key)
                config.used_cluster = await UserClusterService.getUserCluster()
                this.metaConfig = config
            },
            handleClickSearch() {
                this.pagerData.page = 1
                this.search()
            },
            handleClickReset() {
                this.formData = createEmptyForm()
            },
            onPagerChange(page) {
                this.pagerData = Object.assign(this.pagerData, page)
                this.search()
            },
            search() {
                let params = {
                    ...deleteUndefinedParams(this.formData),
                    pageNo: this.pagerData.page,
                    pageSize: this.pagerData.size
                }
                let url = '/admin/apply/page'
                this.$axios.get(url, {params: params}).then(data => {
                    if (data) {
                        this.pagerData.total = data.totalCount;
                        this.tableData = data.list;
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .pageHead {
        padding: 15px 0;
    }
</style>