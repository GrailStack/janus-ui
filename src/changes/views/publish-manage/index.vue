<template>
    <div class="changeApprovePage page">
        <div class="pageHead">
            <el-form class="shearchForm" :inline="true" size="small" label-width="120px">
                <el-form-item label="集群编码:">
                    <el-select v-model="formData.clusterCode" placeholder="请输入集群编码" size="small" >
                        <el-option  v-for="item in metaConfig.used_cluster"
                                    :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="集群编码:">

                </el-form-item>
                <el-form-item label="搜索创建人:">
                    <el-input type="text" auto-complete="off" placeholder="请输入创建人"
                              v-model="formData.creator"></el-input>
                </el-form-item>
                <el-form-item label="下发类型:">
                    <el-select v-model="formData.type" placeholder="请输入下发类型" size="small">
                        <el-option v-for="item in metaConfig.publish_ReleaseTypeEnum"
                                   :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
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
        type: '',
        creator: '',
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
                    publish_ReleaseTypeEnum: [],
                    release_status: []
                },
                formData: createEmptyForm(),
                tableData: [],
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
                let keys = Object.keys(this.metaConfig)
                let config = await MetaUtils.loadOptions(keys)
                MetaUtils.transformOptionsFrom(config, keys)
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
                let url = '/admin/publish/page'
                this.$axios.post(url, params).then(data => {
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