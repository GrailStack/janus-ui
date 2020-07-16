<template>
    <div>
        <div class="headTitle">下发类型选择</div>
        <el-form class="stepForm" :model="formData" ref="form" :disabled="hasCreated"
                 label-position="center" label-width="100px" :rules="formRules">
            <el-form-item prop="applyId" label="变更ID：">
                <el-input v-model="formData.applyId" :disabled="true" placeholder="请输入变更ID" size="small"/>
            </el-form-item>
            <el-form-item prop="creator" label="提交人：">
                <el-input v-model="formData.creator" :disabled="true" placeholder="请输入提交人" size="small"/>
            </el-form-item>
            <el-form-item prop="approver" label="审批人：">
                <el-input v-model="formData.approver" :disabled="true" placeholder="请输入审批人" size="small"/>
            </el-form-item>
            <el-form-item prop="description" label="变更说明：">
                <el-input v-model="formData.description" :disabled="true" placeholder="请输入变更说明" type="textarea" size="small"/>
            </el-form-item>

            <el-form-item prop="type" label="下发方式：">
                <el-radio-group v-model="formData.type" @change="changePulishType">
                    <el-radio :label="'GRAY'">灰度</el-radio>
                    <el-radio :label="'FULL'">全量</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="selectedIpList" label="IP：" :disabled="ipSelectedDisabled">
                <el-checkbox-group v-model="formData.selectedIpList">
                    <el-checkbox v-for="ip in formData.ipList" :label="ip" :key="ip">{{ip}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <div style="margin-left: 120px">
            <el-button type="primary" size="medium" @click="prev()">返回</el-button>
            <el-button type="primary" size="medium" @click="next()">下一步</el-button>
        </div>
    </div>
</template>

<script>

    import {PublishTypeEnum} from "../../apply-manage/data/data";
    import {pick} from "../../../../common/utils/paramsUtils";
    import {ShareData} from "./ShareData";

    const formRule = {
        type: [{required: true, message: '必填项', trigger: 'change'}],
        selectedIpList: [{required: true, message: '必填项', trigger: 'change'}],
    }

    export default {
        name: "Step1",
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
        },
        data() {
            return {
                hasCreated: false,//是否提交过，false回显
                formRules: formRule,
                formData: {
                    "applyId": 0,
                    "creator": "",
                    "approver": "",
                    "description": "",
                    "clusterCode": "",
                    "status": "",
                    "ipList": [],
                    "selectedIpList": [],
                    "type": ""
                },
                ipSelectedDisabled: false,//如果选了全量就不用勾选ips
            }
        },
        async mounted() {
            let id = this.$route.query.id
            let data = await this.$axios.post('/admin/change/changeReleaseBasicInfo', {applyId: id})
            this.formData = data
            if (this.formData.type === '' || this.formData.type === undefined || this.formData.type === null) {
                this.hasCreated = false
            } else {
                this.hasCreated = true
            }
            console.log('hasCreated', this.hasCreated)
            setTimeout(() => {
                this.$refs.form.clearValidate()
            }, 0)
        },
        methods: {
            prev() {
                this.$router.push(`/changes/apply-manage`)
                // this.$emit('prev', -1)
            },
            next() {
                this.$refs.form.validate(async v => {
                    if (v) {
                        if (!this.hasCreated) {
                            await this.submit()
                        }
                        if (this.formData.type === PublishTypeEnum.GRAY) {
                            ShareData.selectedType = PublishTypeEnum.GRAY
                            this.$emit('next', 1)
                        } else if (this.formData.type === PublishTypeEnum.FULL) {
                            ShareData.selectedType = PublishTypeEnum.FULL
                            this.$emit('next', 2)
                        }
                    }
                })
            },
            //下发
            async submit() {
                let params = pick(this.formData, ['applyId', 'type', 'selectedIpList', 'ipList'])
                let data = await this.$axios.post('/admin/change/releaseChanges', params)
            },
            // 切换下发方式
            changePulishType(val) {
                if (val === PublishTypeEnum.FULL) {
                    this.formData.selectedIpList = JSON.parse(JSON.stringify(this.formData.ipList))
                } else if (val === PublishTypeEnum.GRAY) {
                    if (this.formData.selectedIpList.length > 1) {
                        this.formData.selectedIpList = []
                    }
                }
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

    .stepForm {
        max-width: 600px;
        margin: 25px;

        .el-form-item {
            width: 100%;
        }

        .el-select {
            width: 100%;
        }

    }
</style>