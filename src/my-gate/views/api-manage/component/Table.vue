<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
            <el-table-column prop="id" label="ID" min-width="120" align="center"/>
            <el-table-column prop="name" label="API名称" min-width="120" align="center"/>
            <el-table-column prop="path" label="路径" min-width="120" align="center"/>
            <el-table-column prop="method" label="Method" min-width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.method }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="clusterName" label="集群" min-width="120" align="center"/>
            <el-table-column prop="createUser" label="创建人" min-width="120" align="center"/>
            <el-table-column prop="status" label="状态" min-width="120" align="center">
                <template slot-scope="scope">
                    <span v-if="!isDraft ">{{ optValueToLabelOf('api_release_status',scope.row.status) }}</span>
                    <span v-if="isDraft ">{{ optValueToLabelOf('api_draft_status',scope.row.status) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="操作类型" min-width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ optValueToLabelOf('api_operate_type',isDraft?scope.row.operateType:scope.row.lockType) }}</span>
                </template>
            </el-table-column>


            <!--<el-table-column label="配置项" min-width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ optValueToLabelOf('cluster_config_keys',scope.row.configKey)}}</span>
                </template>
            </el-table-column>-->

            <el-table-column label="操作" fixed="right" width="420" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleClickView(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="handleClickEdit(scope.row)">编辑</el-button>
                    <!--<el-button v-if="isDraft" type="text" size="small" @click="handleClickRelease(scope.row)">下发</el-button>-->
                    <template v-if="!isDraft ">
                        <el-button v-if="showOnline(scope.row)" type="text" size="small" @click="handleClickOnline(true,scope.row)">上线</el-button>
                        <el-button v-if="!showOnline(scope.row)" type="text" size="small" @click="handleClickOnline(false,scope.row)">下线</el-button>
                    </template>
                    <el-button type="text" size="small" @click="handleFilter(scope.row)">关联Filter</el-button>
                    <el-button type="text" size="small" @click="handleClickDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Viewer ref="Viewer"/>
    </div>
</template>

<script>

    import Viewer from "../../api-create/APIViewDialog";
    import {MetaUtils} from "../../../../system/views/metaData/metaUtils";
    import MetaConfigMixin from "../../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "Table",
        mixins: [MetaConfigMixin],
        props: {
            isDraft: {
                type: Boolean,
                default: () => false
            },
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            tableData: {
                type: Array,
                default: () => [/*{
                    "clusterCode": "string",
                    "clusterName": "string",
                    "createTime": "2020-06-06T08:59:33.500Z",
                    "createUser": "string",
                    "createUserName": "string",
                    "id": 0,
                    "method": "string",
                    "name": "string",
                    "path": "string",
                    "protocol": "string",
                    "status": "string",
                    "statusDesc": "string",
                    "updateTime": "2020-06-06T08:59:33.500Z",
                    "updateUser": "string",
                    "updateUserName": "string"
                }*/]
            },
        },
        components: {
            Viewer
        },
        methods: {
            handleClickView({id}) {
                //this.$refs.Viewer.open(id, this.isDraft)
                this.$router.push(`/myGate/APIView?id=${id}&isDraft=${this.isDraft}`)
            },
            handleClickEdit({id}) {
                this.$router.push(`/myGate/APICreate?id=${id}&isDraft=${this.isDraft}&isEdit=true`)
            },
            handleClickDelete({id}) {
                let label = this.isDraft ? "是否删除该API草稿？" : "是否删除该API？操作后请移步至草稿箱提交审核！"
                this.$confirm(label, '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = this.isDraft ? "/admin/api/deleteDraft" : "/admin/api/delete"
                    this.$axios.post(url, {id}).then(data => {
                        this.$parent.search()
                    })
                })
            },
            //
            handleFilter({id}){
                this.$router.push(`/myGate/FilterBind/?id=${id}`)
            },
            showOnline(row) {
                return row.status !== 'ONLINE'
            },
            handleClickOnline(online, row) {
                let label = online ? "是否上线该API？操作后请移步至草稿箱提交审核！" : "是否下线该API？操作后请移步至草稿箱提交审核！"
                this.$confirm(label, '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = online ? "/admin/api/online" : "/admin/api/offline"
                    this.$axios.post(url, {id: row.id}).then(data => {
                        if (data) {
                            /// this.$message.success("操作成功")
                        }
                        this.$parent.search()
                    })
                })
            },

        }
    }
</script>

<style scoped>

</style>