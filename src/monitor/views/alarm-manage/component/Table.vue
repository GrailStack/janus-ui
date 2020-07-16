<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
            <!--<el-table-column type="selection" width="70" align="center"/>-->
            <el-table-column prop="id" label="ID" width="80" align="center"/>
            <el-table-column prop="clusterName" label="集群" min-width="120" align="center"/>
            <el-table-column prop="instanceHost" label="HOST" min-width="120" align="center"/>
            <el-table-column label="告警信息" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" min-width="120" align="center">
                <template slot-scope="scope">
                    {{scope.row.status}}
                    <!--<span>{{ optValueToLabelOf('release_status', scope.row.status) }}</span>-->
                </template>
            </el-table-column>

            <el-table-column label="操作" fixed="right" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">处理</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>


    import MetaConfigMixin from "../../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "AuditTable",
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
                default: () => [

                ]
            },
        },
        data() {
            return {}
        },
        computed: {},
        components: {},
        methods: {
            //详情
            handleDetail({id, description}) {

            },
            //删除审批
            async handleEdit({id}) {
            },
        }
    }
</script>

<style scoped>

</style>