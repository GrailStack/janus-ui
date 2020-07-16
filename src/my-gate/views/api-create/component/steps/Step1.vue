<template>
    <div>
        <el-form class="stepForm " :model="formData" ref="form" :disabled="isReadModel"
                 label-position="center" label-width="100px" :rules="formRules">
            <div class="headTitle">API名称及描述</div>

            <div class="boarder-box">
                <div class="box-layout">
                    <el-form-item prop="name" label="API名称：">
                        <el-input v-model="formData.name" :disabled="!isNew" placeholder="请输入API名称" size="small"/>
                    </el-form-item>
                    <el-form-item prop="clusterCode" label="集群：">
                        <el-select v-model="formData.clusterCode" :disabled="!isNew" placeholder="选择集群" size="small">
                            <el-option v-for="item in metaConfig.cluster_codes" :key="item.value"
                                       :label="item.label" :value="item.value"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item prop="description" label="描 述：">
                        <el-input v-model="formData.description" placeholder="请输入描述" type="textarea" size="small"/>
                    </el-form-item>
                </div>
            </div>

            <div class="boarder-box" v-if="!isReadModel">
                <el-form-item class="box-layout">
                    <el-button type="primary" size="medium" @click="back()">返回</el-button>
                    <el-button type="primary" size="medium" @click="next()">下一步</el-button>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script>

    const formRule = {
        name: [{required: true, message: '必填项', trigger: 'change'}],
        clusterCode: [{required: true, message: '必填项', trigger: 'change'}],
        description: [{required: true, message: '必填项', trigger: 'blur'}],
    }
    export default {
        name: "Step1",
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            formData: {
                type: Object,
                default: () => ({})
            },
            isNew: {
                type: Boolean,
                default: () => true
            },
            isReadModel: {
                type: Boolean,
                default: () => true
            }
        },
        data() {
            return {
                formRules: formRule,
            }
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

        .el-form-item {
            width: 100%;
        }

        .el-select {
            width: 100%;
        }

    }
</style>