<template>
    <div>
        <div class="headTitle">全量下发配置</div>
        <div style="padding: 15px">
            <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
                <!--<el-table-column type="selection" width="70" align="center"/>-->
                <el-table-column prop="id" label="id" width="50" align="left"/>
                <el-table-column prop="publishId" label="下发id" min-width="120" align="center"/>

                <el-table-column prop="creator" label="创建人" min-width="120" align="center"/>
                <el-table-column prop="ip" label="审批人" min-width="180" align="center"/>
                <el-table-column prop="status" label="状态" min-width="120" align="center"/>

                <el-table-column label="操作" fixed="right" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button :disabled="!showIgnore(scope.row)" type="text" size="small" @click="handleIgnore(scope.row)">忽略</el-button>
                        <el-button :disabled="!showRetry(scope.row)" type="text" size="small" @click="handleRetry(scope.row)">重试</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="text-align: center">
            <el-button type="primary" size="medium" @click="prev()">上一步</el-button>
            <el-button type="primary" size="medium" @click="submit()">全量下发</el-button>
            <el-button type="primary" size="medium" @click="next()">确认</el-button>
        </div>
    </div>
</template>

<script>
    import {OverPublishEnum, PublishTypeEnum} from "../../apply-manage/data/data";
    import {ShareData} from "./ShareData";

    export default {
        name: "Step3",
        data() {
            return {
                tableData: [
                    {
                        "creator": "string",
                        "gmtCreate": "2020-06-17T10:42:50.527Z",
                        "gmtModified": "2020-06-17T10:42:50.527Z",
                        "id": 0,
                        "ip": "string",
                        "modifier": "string",
                        "publishId": 0,
                        "status": "WAIT_PULL",
                        "type": "GRAY"
                    }
                ],
                publishId: '',
                refreshIntervalId: -1
            }
        },
        async mounted() {
            this.refreshStatus()
            this.refreshIntervalId = setInterval(this.refreshStatus, 1000 * 20)
        },
        destroyed() {
            clearInterval(this.refreshIntervalId)
        },
        methods: {
            prev() {
                if( ShareData.selectedType = PublishTypeEnum.GRAY){
                    this.$emit('prev', 1)
                }else{
                    this.$emit('prev', 0)
                }
            },
            async next() {
                //完成下发
                await this.$axios.post('/admin/publish/completePublish', {publishId: this.publishId})
                this.$message.success("操作成功")
                await this.refreshStatus()
                ///this.$emit('next', 2)
            },
            async refreshStatus() {
                let id = this.$route.query.id
                let data = await this.$axios.post('/admin/change/changeReleaseDetail', {applyId: id, type: PublishTypeEnum.FULL})
                this.publishId = data.publishId
                this.tableData = data.items || []
            },

            // 全量下发
            async submit() {
                await this.$axios.post('/admin/publish/fullPublishToServer', {publishId: this.publishId})
                this.$message.success("操作成功")
                await this.refreshStatus()
            },

            showIgnore(item) {
                //非 WAIT_RELEASE 显示
                return !['WAIT_RELEASE'].includes(item.status)
            },
            async handleIgnore({id}) {
                await this.$axios.post('/admin/publish/overPublish', {publishIpId: id, "action": OverPublishEnum.IGNORED,})
                this.$message.success("操作成功")
                await this.refreshStatus()
            },
            showRetry(item) {
                //非 WAIT_RELEASE 显示
                return !['WAIT_RELEASE'].includes(item.status)
            },
            //
            async handleRetry({id}) {
                await this.$axios.post('/admin/publish/publishToServer', {publishIpId: id})
                this.$message.success("操作成功")
                await this.refreshStatus()
            },

        }
    }
</script>

<style scoped>
    .headTitle {
        background: #585f77;
        /* border: 1px solid gray;*/
        border-left: #FF6A04 3px solid;
        font-size: 16px;
        padding: 8px 18px;
    }

</style>