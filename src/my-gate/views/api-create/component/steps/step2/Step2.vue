<template>
    <div class="apiStep2">
        <el-form class="stepForm" :model="formData" ref="form" :disabled="isReadModel"
                 label-position="center" label-width="100px" :rules="formRules">

            <div class="headTitle">定义API请求</div>
            <div class="boarder-box">
                <div class="box-layout">
                    <el-form-item prop="protocol" label="协议：">
                        <el-select v-model="formData.protocol" placeholder="选择协议" size="small">
                            <el-option v-for="item in metaConfig.api_protocol" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="path" label="路径：">
                        <el-input v-model="formData.path" :disabled="!isNew" placeholder="请输入路径" size="small"/>
                    </el-form-item>

                    <el-form-item prop="method" label="Method：">
                        <el-select v-model="formData.method" :disabled="!isNew" placeholder="选择Method" size="small">
                            <el-option v-for="item in metaConfig.http_method" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="paramTransType" label="入参模式：">
                        <el-select v-model="formData.paramTransType" placeholder="选择请求入参模式" size="small">
                            <el-option v-for="item in metaConfig.api_paramTransType" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="headTitle">参数定义</div>
            <div class="boarder-box">
                <el-form-item labelX="Params：" label-width="0" class="tabelForm">
                    <Step2Table ref="step2Tabel" :isReadModel="isReadModel" @delete="deleteParam"
                                :form-data="formData.paramTransConfig.params" :meta-config="metaConfig"/>
                    <div style="width: 100%;position: relative">
                        <span style="display:inline-block;color: #909399"><i class="el-icon-warning"/>入参定义将用于后端参数映射以及生成API文档 </span>
                        <el-button v-if="!isReadModel" class="addParamsBtn" type="primary" size="medium" @click="addParam()">添加参数</el-button>
                    </div>
                </el-form-item>
            </div>

            <div class="boarder-box" v-if="!isReadModel">
                <el-form-item class="box-layout" >
                    <el-button type="primary" size="medium" @click="back()">上一步</el-button>
                    <el-button type="primary" size="medium" @click="next()">下一步</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>

    import Step2Table from "./Step2Table";
    import {apiFormDataUtils} from "../../../model/apiFormData";

    const formRule = {
        path: [{required: true, message: '必填项', trigger: 'change'}],
        protocol: [{required: true, message: '必填项', trigger: 'change'}],
        method: [{required: true, message: '必填项', trigger: 'change'}],
        paramTransType: [{required: true, message: '必填项', trigger: 'change'}],
    }
    export default {
        name: "Step2",
        components: {
            Step2Table,
        },
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            formData: {
                type: Object,
                default: () => ({})
            },
            isReadModel: {
                type: Boolean,
                default: () => true
            },
            isNew: {
                type: Boolean,
                default: () => true
            }
        },
        data() {
            return {
                formRules: formRule,
            }
        },
        computed: {},
        watch: {},
        methods: {
            back() {
                this.$emit('prev')
            },
            next() {
                this.$refs.form.validate(v => {
                    if (v) {
                        this.$emit('next')
                    }
                })
            },
            //加
            addParam() {
                apiFormDataUtils.addStep2NewParams(this.formData)
            },

            deleteParam(index) {
                apiFormDataUtils.deleteStep2Param(this.formData, index)
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

    .boarder-box {
        border: 1px solid #65717d;
        margin: 0 0 15px 0;
    }

    .box-layout {
        max-width: 750px;
        margin: 15px 8%;
    }


    .stepForm {
        width: 100%;

        .el-form-item:not(.tabelForm) {

        }

        .tabelForm {
            padding: 15px;
        }

        .el-select {
            width: 100%;
        }

        .addParamsBtn {
            float: right;
            margin-top: 5px;
            margin-right: 15px;
            display: inline-block;
        }


    }
</style>
<style lang="less">
    .apiStep2 {
        .tabItem {
            .el-table__header {
                line-height: 23px !important;
            }
        }
    }
</style>