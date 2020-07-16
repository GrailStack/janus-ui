<template>
    <el-form :model="formData.args" ref="form" label-position="center" label-width="150px" :rules="rules">
        <el-form-item prop="oldUrl" label="旧的URL">
            <el-input v-model="formData.args.oldUrl" placeholder="请输入" size="small"/>
        </el-form-item>
        <el-form-item prop="newURL" label="新的URL">
            <el-input v-model="formData.args.newURL" placeholder="请输入" size="small"/>
        </el-form-item>
    </el-form>
</template>

<script>
    const rules = {
        oldUrl: [{required: true, message: '必填项', trigger: 'blur'}],
        newURL: [{required: true, message: '必填项', trigger: 'blur'}],
    }

    const createNewFormData = () => {
        return {
            args: {
                oldUrl: "",
                newURL: "",
            }
        }
    }
    export default {
        name: "PathMapping",
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