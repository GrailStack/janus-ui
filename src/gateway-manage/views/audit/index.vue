<template>
    <div class="changeApprovePage page">
        <div class="pageHead">
            <el-form class="shearchForm" :inline="true" size="small" label-width="120px">
                <el-form-item label="用户名:">
                    <el-input type="text" auto-complete="off" placeholder="请输入用户名" v-model="formData.userName"/>
                </el-form-item>

                <el-form-item label="选择时间:">
                    <el-date-picker
                            v-model="formData.timerRange"
                            type="datetimerange"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

            </el-form>
            <div class="" style="margin-left: 35%;margin-bottom: 5px;">
                <el-button size="small" @click="handleClickSearch">查询</el-button>
                <el-button class="resetBtn" size="small" @click="handleClickReset">重置</el-button>
            </div>
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
        userName: '',
        timerRange: []
    })
    export default {
        name: "index",
        components: {
            Table, TablePager
        },
        data() {
            return {
                metaConfig: {xxx: []},
                formData: createEmptyForm(),
                tableData: [{}, {}],
                pagerData: createPagerData(),
            }
        },
        async mounted() {
            await this.loadConfig()
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

                if (params.timerRange.length) {
                    params.startTime = this.formData.timerRange[0]
                    params.endTime = this.formData.timerRange[1]
                    delete params.timerRange
                }
                let url = '/admin/auditLog/page'
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