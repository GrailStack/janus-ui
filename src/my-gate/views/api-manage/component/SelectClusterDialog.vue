<template>
    <el-dialog class="editorDialog" :visible.sync="visible" width="500px">
        <p slot="title" class="dialog-header">
            <span class="dialog-title">请选择将变更提交到哪个集群</span>
        </p>
        <el-form class="stepForm" ref="form" :model="formData" :rules="formRules"
                 label-position="center" label-width="130px">
            <!--<div class="info">请选择将变更提交到哪个集群</div>-->
            <el-form-item prop="clusterCode" label="选择集群：">
                <el-select v-model="formData.clusterCode" placeholder="选择集群" size="small">
                    <el-option v-for="(item,index) in clusters" :key="item.value+'_'+index"
                               :label="item.label" :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="confirm()">确认</el-button>
                <el-button type="primary" size="medium" @click="close()">取消</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>
    import {UserClusterService} from "../service";

    export default {
        name: "SelectClusterDialog",
        data() {
            return {
                visible: false,
                formData: {
                    clusterCode: undefined,
                },
                formRules: {
                    clusterCode: [{required: true, message: '必填项', trigger: 'change'}],
                },
                clusters: []
            }
        },
        async mounted() {
            this.clusters = await UserClusterService.getUserCluster()
        },
        methods: {
            confirm() {
                this.$refs.form.validate(v => {
                    if (v) {
                        this.$router.push(`/changes/submit?clusterCode=${this.formData.clusterCode}`)
                    }
                })
            },
            close() {
                this.visible = false
            }
        },

    }
</script>

<style scoped>
    .info {
        padding-left: 40px;
        margin-bottom: 8px;
    }
</style>