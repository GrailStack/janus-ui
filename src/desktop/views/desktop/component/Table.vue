<template>
    <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
        <el-table-column prop="name" label="name" min-width="120" align="center"/>
        <el-table-column label="集群编码" min-width="120" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.code }}</span>
            </template>
        </el-table-column>

        <el-table-column prop="ownerName" label="ownerName" width="100" align="center">
        </el-table-column>
        <el-table-column prop="instance" label="instance" width="100" align="center">
        </el-table-column>
        <el-table-column prop="alarm" label="alarm" width="100" align="center">
        </el-table-column>
        <el-table-column prop="change" label="change" width="100" align="center">
        </el-table-column>

        <el-table-column label="状态" width="80" align="center">
            <template slot-scope="scope">
                <span>{{optValueToLabelOf('cluster_status',scope.row.state)}}</span>
            </template>
        </el-table-column>
        <el-table-column label="共享" width="80" align="center">
            <template slot-scope="scope">
                <span>{{''+scope.row.isShare==="1"?"是":"否"}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="gmtCreate" label="创建时间" width="150" align="center">
        </el-table-column>
       <!-- <el-table-column label="操作" fixed="right" width="180" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleClickEdit(scope.row)">查看</el-button>
            </template>
        </el-table-column>-->
    </el-table>
</template>

<script>
    import MetaConfigMixin from "../../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "Table",
        mixins: [MetaConfigMixin],
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            tableData: {
                type: Array,
                default: () => []
            },
        },
        methods: {
        }
    }
</script>

<style scoped>

</style>