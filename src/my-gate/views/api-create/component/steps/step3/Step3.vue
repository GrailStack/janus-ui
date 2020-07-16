<template>
    <div class="apiStep3">

        <el-form class="stepForm" :model="serviceFormData" ref="form" :disabled="isReadModel"
                 label-position="center" label-width="100px" :rules="formRules">

            <div class="headTitle">定义API后端服务</div>
            <div class="boarder-box">
                <div class="box-layout">
                    <el-form-item prop="name" label="服务名称：">
                        <el-input v-model="serviceFormData.name" placeholder="请输入服务名称" size="small"/>
                    </el-form-item>

                    <el-form-item prop="type" label="服务类型：">
                        <el-select v-model="serviceFormData.type" @change="onTypeSelected"
                                   placeholder="选择协议" size="small">
                            <el-option v-for="item in metaConfig.API_OutServiceType" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-if="!showURITable" prop="uri" label="服务URI：">
                        <el-input v-model="serviceFormData.uri" placeholder="请输入服务URI" size="small"/>
                    </el-form-item>

                    <el-form-item v-if="showURITable" label="服务URI：" >
                        <Step3URITable :formData="uriList" :onlyOneItem="onlyOneURITableItem"
                                       :meta-config="metaConfig"
                                       :isReadModel="isReadModel"/>
                        <el-button v-if="!onlyOneURITableItem" class="addParamsBtn" type="primary" size="medium" @click="addURI()">添加URI</el-button>
                    </el-form-item>

                    <el-form-item prop="protocol" label="协议：">
                        <el-select v-model="serviceFormData.protocol" placeholder="选择协议" size="small">
                            <el-option v-for="item in metaConfig.API_OutServiceProtocol" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="path" label="路径：">
                        <el-input v-model="serviceFormData.path" placeholder="请输入路径" size="small"/>
                    </el-form-item>

                    <el-form-item prop="method" label="Method：">
                        <el-select v-model="serviceFormData.method" placeholder="选择Method" size="small">
                            <el-option v-for="item in metaConfig.http_method" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>
                </div>
            </div>
            <div class="headTitle">参数定义</div>
            <div class="boarder-box">
                <el-form-item labelX="Params：" label-width="0" class="tableForm">
                    <Step3ParamsTable ref="step2Tabel"
                                      :form-data="serviceParamMapping"
                                      :meta-config="metaConfig"
                                      :isReadModel="isReadModel"
                    />
                    <!--<el-button v-if="!isReadModel" class="addParamsBtn" type="primary" size="medium" @click="addParam()">
                        添加参数
                    </el-button>-->
                </el-form-item>
            </div>

            <div class="boarder-box" v-if="!isReadModel">
                <el-form-item class="box-layout" >
                    <el-button type="primary" size="medium" @click="back()">上一步</el-button>
                    <el-button type="primary" size="medium" @click="next()">确认</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>

    import Step3ParamsTable from "./Step3ParamsTable";
    import {apiFormDataUtils, ServiceTypeEnum} from "../../../model/apiFormData";
    import Step3URITable from "./Step3URITable";

    const formRule = {
        name: [{required: true, message: '必填项', trigger: 'change'}],
        type: [{required: true, message: '必填项', trigger: 'change'}],
        uri: [{required: true, message: '必填项', trigger: 'change'}],
        protocol: [{required: true, message: '必填项', trigger: 'change'}],
        path: [{required: true, message: '必填项', trigger: 'change'}],
        method: [{required: true, message: '必填项', trigger: 'change'}],
    }
    export default {
        name: "Step3",
        components: {
            Step3ParamsTable, Step3URITable
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
        },
        data() {
            return {
                formRules: formRule,
            }
        },
        computed: {
            serviceFormData() {
                return this.formData.outServiceConfig.outServices[0]
            },

            showURITable() {
                return apiFormDataUtils.isTableURI(this.serviceFormData)
            },
            onlyOneURITableItem() {
                return this.serviceFormData.type === ServiceTypeEnum.STRAIGHT_FORWARD
            },
            uriList() {
                return this.serviceFormData.uriList
            },
            serviceParamMapping() {
                return this.serviceFormData.paramTransConfig.paramMappings
            },

        },
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
            onTypeSelected(val) {
                if (ServiceTypeEnum.STRAIGHT_FORWARD === val) {
                    if (this.uriList.length < 1) {
                        this.addURI()
                    } else {
                        this.serviceFormData.uriList = [].concat(this.uriList[0])
                    }
                }
            },
            //加
            addURI() {
                this.uriList.push({
                    host: "", port: ""
                })
            },
            /*addParam() {
                // debugger
                this.serviceParamMapping.push({
                    "afterName": "string",
                    "afterPosition": "PATH",
                    "beforeName": "string",
                    "beforePosition": "PATH",
                    "defaultValue": "string",
                    "description": "string"
                })
            },*/
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

        .el-form-item:not(.tableForm) {
        }

        .tableForm {
            padding: 15px;
        }

        .el-select {
            width: 100%;
        }

        .addParamsBtn {
            float: right;
            margin-top: 5px;
            margin-right: 20px;
            display: inline-block;
        }
    }
</style>
<style lang="less">
    .apiStep3 {
        .tabItem {
            .el-table__header {
                line-height: 23px !important;
            }
        }
    }
</style>