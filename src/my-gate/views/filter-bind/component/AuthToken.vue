<template>
    <el-form :model="formData.args" ref="form" label-position="center" label-width="150px" :rules="rules">
        <el-form-item prop="tokenServiceName" label="token服务名">
            <el-input v-model="formData.args.tokenServiceName" placeholder="请输入" size="small"/>
        </el-form-item>
        <el-form-item prop="tokenServicePath" label="token服务路径">
            <el-input v-model="formData.args.tokenServicePath" placeholder="请输入" size="small"/>
        </el-form-item>
    </el-form>
</template>

<script>
    const rules = {
        tokenServiceName: [{required: true, message: '必填项', trigger: 'blur'}],
        tokenServicePath: [{required: true, message: '必填项', trigger: 'blur'}],
    }

    const createNewFormData = () => {
        return {
            args: {
                tokenServiceName: "",
                tokenServicePath: "",
            }
        }
    }
    export default {
        name: "AuthToken",
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
        computed: {},
        mounted() {
            this.formData = this.fromFilterParamJson()
            console.log(this.formData)
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

        }
    }
</script>

<style scoped>

</style>