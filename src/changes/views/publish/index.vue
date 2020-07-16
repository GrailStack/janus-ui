<template>
    <div class="apiManegePage page">
        <StepBar v-if="!isReadModel" :index="stepIndex" :steps="['下发类型选择','灰度下发配置','全量下发配置']"></StepBar>
        <div class="bg-empty"></div>
        <component v-bind="{...compProps}" @next="changeStep" @prev="changeStep"/>
    </div>
</template>

<script>
    import StepBar from "../../../my-gate/views/api-create/component/steps/StepBar";
    import {apiFormDataUtils} from "../../../my-gate/views/api-create/model/apiFormData";
    import Step1 from "./steps/Step1";
    import Step2 from "./steps/Step2";
    import Step3 from "./steps/Step3";
    import ConnecteTestDialog from "./ConnecteTestDialog";
    import MetaConfigMixin from "../../../system/views/metaData/MetaConfigMixin";
    // 下发页面
    export default {
        name: "publish",
        components: {ConnecteTestDialog, StepBar, Step1, Step2, Step3},
        mixins: [MetaConfigMixin],
        data() {
            return {
                stepIndex: 0, // 0=>第一步 1=>第二步
                metaConfig: {
                    release_status: []
                },
                isReadModel: false
            }
        },
        computed: {
            compProps() {
                return {
                    is: 'Step' + (this.stepIndex + 1),
                    metaConfig: this.metaConfig || {},
                    isReadModel: this.isReadModel,
                }
            },
        },
        async mounted() {
            await this.loadConfig()
        },
        methods: {
            changeStep(index) {
                this.stepIndex = index
            }
        }
    }
</script>

<style scoped>

</style>