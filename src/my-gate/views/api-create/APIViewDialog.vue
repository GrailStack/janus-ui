<template>
    <el-dialog class="editorDialog"  :visible.sync="visible" width="680px">
        <p slot="title" class="dialog-header">
            <span class="dialog-title">查看API</span>
        </p>
        <Step1 :formData="formData" :metaConfig="metaConfig" :isReadModel="true" :isNew="false"/>
        <Step2 :formData="formData" :metaConfig="metaConfig" :isReadModel="true" :isNew="false"/>
        <Step3 :formData="formData" :metaConfig="metaConfig" :isReadModel="true" :isNew="false"/>
    </el-dialog>
</template>

<script>


    import Step3 from "./component/steps/step3/Step3";
    import Step2 from "./component/steps/step2/Step2";
    import Step1 from "./component/steps/Step1";
    import {apiFormDataUtils} from "./model/apiFormData";
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";
    import {UserClusterService} from "../api-manage/service";

    export default {
        name: "APIViewer",
        components: {Step1, Step2, Step3},
        data() {
            return {
                visible: false,
                formData: apiFormDataUtils.createFormData(),
                metaConfig: apiFormDataUtils.createAPIMetaConfig(),
                id: undefined,
                isDraft: undefined
            }
        },
        methods: {
            // 外部调用入口函数
            async open(id, isDraft) {
                this.id = id
                this.isDraft = isDraft
                await this.loadConfig()
                await this.loadEdit()
                this.visible = true
            },
            async loadConfig() {
                let keys = Object.keys(this.metaConfig)
                let config = await MetaUtils.loadOptions(keys)
                MetaUtils.transformOptionsFrom(config, keys)
                config.cluster_codes= await UserClusterService.getUserCluster()
                this.metaConfig = config
            },
            async loadEdit() {
                if (this.id) {
                    let url = this.isDraft ? '/admin/api/queryDetailDraft' : '/admin/api/queryDetail'
                    let data = await this.$axios.post(url, {id: this.id})
                    this.formData = apiFormDataUtils.transformFromData(data)
                }
            },

        }
    }
</script>

<style scoped>

</style>