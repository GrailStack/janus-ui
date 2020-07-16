<template>
    <div>
        <el-table :data="tableData" border style="width: 100%" height="200" class="task-manage-table" @selection-change="changeSelected">
            <el-table-column v-if="!isReadOnly" type="selection" width="70" align="center"/>
            <el-table-column prop="id" label="ID" width="50" align="left"/>
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
                    <span>{{ optValueToLabelOf('api_draft_status',scope.row.status) }}</span>
                </template>
            </el-table-column>

            <!--<el-table-column label="配置项" min-width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ optValueToLabelOf('cluster_config_keys',scope.row.configKey)}}</span>
                </template>
            </el-table-column>-->

            <el-table-column label="操作" fixed="right" width="130" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="handleClickView(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <Viewer ref="Viewer"/>
    </div>
</template>

<script>

    import Viewer from "../../../../my-gate/views/api-create/APIViewDialog";
    import MetaConfigMixin from "../../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "Table",
        mixins: [MetaConfigMixin],
        props: {
            //编辑模式
            isReadOnly: {
                type: Boolean,
                default: () => false
            },
            // 是否草稿文件
            isDraft: {
                type: Boolean,
                default: () => false
            },
            tableData: {
                type: Array,
                default: () => []
            },
            metaConfig: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                seletedResourceId: []
            }
        },
        computed: {},
        components: {
            Viewer
        },
        methods: {
            handleClickView({id}) {
                this.$router.push(`/myGate/APIView?id=${id}&isDraft=${this.isDraft}`)
               // this.$refs.Viewer.open(id, this.isDraft)
            },
            changeSelected(val) {
                val = val || []
                this.seletedResourceId = val.map(i => i.resourceId)
                this.$emit('selectChange', 'API', JSON.parse(JSON.stringify(this.seletedResourceId)))
            },
            getSeletedSource() {
                return {
                    "resourceIdList": [...this.seletedResourceId],
                    "sourceCode": "API"
                }
            }
        }
    }
</script>

<style scoped>

</style>