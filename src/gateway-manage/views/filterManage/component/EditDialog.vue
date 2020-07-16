<template>
    <el-dialog class="editorDialog"
               :visible.sync="visible" width="640px">
        <p slot="title" class="dialog-header">
            <span class="dialog-title">{{ dialogTitle }}</span>
        </p>
        <el-form
                :model="formData"
                ref="form"
                label-position="center"
                label-width="100px"
                :rules="formRules"
        >
            <div class="dialog_row">
                <el-form-item
                        prop="name"
                        class="dialog-form-item"
                        label="Filter名称："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入Filter名称"
                            v-model="formData.name"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        prop="filterCode"
                        class="dialog-form-item"
                        label="Code："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入FilterCode"
                            v-model="formData.filterCode"
                    ></el-input>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <!--classCode   是filter的分类
                    modelType  是组件类型-->
                <el-form-item
                        prop="classCode"
                        class="dialog-form-item"
                        label="分类："
                >
                    <el-select
                            v-model="formData.classCode"
                            placeholder="请输入分类"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.filter_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item
                        prop="status"
                        class="dialog-form-item"
                        label="状 态："
                >
                    <el-select
                            v-model="formData.status"
                            placeholder="请输入集群状态"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.filter_status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                
                <!--<el-form-item
                        prop="modelType"
                        class="dialog-form-item"
                        label="组件类型："
                >
                    <el-select
                            v-model="formData.modelType"
                            placeholder="请输入组件类型"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.filter_module_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>-->
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="filterOrder"
                        class="dialog-form-item"
                        label="优先级："
                >
                    <el-input
                            class="dialog_row_input"
                            type="number"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入优先级"
                            v-model="formData.filterOrder"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        prop="executePlace"
                        class="dialog-form-item"
                        label="执行位置："
                >
                    <el-select
                            v-model="formData.executePlace"
                            placeholder="请输入执行位置"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.filter_execute_place"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="isGlobal"
                        class="dialog-form-item"
                        label="是否全局："
                >
                    <el-radio-group v-model="formData.isGlobal">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item
                        prop="isShare"
                        class="dialog-form-item"
                        label="是否共享："
                >
                    <el-radio-group v-model="formData.isShare">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
    
            <div class="dialog_row">
                <el-form-item
                        prop="description"
                        class="dialog-form-item"
                        style="width: 580px"
                        label="描 述："
                >
                    <el-input
                            class="dialog_row_input"
                            type="textarea"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入描述"
                            v-model="formData.description"
                    ></el-input>
                </el-form-item>
            </div>
            <div class="dialog_btns">
                <el-button type="primary" size="medium" @click="cancel()"
                >取消
                </el-button
                >
                <el-button type="primary" size="medium" @click="submit()"
                >保存
                </el-button
                >
            </div>
        </el-form>
    </el-dialog>
</template>


<script>

    const emptyForm = {
        "id": undefined,

        "name": undefined,
        "filterCode": undefined,

        "classCode": undefined,
        //"modelType": undefined,

        "filterOrder": undefined,
        "executePlace": undefined,

        "description": undefined,


        "isGlobal": undefined,
        "isShare": undefined,
        "status": undefined,
    }
    const formRule = {
        name: [{required: true, message: '必填项', trigger: 'blur'}],
        filterCode: [{required: true, message: '必填项', trigger: 'blur'}],
        classCode: [{required: true, message: '必填项', trigger: 'change'}],
        //modelType: [{required: true, message: '必填项', trigger: 'change'}],

        filterOrder: [{required: true, message: '必填项', trigger: 'blur'}],
        executePlace: [{required: true, message: '必填项', trigger: 'change'}],

        description: [{required: true, message: '必填项', trigger: 'blur'}],

        isGlobal: [{required: true, message: '必填项', trigger: 'change'}],
        isShare: [{required: true, message: '必填项', trigger: 'change'}],
        status: [{required: true, message: '必填项', trigger: 'change'}],
    }

    //const
    export default {
        name: 'EditorDialog',
        props: {},
        data() {
            return {
                metaConfig: {
                },
                visible: false,
                formData: {...emptyForm},
                formRules: {...formRule},
            };
        },
        computed: {
            isAddNew() {
                return this.formData.id === undefined
            },
            dialogTitle() {
                return this.isAddNew ? "新增" : '编辑'
            }
        },
        async mounted() {

        },
        methods: {
            // $parent调用
            openEditDialog(item, metaConfig) {
                this.visible = true
                this.metaConfig = JSON.parse(JSON.stringify(metaConfig))
                if (item) {
                    this.formData = JSON.parse(JSON.stringify(item))
                } else {
                    this.formData = {...emptyForm}
                }
                setTimeout(() => {
                    this.$refs.form.clearValidate();
                }, 0)
            },
            submit() {
                this.$refs.form.validate()
                    .then(valid => {
                        if (valid) {
                            delete this.formData.modelType;
                            if (this.isAddNew) {
                                delete this.formData.id;
                            } else {

                            }
                            this.$axios({
                                url: this.isAddNew ? '/admin/filter/add' : '/admin/filter/update',
                                method: 'post',
                                data: this.formData,
                            }).then(data => {
                                this.$message({
                                    message: this.dialogTitle + '成功',
                                    type: 'success',
                                });
                                //
                                this.cancel()
                                //
                                this.$parent.refresh();

                            });
                        }
                    });
            },
            cancel() {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                setTimeout(() => {
                    this.visible = false;
                }, 0)
            },

        },
    };
</script>
<style lang="less" scoped>
    .editorDialog {
        .dialog-title {
            line-height: 24px;
            font-size: 18px;
        }

        .dialog_row {
            .dialog-form-item {
                display: inline-block;
                width: 48%;
            }

            .dialog-form-item-right {
                display: inline-block;
                width: 48%;
                margin-left: 8px;
            }
        }

        .dialog_btns {
            display: flex;
            justify-content: center;
        }

    }
</style>
<style lang="less">

</style>