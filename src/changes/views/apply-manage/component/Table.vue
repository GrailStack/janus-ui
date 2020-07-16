<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
            <!--<el-table-column type="selection" width="70" align="center"/>-->
            <el-table-column prop="id" label="ID" width="50" align="center"/>
            <el-table-column prop="clusterName" label="集群" min-width="120" align="center"/>
            <el-table-column prop="description" label="变更说明" min-width="120" align="center"/>
            <el-table-column label="变更内容" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button>
                    <!--<span>{{ scope.row.changes }}</span>-->
                </template>
            </el-table-column>
            <el-table-column prop="creator" label="创建人" min-width="120" align="center"/>
            <el-table-column prop="approver" label="审批人" min-width="120" align="center"/>
            <el-table-column prop="publisher" label="发布人" min-width="120" align="center"/>
            <el-table-column prop="status" label="状态" min-width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ optValueToLabelOf('change_apply_status', scope.row.status) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="申请时间" min-width="160" align="center"/>
            <el-table-column prop="gmtModified" label="更新时间" min-width="160" align="center"/>
            <el-table-column label="操作" fixed="right" width="310" align="center">
                <template slot-scope="scope">
                    <el-button :disabled="!needAudit(scope.row)" type="text" size="small" @click="handleAUDITED(scope.row)">通过</el-button>
                    <el-button :disabled="!needAudit(scope.row)" type="text" size="small" @click="handleREJECTED(scope.row)">驳回</el-button>
                    <el-button :disabled="!needAudit(scope.row)" type="text" size="small" @click="handleCANCELED(scope.row)">撤销</el-button>

                    <el-button :disabled="!needPulish(scope.row)" type="text" size="small" @click="handleRelease(scope.row)">下发</el-button>
                    <!--<el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>-->
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    import {ApplyStatusEnum} from "../data/data";
    import {MetaUtils} from "../../../../system/views/metaData/metaUtils";

    const form = {
        "approver": "string",
        "changes": "string",
        "clusterCode": "string",
        "creator": "string",
        "description": "string",
        "id": 0,
        "publisher": "string",
        "request": "string"
    }
    export default {
        name: "AuditTable",
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
                default: () => [form]
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
                this.$router.push(`/changes/submit?applyId=${id}&description=${description}`)
            },
            //删除审批
            async handleDelete({id}) {
                await this.$axios.post('/admin/apply/delete', {id})
                this.$message.success('操作成功')
                this.$parent.search();
            },
            // 是否需要审核
            needAudit(item) {
                return  (item.status === ApplyStatusEnum.WAIT_AUDIT)
            },
            needPulish(item) {
                return [ApplyStatusEnum.AUDITED,ApplyStatusEnum.RELEASING,ApplyStatusEnum.RELEASED].includes(item.status)
            },
            //通过
            handleAUDITED({id}) {
                this.change(id, ApplyStatusEnum.AUDITED)
            },
            //驳回
            handleREJECTED({id}) {
                this.change(id, ApplyStatusEnum.REJECTED)
            },
            //撤销
            handleCANCELED({id}) {
                this.change(id, ApplyStatusEnum.CANCELED)
            },
            //
            handleRelease({id}) {
                this.$router.push(`/changes/release/?id=${id}`)
            },


            //
            async change(id, action) {
                await this.$axios.post('/admin/apply/audit', {applyId: id, action: action})
                this.$message.success('操作成功')
                this.$parent.search();
            },
            // 根据config[key]里的options取出等于value的opt显示其label
            optValueToLabelOf(metaKey, value) {
                return MetaUtils.optValueToLabelOf(this.metaConfig[metaKey], value)
            },
        }
    }
</script>

<style scoped>

</style>