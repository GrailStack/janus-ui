<template>
    <el-dialog class="editorDialog"
               :visible.sync="visible" width="680px">
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
                        label="配置名称："
                >
                    <el-input
                            class="dialog_row_input"
                            type="text"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入配置名称"
                            v-model="formData.name"
                    ></el-input>
                </el-form-item>
                <el-form-item
                        prop="clusterCode"
                        class="dialog-form-item"
                        label="集群编码："
                >
                    <el-select
                            v-model="formData.clusterCode"
                            placeholder="请输入集群编码"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.used_cluster"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="configKey"
                        class="dialog-form-item"
                        label="配置项："
                >
                    <el-select
                            v-model="formData.configKey"
                            placeholder="请输入配置状态"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.cluster_config_keys"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                        prop="type"
                        class="dialog-form-item"
                        label="配置类型："
                >
                    <el-select
                            v-model="formData.type"
                            placeholder="请输入配置状态"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.cluster_config_type"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="status"
                        class="dialog-form-item"
                        label="配置状态："
                >
                    <el-select
                            v-model="formData.status"
                            placeholder="请输入配置状态"
                            size="small"
                    >
                        <el-option
                                v-for="item in metaConfig.status"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </div>
            <div class="dialog_row">
                <el-form-item
                        prop="configValue"
                        class="dialog-form-item"
                        style="width: 580px"
                        label="配 置："
                >
                    <el-input
                            v-if="!isYml"
                            class="dialog_row_input codeInput"
                            type="textarea"
                            style="width:100%;"
                            size="small"
                            placeholder="请输入配置"
                            v-model="formData.configValue"
                    ></el-input>

                    <codemirror v-if="isYml"
                            ref="myCm"
                            v-model="formData.configValue"
                            :options="cmOptions"
                            class="code"
                    ></codemirror>
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


<script lang="tsx">

    import {codemirror} from 'vue-codemirror'
    // require styles
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/darcula.css'


    import 'codemirror/mode/yaml/yaml.js'

    import 'codemirror/addon/edit/matchbrackets.js'
    import 'codemirror/addon/selection/active-line.js'

    import 'codemirror/addon/lint/lint'
    import 'codemirror/addon/lint/lint.css'
    import 'codemirror/addon/lint/json-lint'
    import 'codemirror/addon/hint/javascript-hint.js'
    // hint
    import 'codemirror/addon/hint/show-hint.js'
    import 'codemirror/addon/hint/show-hint.css'
    import 'codemirror/addon/hint/javascript-hint.js'
    import 'codemirror/addon/selection/active-line.js'


    // require active-line.js

    // styleSelectedText
    import 'codemirror/addon/selection/mark-selection.js'
    import 'codemirror/addon/search/searchcursor.js'

    // highlightSelectionMatches
    import 'codemirror/addon/scroll/annotatescrollbar.js'
    import 'codemirror/addon/search/matchesonscrollbar.js'
    import 'codemirror/addon/search/searchcursor.js'
    import 'codemirror/addon/search/match-highlighter.js'


    const emptyForm = {
        id: undefined,
        name: undefined,
        clusterCode: undefined,
        configKey: undefined,
        configValue: '',
        status: undefined,
        type: "yml",
    }
    const formRule = {
        name: [{required: true, message: '必填项', trigger: 'blur'}],
        clusterCode: [{required: true, message: '必填项', trigger: 'change'}],
        configKey: [{required: true, message: '必填项', trigger: 'blur'}],
        configValue: [{required: true, message: '必填项', trigger: 'blur'}],
        status: [{required: true, message: '必填项', trigger: 'blur'}],
        type: [{required: true, message: '必填项', trigger: 'blur'}],
    }
    //const
    export default {
        name: 'EditorDialog',
        components: {codemirror},
        props: {},
        data() {
            return {
                metaConfig: {
                },
                visible: false,
                formData: {...emptyForm},
                formRules: {...formRule},
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'text/x-yaml',
                    theme: 'darcula',
                    lineNumbers: true,
                    line: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                }
            };
        },
        computed: {
            isAddNew() {
                return this.formData.id === undefined
            },
            dialogTitle() {
                return this.isAddNew ? "新增" : '编辑'
            },
            isYml(){
                return this.formData.type==='yml'
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
                            if (this.isAddNew) {
                                delete this.formData.id;
                            } else {

                            }
                            this.$axios({
                                url: this.isAddNew ? '/admin/clusterConfig/add' : '/admin/clusterConfig/update',
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

    .codeInput /deep/ .el-textarea__inner {
        height: 300px !important;
    }

    .code {
        font-size: 12px;
        line-height: 22px
    }
</style>
<style lang="less">

</style>