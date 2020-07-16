<template>
    <el-form :model="formData.args" ref="form" label-position="center" label-width="150px" :rules="rules">
        <el-form-item prop="path" :label="label">
            <div class="inputWrapper">
                <el-input class="pathInput" v-model="formData.args.path" placeholder="请输入" size="small"/>
                <el-popover
                        ref="popover"
                        placement="top"
                        width="300"
                        trigger="hover"
                        :content="tip">
                </el-popover>
                <i v-popover:popover class="el-icon-info"></i>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
    import {FilterTypeEnum} from "../enum";

    const rules = {
        path: [{required: true, message: '必填项', trigger: 'blur'}],
    }

    const createNewFormData = () => {
        return {
            args: {
                path: "",
            }
        }
    }
    export default {
        name: "ModifyPath",
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

            label() {
                let str = {
                    [FilterTypeEnum.PrefixPath]: "路径前缀",
                    [FilterTypeEnum.StripPath]: "前缀位置"
                }[this.filterData.filterCode]
                return str
            },
            tip() {
                let str = {
                    [FilterTypeEnum.PrefixPath]: "加前缀.的提示...",
                    [FilterTypeEnum.StripPath]: "减前缀.的提示..."
                }[this.filterData.filterCode]
                return str
            }
        },
        mounted() {
            this.formData = this.fromFilterParamJson()
            //console.log("????", this.formData)
        },
        methods: {
            fromFilterParamJson() {
                let formData = createNewFormData()
                try {
                    formData = {...formData, ...JSON.parse(this.filterData.filterParam)}
                } catch (e) {
                    console.warn('tranform error?', this.filterData)
                }
                return formData
            },
            toFilterParamJson() {
                return JSON.stringify(this.formData)
            },

        }
    }
</script>

<style scoped lang="less">
    .inputWrapper {

        .pathInput {
            width: calc(100% - 80px);
        }

        .el-icon-info {
            margin-left: 15px;
        }
    }


</style>