<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
            <el-table-column type="selection" width="70" align="center"/>
            <el-table-column prop="id" label="ID" width="80" align="center"/>
            <el-table-column prop="username" label="用户名" min-width="120" align="center"/>
            <el-table-column prop="method" label="方法" min-width="120" align="center"/>
            <el-table-column prop="url" label="url" min-width="120" align="center"/>
            <el-table-column prop="ip" label="ip" min-width="120" align="center"/>
            <el-table-column prop="startTime" label="开始时间" min-width="120" align="center"/>
            <el-table-column label="操作类型" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleDetail(scope.row)">新增</el-button>
                </template>
            </el-table-column>


            <el-table-column prop="params" label="入参" min-width="120" align="center"/>
            <el-table-column prop="dealResult" label="结果" min-width="120" align="center"/>

            <el-table-column prop="startTime" label="创建时间" min-width="120" align="center"/>

            <!-- <el-table-column prop="status" label="状态" min-width="120" align="center">
                 <template slot-scope="scope">
                     scope.row.status
                     &lt;!&ndash;<span>{{ optValueToLabelOf('release_status', scope.row.status) }}</span>&ndash;&gt;
                 </template>
             </el-table-column>-->

            <el-table-column label="操作" fixed="right" width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
                default: () => []
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
            async handleDelete({id}) {
                this.$axios.post('/admin/auditLog/delete', {ids: [id]}).then(res => {
                    this.$message.success('删除成功')
                    this.$parent.search()
                })
            },
        }
    }
</script>

<style scoped>

</style>