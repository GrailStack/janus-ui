<template>
    <el-table class="table" :data="formData" :height="undefined" style="width: 100%;">

        <el-table-column label="后端参数名" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isReadModel">{{row.afterName}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'afterName')" :rules="rules.afterName">
                    <el-input v-model="row.afterName" placeholder="后端参数名" size="small"/>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column label="port" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isReadModel">{{row.afterPosition}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'afterPosition')" :rules="rules.afterPosition">
                    <el-select v-model="row.afterPosition" placeholder="后端参数位置" size="small">
                        <el-option v-for="item in metaConfig.api_param_position" :key="item.value"
                                   :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column label="名称" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isStep2">{{row.name}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'name')" :rules="rules.name">
                    <el-input v-model="row.name" placeholder="请输入名称" size="small"/>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column label="位置" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isStep2">{{row.position}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'position')" :rules="rules.position">
                    <el-select v-model="row.position" placeholder="位置" size="small">
                        <el-option v-for="item in metaConfig.api_param_position" :key="item.value"
                                   :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </template>
        </el-table-column>


        <el-table-column label="数据类型" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isStep2">{{row.dataType}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'dataType')" :rules="rules.dataType">
                    <el-select v-model="row.dataType" placeholder="数据类型" size="small">
                        <el-option v-for="item in metaConfig.api_param_dataType" :key="item.value"
                                   :label="item.label" :value="item.value"/>
                    </el-select>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column label="默认值" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isStep2">{{row.defaultValue}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'defaultValue')" :rules="requiredRule(row,rules.defaultValue)">
                    <el-input v-model="row.defaultValue" placeholder="请输入默认值" size="small"/>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column label="必须" min-width="80" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isStep2">{{row.required}}</span>
                <el-switch v-else v-model="row.required" active-color="#13ce66" inactive-color="#ff4949" size="small"/>
            </template>
        </el-table-column>

        <el-table-column label="描述" min-width="180" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isStep2">{{row.description}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'description')">
                    <el-input v-model="row.description" placeholder="请输入描述" size="small"/>
                </el-form-item>
            </template>
        </el-table-column>

        <!--<el-table-column v-if="!isReadModel" label="操作" fixed="right" width="120" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="deleteParam(scope.$index)">删除</el-button>
            </template>
        </el-table-column>-->
    </el-table>
</template>

<script lang="jsx">
    const rules = {
        position: [{required: true, message: '必填项', trigger: 'change'}],
        dataType: [{required: true, message: '必填项', trigger: 'change'}],
        name: [{required: true, message: '必填项', trigger: 'blur'}],
        defaultValue: [{required: true, message: '必填项', trigger: 'blur'}],
        description: [{required: true, message: '必填项', trigger: 'blur'}],
        afterName: [{required: true, message: '必填项', trigger: 'blur'}],
        afterPosition: [{required: true, message: '必填项', trigger: 'blur'}],
    }

    export default {
        name: "Step2Table",
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            formData: {
                type: Array,
                default: () => ([])
            },
            // 表格是否查看/编辑状态
            isReadModel: {
                type: Boolean,
                default: () => true
            },
        },
        data() {
            return ({
                rules: rules,
                isStep2: true,
            })
        },
        methods: {
            deleteParam(index) {
                this.formData.splice(index, 1)
            },
            //
            getValidateProp(index, prop) {
                return `paramTransConfig.paramMappings.${index}.${prop}`
            },
            // 勾选必填才校验
            requiredRule(item, rule) {
                let c = rule
                if (item.required) {
                    return c
                } else {
                    return {}
                }
            }
        }
    }
</script>

<style scoped lang="less">


    .table {
        // border: 1px solid rgba(193, 197, 207, 0.15) !important;
        line-height: 25px;
    }

</style>

