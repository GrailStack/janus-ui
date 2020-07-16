<template>
    <div class="apiManegePage page paddingPage">
        <!-- 编辑、新增 -->
        <StepBar v-if="!isReadModel" :index="stepIndex" :steps="['API基本信息','定义API请求','定义API后端服务']"></StepBar>
        <div class="bg-empty"></div>
        <component v-bind="{...compProps}" @next="next" @prev="prev"/>
    </div>
</template>

<script>

    import StepBar from "./component/steps/StepBar"
    import Step1 from "./component/steps/Step1"
    import {MetaUtils} from "../../../system/views/metaData/metaUtils";
    import Step2 from "./component/steps/step2/Step2";
    import Step3 from "./component/steps/step3/Step3";
    import {apiFormDataUtils} from "./model/apiFormData";
    import {UserClusterService} from "../api-manage/service";


    export default {
        name: 'APICreate',
        components: {StepBar, Step1, Step2, Step3},
        data() {
            return {
                stepIndex: 0, // 0=>第一步 1=>第二步
                formData: apiFormDataUtils.createFormData(),
                metaConfig: apiFormDataUtils.createAPIMetaConfig(),
            }
        },
        computed: {
            compProps() {
                return {
                    is: 'Step' + (this.stepIndex + 1),
                    formData: this.formData || {},
                    metaConfig: this.metaConfig || {},
                    isReadModel: this.isReadModel,
                    isNew: this.isNew
                }
            },
            id() {
                let {query} = this.$route
                let id = query.id ? query.id : ''
                return id
            },
            // 是否新建
            isNew() {
                return this.id === ''
            },
            // 是否草稿模式
            isDraft() {
                let {query} = this.$route
                let isDraft = query.isDraft === 'true'
                return isDraft
            },
            //
            isReadModel() {
                let {query} = this.$route
                let isEdit = query.isEdit === 'true'
                return !(this.isNew || isEdit)
            },
        },
        async mounted() {
            await this.loadConfig()
            await this.loadEdit()
        },
        methods: {
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
            prev() {
                this.setStep(this.stepIndex - 1)
            },
            next() {
                this.setStep(this.stepIndex + 1)
            },
            setStep(index) {
                if (index < 0) {
                    // 返回
                    this.back()
                } else if (index > 2) {
                    this.save()
                } else {
                    this.stepIndex = index
                    if (index === 2 && !this.isReadModel) {
                        // 第二步》第三步 数据处理
                        apiFormDataUtils.transformAfterStep2(this.formData)
                    }
                }
            },
            back() {
                this.$router.back()
            },
            save() {
                let url, params
                if (this.isNew) {
                    //新建
                    url = '/admin/api/create'
                    params = apiFormDataUtils.transformToParams(this.formData)
                    delete params.id
                } else {
                    //编辑
                    url = !this.isDraft ? '/admin/api/edit' : '/admin/api/editDraft'
                    params = apiFormDataUtils.transformToParams(this.formData)
                    params.id = this.id
                }

                this.$axios.post(url, params).then(data => {
                    let draft = this.isDraft || this.isNew
                    this.$router.push(`/myGate/APIManage?isDraft=${draft}`)
                }).catch(e => {
                    console.warn(e)
                }).finally(() => {
                })
            },
        }
    }
</script>

<style lang="less" scoped>

</style>
<style lang="less">

</style>