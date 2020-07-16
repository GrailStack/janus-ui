<template>
    <div class="apiManegePage page">
        <el-container>
            <el-aside width="450">
                <el-menu class="slideMenu" :default-active="selectedIndex" @select="handleOpen">
                    <el-menu-item index="0">
                        <span slot="title">API基本信息</span>
                    </el-menu-item>
                    <el-menu-item index="1">
                        <span slot="title">API请求</span>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title">API后端服务</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <Step1 v-if="selectedIndex==='0'" :formData="formData" :metaConfig="metaConfig" :isReadModel="true" :isNew="false"/>
                <Step2 v-if="selectedIndex==='1'" :formData="formData" :metaConfig="metaConfig" :isReadModel="true" :isNew="false"/>
                <Step3 v-if="selectedIndex==='2'" :formData="formData" :metaConfig="metaConfig" :isReadModel="true" :isNew="false"/>
                <div style="width: 100%">
                    <el-button style="margin:10px auto;display: block" @click="back">返回</el-button>
                </div>
            </el-main>
        </el-container>
    </div>
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
                selectedIndex: "0",
                formData: apiFormDataUtils.createFormData(),
                metaConfig: apiFormDataUtils.createAPIMetaConfig(),
            }
        },
        computed: {
            id() {
                let {query} = this.$route
                let id = query.id ? query.id : ''
                return id
            },
            // 是否草稿模式
            isDraft() {
                let {query} = this.$route
                let isDraft = query.isDraft === 'true'
                return isDraft
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
            handleOpen(key, keyPath) {
                this.selectedIndex = key
            },
            back() {
                this.$router.back()
            }
        }
    }
</script>

<style scoped lang="less">
    .slideMenu {
        background: #585f77;
        margin: 15px !important;
    }
</style>
<style lang="less">
    .apiManegePage {
        .el-menu {
            border-right: none;
        }

        .el-menu-item {
            color: white;

            &:hover, &.is-active {
                color: #ff6a00;
                background-color: #292D40;
            }
        }
    }
</style>