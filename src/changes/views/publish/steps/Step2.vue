<template>
    <div>
        <div class="headTitle">灰度下发配置</div>
        <div class="statusStep">
            <div :class="['stepItem',statusIndex<1 || 'stepItemActive']">1<span>拉出</span></div>
            <div class="stepArrow"></div>
            <div :class="['stepItem',statusIndex<2 || 'stepItemActive']">2<span>下发</span></div>
            <div class="stepArrow"></div>
            <div :class="['stepItem',statusIndex<3 || 'stepItemActive']">3<span>验证</span></div>
            <div class="stepArrow"></div>
            <div :class="['stepItem',statusIndex<4 || 'stepItemActive']">4<span>完成</span></div>
        </div>
        <div style="padding: 15px">
            <el-table :data="tableData" border style="width: 100%" class="task-manage-table">
                <!--<el-table-column type="selection" width="70" align="center"/>-->
                <el-table-column prop="id" label="id" width="50" align="left"/>
                <el-table-column prop="publishId" label="下发id" min-width="120" align="center"/>

                <el-table-column prop="creator" label="创建人" min-width="120" align="center"/>
                <el-table-column prop="ip" label="审批人" min-width="180" align="center"/>
                <el-table-column prop="status" label="状态" min-width="120" align="center">
                    <template slot-scope="{row}">
                        <i v-if="isLoading(row.status)" class="el-icon-loading"></i>
                        <span v-else>{{optValueToLabelOf('release_status', row.status)}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" fixed="right" width="380" align="center">
                    <template slot-scope="scope">
                        <el-button :disabled="!showPull(scope.row)" type="text" size="small" @click="handlePull(scope.row)">拉出</el-button>
                        <el-button :disabled="!showPublish(scope.row)" type="text" size="small" @click="handlePublish(scope.row)">下发</el-button>
                        <el-button :disabled="!showCheck(scope.row)" type="text" size="small" @click="handleCheck(scope.row)">验证</el-button>
                        <el-button :disabled="!showFinish(scope.row)" type="text" size="small" @click="handleFinish(scope.row)">完成</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div style="text-align: center">
            <el-button type="primary" size="medium" @click="prev()">上一步</el-button>
            <el-button type="primary" size="medium" @click="next()">下一步</el-button>
        </div>

        <ConnecteTestDialog ref="postman"></ConnecteTestDialog>

    </div>
</template>

<script>
    import {OverPublishEnum, PublishItemStatusEnum, PublishTypeEnum} from "../../apply-manage/data/data";
    import ConnecteTestDialog from "../ConnecteTestDialog";
    import MetaConfigMixin from "../../../../system/views/metaData/MetaConfigMixin";

    export default {
        name: "Step2",
        components: {ConnecteTestDialog},
        mixins:[MetaConfigMixin],
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
        },
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
                refreshTimeId: -1
            }
        },
        computed: {
            id() {
                return this.$route.query.id
            },
            status() {
                return this.tableData && this.tableData[0] && this.tableData[0].status ? this.tableData[0].status : ""
            },
            // 返回 第几步 icon
            statusIndex() {
                let status = this.status
                let statusMap = [
                    [PublishItemStatusEnum.WAIT_PULL],
                    [PublishItemStatusEnum.PULLING, PublishItemStatusEnum.PULL_FAILED, PublishItemStatusEnum.PULL_SUCCESS,],
                    [PublishItemStatusEnum.RELEASING, PublishItemStatusEnum.RELEASE_FAIL],
                    [PublishItemStatusEnum.RELEASE_SUCCESS],
                    [PublishItemStatusEnum.COMPLETED]
                ]
                let index = statusMap.findIndex(states => states.includes(status))
                console.log(status, 'statusIndex', index)
                return index
            }
        },
        async mounted() {
            await this.refreshStatus()
        },
        destroyed() {
            this.clearTimeout()
        },
        methods: {
            prev() {
                this.$emit('prev', 0)
            },
            next() {
                if (this.tableData && this.tableData[0] && this.tableData[0].status === PublishItemStatusEnum.COMPLETED) {
                    this.$emit('next', 2)
                } else {
                    this.$message.error("灰度未完成")
                }
            },
            clearTimeout() {
                if (this.refreshTimeId !== -1) {
                    clearTimeout(this.refreshTimeId)
                    this.refreshTimeId = -1
                }
            },
            async refreshStatus() {
                this.clearTimeout()

                console.log('refresh??')
                let id = this.id
                let data = await this.$axios.post('/admin/change/changeReleaseDetail', {applyId: id, type: PublishTypeEnum.GRAY})
                this.tableData = data.items || []
                //
                if (this.isLoading(this.status)) {
                    this.refreshTimeId = setTimeout(this.refreshStatus, 1000 * 10)
                }
            },
            // 是否要转菊花
            isLoading(status) {
                return [PublishItemStatusEnum.PULLING, PublishItemStatusEnum.RELEASING].includes(status)
            },


            showPull(item) {
                //WAIT_PULL， PULL_FAILED  拉出按钮可用
                return [PublishItemStatusEnum.WAIT_PULL, PublishItemStatusEnum.PULL_FAILED].includes(item.status)
            },
            async handlePull({id}) {
                let data = await this.$axios.post('/admin/publish/pullDownServer', {publishIpId: id})
                this.$message.success("操作成功")
                await this.refreshStatus()
            },

            showPublish(item) {
                // PULL_SUCCESS ，RELEASE_FAIL   灰度下发按钮可用
                return [PublishItemStatusEnum.PULL_SUCCESS, PublishItemStatusEnum.RELEASE_FAIL].includes(item.status)
            },
            async handlePublish({id}) {
                let data = await this.$axios.post('/admin/publish/publishToServer', {publishIpId: id})
                this.$message.success("操作成功")
                await this.refreshStatus()
            },
            showCheck(item) {
                return [PublishItemStatusEnum.RELEASE_SUCCESS].includes(item.status)
            },
            // 验证
            handleCheck() {
                this.$refs.postman.visible = true
            },
            showFinish(item) {
                return [PublishItemStatusEnum.RELEASE_SUCCESS].includes(item.status)
            },
            //完成
            async handleFinish({id}) {
                let data = await this.$axios.post('/admin/publish/overPublish', {publishIpId: id, "action": OverPublishEnum.COMPLETED,})
                this.$message.success("操作成功")
                await this.refreshStatus()
            }
        }
    }
</script>

<style scoped lang="less">
    .headTitle {
        background: #585f77;
        /* border: 1px solid gray;*/
        border-left: #FF6A04 3px solid;
        font-size: 16px;
        padding: 8px 18px;
    }

    .statusStep {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: 15px 0 25px 0;

        @line-color: #eee;

        .stepItem {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: #585f77;
            border: 1px @line-color solid;
            margin: 0 8px;
            line-height: 50px;
            text-align: center;
            position: relative;

            span {
                position: absolute;
                top: 55px;
                left: -53px;
                width: 150px;
                line-height: 18px;
            }
        }

        .stepItemActive {
            background: #FF6A04 !important; //激活状态
        }

        .stepArrow {
            width: 100px;
            height: 2px;
            background: @line-color;
            position: relative;

            &:after {
                content: " ";
                position: absolute;
                width: 0;
                height: 0;
                border: 8px solid;
                top: -7px;
                right: -9px;
                border-color: transparent transparent transparent @line-color;
            }
        }
    }

</style>