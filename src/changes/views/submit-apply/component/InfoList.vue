<template>
    <div class="infoList">
        <div class="infoItem" v-for="(item,index) in changeInfoList" :key="item.sourceName+index">
            <ul class="infos">
                <li>{{item.sourceName}}：</li>
                <li>新增 {{item.addCount}}个，</li>
                <li>删除 {{item.deleteCount}}个，</li>
                <li>修改 {{item.updateCount}}个，</li>
                <li>总数 {{item.totalCount}}个。</li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "HeadInfoList",
        props: {
            changeInfoList: {
                type: Array,
                default: () => []
            }
        }
    }
</script>

<style scoped lang="less">
    .infoList {
        margin-bottom: 15px;
        font-size: 14px;
        line-height: 23px;

        ul.infos {
            display: flex;
            flex-direction: row;


            li {
                display: block;
                /*border: 1px solid red;*/
                margin-right: 3px;
            }

            li:first-child {
                margin-left: 15px;
            }
        }
    }
</style>