<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
            <!--<el-table-column type="selection" width="70" align="center"/>-->
            <el-table-column prop="id" label="ID" width="80" align="center"/>
            <el-table-column prop="applyId" label="申请ID" min-width="120" align="center"/>
            <el-table-column prop="clusterName" label="集群" min-width="120" align="center"/>
            <el-table-column prop="creator" label="创建人" min-width="120" align="center"/>
            <el-table-column prop="gmtCreate" label="下发时间" min-width="160" align="center"/>
            <el-table-column prop="type" label="下发类型" min-width="160" align="center">
                <template slot-scope="scope">
                    <span>{{ optValueToLabelOf('publish_ReleaseTypeEnum', scope.row.type) }}</span>
                </template>
            </el-table-column>

            <el-table-column label="进度" min-width="120" align="center">
                <template slot-scope="scope">
                    <el-progress :percentage="scope.row.completionRate" color="#FF6A00"></el-progress>
                </template>
            </el-table-column>

            <!--<el-table-column prop="status" label="状态" min-width="120" align="center"/>-->
            <el-table-column prop="status" label="下发状态" min-width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ optValueToLabelOf('release_status', scope.row.status) }}</span>
                </template>
            </el-table-column>

            <!--<el-table-column label="操作" fixed="right" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleDetail(scope.row)">详情</el-button>
                    <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
                </template>
            </el-table-column>-->
        </el-table>
    </div>
</template>

<script>


    import {MetaUtils} from "../../../../system/views/metaData/metaUtils";

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
            async handleEdit({id}) {
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