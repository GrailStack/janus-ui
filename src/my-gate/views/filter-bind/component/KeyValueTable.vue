<template>
    <el-form :model="formData" ref="form" label-position="center" label-width="150px" :rules="rules">
        <el-form-item prop="args" :label="formLabel" class="tabelFormItem">
            <el-table class="table" :data="tabelData" :height="undefined" style="width: 100%;">
                <el-table-column label="key" min-width="120" align="center">
                    <template slot-scope="{row,$index}">
                        <el-form-item :prop="getValidateProp($index,'key')" :rules="rules.key">
                            <el-input v-model="row.key" placeholder="请输入名称" size="small"/>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="value" min-width="120" align="center">
                    <template slot-scope="{row,$index}">
                        <el-form-item :prop="getValidateProp($index,'value')" :rules="rules.value">
                            <el-input v-model="row.value" placeholder="请输入值" size="small"/>
                        </el-form-item>
                    </template>
                </el-table-column>

                <el-table-column label="操作" fixed="right" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" @click="deleteParam(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item style="margin-top:25px">
            <el-button type="text" size="mini" @click="newParam()">新增</el-button>
        </el-form-item>
    </el-form>
</template>

<script lang="jsx">
    const rules = {
        args: [{required: true, message: '必填项', trigger: 'blur'}],
        key: [{required: true, message: '必填项', trigger: 'blur'}],
        value: [{required: true, message: '必填项', trigger: 'blur'}],
    }

    const createNewFormData = () => {
        return {args: []}
    }
    export default {
        name: "KeyValueTable",
        createNewFormData: createNewFormData,
        props: {
            filterData: {
                type: Object,
                default: () => ([])
            },
        },
        data() {
            return ({
                formData: createNewFormData(),
                rules: rules,
            })
        },
        computed: {
            formLabel() {
                return '添加字段'
            },
            tabelData() {
                return this.formData.args
            }
        },
        mounted() {
            this.formData = this.fromFilterParamJson()
        },
        methods: {
            fromFilterParamJson() {
                let formData = createNewFormData()
                try {
                    formData = {...formData, ...JSON.parse(this.filterData.filterParam)}
                } catch (e) {
                    console.warn('tranform error?',this.filterData)
                }
                return formData
            },
            toFilterParamJson() {
                return JSON.stringify(this.formData)
            },

            deleteParam(index) {
                this.formData.args.splice(index, 1)
            },
            newParam() {
                this.formData.args.push({key: '', value: ""})
            },
            //
            getValidateProp(index, prop) {
                return `args.${index}.${prop}`
            },

        }
    }
</script>

<style scoped lang="less">

    .tabelFormItem {
        margin-bottom: 10px;
    }

    .table {
        // border: 1px solid rgba(193, 197, 207, 0.15) !important;
        line-height: 25px;
    }

</style>

