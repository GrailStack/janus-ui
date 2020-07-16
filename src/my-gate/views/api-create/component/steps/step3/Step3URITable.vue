<template>
    <el-table class="table" :data="formData" :height="undefined" style="width: 100%;">
        <el-table-column label="地址:" min-width="120" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isReadModel">{{row.host}}</span>

                <el-form-item v-else :prop="getValidateProp($index,'host')" :rules="rules.host">
                    <el-input v-model="row.host" placeholder="host" size="small"/>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column label="端口" min-width="50" align="center">
            <template slot-scope="{row,$index}">
                <span v-if="isReadModel">{{row.port}}</span>
                <el-form-item v-else :prop="getValidateProp($index,'port')" :rules="rules.port">
                    <el-input v-model="row.port" placeholder="port" size="small"/>
                </el-form-item>
            </template>
        </el-table-column>

        <el-table-column v-if="!(isReadModel || onlyOneItem)" label="操作" fixed="right" width="120" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="mini" @click="deleteParam(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script lang="jsx">
    const rules = {
        host: [{required: true, message: '必填项', trigger: 'change'}],
        port: [{required: true, message: '必填项', trigger: 'change'}],
    }

    export default {
        name: "Step3URITable",
        props: {
            metaConfig: {
                type: Object,
                default: () => ({})
            },
            formData: {
                type: Array,
                default: () => ([])
            },
            // 是否只有一条
            onlyOneItem: {
                type: Boolean,
                default: () => true
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
                return `uriList.${index}.${prop}`
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
        line-height: 25px;
    }
</style>

