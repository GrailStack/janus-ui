<template>
    <div class="changeApprovePage page">
        <div class="pageHead">
            <el-form class="shearchForm" :inline="true" size="small" label-width="120px">
                <el-form-item label="集群编码:">
                    <el-select v-model="formData.clusterCode" placeholder="请输入集群编码" size="small">
                        <el-option v-for="item in metaConfig.used_cluster"
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
        clusterCode: ''
    })
    export default {
        name: "index",
        components: {
            Table, TablePager
        },
        data() {
            return {
                metaConfig: {
                    used_cluster: [],
                    alarm_status: []
                },
                formData: createEmptyForm(),
                tableData: [],
                pagerData: createPagerData(),
            }
        },
        async mounted() {
            await this.loadConfig()
            this.formData.clusterCode = this.$route.query.clusterCode || ""
            await this.search()
        },
        methods: {
            //
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
                let url = '/admin/instance/page'
                this.$axios.get(url, {params}).then(data => {
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