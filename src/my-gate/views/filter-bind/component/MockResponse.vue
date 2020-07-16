<template>
    <el-form :model="formData.args" ref="form" label-position="center" label-width="150px" :rules="rules">
        <el-form-item prop="mock" label="mock">
            <!--<el-input class="mockInput" type="textarea" v-model="formData.args.mock" placeholder="请输入" size="small"/>-->
            <codemirror
                    ref="myCm"
                    v-model="formData.args.mock"
                    :options="cmOptions"
                    class="code"
            ></codemirror>
        </el-form-item>
    </el-form>
</template>

<script>
    import {FilterTypeEnum} from "../enum";

    import {codemirror} from 'vue-codemirror'
    // require styles
    import 'codemirror/lib/codemirror.css'
    import 'codemirror/theme/darcula.css'


    import 'codemirror/mode/javascript/javascript'

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


    const rules = {
        mock: [{required: true, message: '必填项', trigger: 'blur'}],
    }

    const createNewFormData = () => {
        return {
            args: {
                mock: "",
            }
        }
    }
    export default {
        name: "MockResponse",
        components: {codemirror},
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
                cmOptions: {
                    // codemirror options
                    tabSize: 4,
                    mode: 'application/json',
                    theme: 'darcula',
                    lineNumbers: true,
                    line: true,
                    styleActiveLine: true,
                    matchBrackets: true,
                }
            })
        },
        computed: {},
        mounted() {
            this.formData = this.fromFilterParamJson()
            console.log("????", this.formData)
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
            tabActive() {
                Array.from(document.querySelectorAll('.CodeMirror textarea')).forEach(dom => {
                    dom.focus();
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .inputWrapper {

        .mockInput {
            width: calc(100% - 80px);
        }

        .el-icon-info {
            margin-left: 15px;
        }
    }

    .code {
        font-size: 12px;
        line-height: 22px
    }

</style>