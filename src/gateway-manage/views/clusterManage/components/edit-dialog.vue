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
                        label="集群名称："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入集群名称"
                            v-model="formData.name"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        prop="code"
                        class="dialog-form-item"
                        label="集群编码："
                >
                    <el-select
                            v-model="formData.code"
                            placeholder="请输入集群编码"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.cluster_codes"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="domainName"
                        class="dialog-form-item"
                        label="集群域名："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入集群域名"
                            v-model="formData.domainName"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        prop="bizName"
                        class="dialog-form-item"
                        label="业务线："
                >
                    <el-select
                            v-model="formData.bizName"
                            placeholder="请输入业务线"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.biz_name"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="ownerName"
                        class="dialog-form-item"
                        label="Owner："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入Owner名"
                            v-model="formData.ownerName"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        prop="ownerId"
                        class="dialog-form-item"
                        label="OwnerId："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入集群编码"
                            v-model="formData.ownerId"
                    ></el-input>
                </el-form-item>
            </div>
            <div class="dialog_row">
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
                <el-form-item
                        prop="state"
                        class="dialog-form-item"
                        label="集群状态："
                >
                    <el-select
                            v-model="formData.state"
                            placeholder="请输入集群状态"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.cluster_status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
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
        bizName: undefined,
        code: undefined,
        description: undefined,
        isShare: undefined,
        name: undefined,
        ownerId: undefined,
        ownerName: undefined,
        domainName: undefined,
        //status: undefined,
        id: undefined,
        state:undefined
    }
    const formRule = {
        bizName: [{required: true, message: '必填项', trigger: 'change'}],
        code: [{required: true, message: '必填项', trigger: 'change'}],
        description: [{required: true, message: '必填项', trigger: 'blur'}],
        isShare: [{required: true, message: '必填项', trigger: 'change'}],
        name: [{required: true, message: '必填项', trigger: 'blur'}],
        ownerId: [{required: true, message: '必填项', trigger: 'blur'}],
        ownerName: [{required: true, message: '必填项', trigger: 'blur'}],
        domainName: [{required: true, message: '必填项', trigger: 'blur'}],
        state: [{required: true, message: '必填项', trigger: 'change'}],
    }
    //const
    export default {
        name: 'EditorDialog',
        props: {},
        data() {
            return {
                metaConfig: {
                    cluster_codes: [],
                    biz_name: [],
                    cluster_status: [],
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
                setTimeout(()=>{this.$refs.form.clearValidate();},0)
            },
            submit() {
                this.$refs.form.validate()
                    .then(valid => {
                        if (valid) {
                            if (this.isAddNew) {
                                delete this.formData.id;
                            } else {

                            }
                            this.$axios({
                                url: this.isAddNew ? '/admin/cluster/add' : '/admin/cluster/update',
                                method: 'post',
                                data: this.formData,
                            }).then(data => {
                                this.$message({
                                    message: this.dialogTitle + '成功',
                                    type: 'success',
                                });
                                //
                                this.$parent.handleClickSearch();
                                //
                                this.cancel()
                            });
                        }
                    });
            },
            cancel() {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                setTimeout(()=>{this.visible = false;},0)

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