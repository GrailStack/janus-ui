<template>
    <div class="stepContainer">
        <div :class="{stepItem:true,finished:i<=index}" v-for="(item ,i ) in steps" :key="i">
            {{item}}
            <span class="arrow"></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "StepBar",
        props: {
            steps: {
                type: Array,
                default: () => []
            },
            index: {
                type: Number,
                default: () => 0
            }
        }
    }
</script>

<style scoped lang="less">
    @step-bk-color: #e7f1f4; //#585f77;
    @step-finished-bk-color: #ff6a00;
    .stepContainer {
        width: 100%;
        height: 35px;
        line-height: 35px;
        background: @step-bk-color;
        display: flex;
        overflow: hidden;

        .stepItem {
            flex: 1;
            text-align: center;
            position: relative;
            color: #ff6a00;
            .arrow {
                border-top: 1px solid #333;
                border-right: 1px solid #333;
                position: absolute;
                right: -14px;
                top: 4.5px;
                height: 24.74873734152916335402955267367px;
                width: 24.74873734152916335402955267367px;
                transform: rotate(45deg);
                z-index: 1;
            }

            &.finished {
                background: @step-finished-bk-color;
                color: #fff;
                .arrow {
                    border-color: #333 !important;
                    background: @step-finished-bk-color
                }
            }


        }
    }
</style>