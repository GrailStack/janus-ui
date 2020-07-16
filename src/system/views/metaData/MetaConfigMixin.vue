<template>

</template>

<script>
    import {MetaUtils} from "./metaUtils";

    export default {
        name: "MetaConfigMixin",
        data() {
            return {
               // metaConfig: {}
            }
        },
        methods: {
            async loadConfig() {
                let keys = Object.keys(this.metaConfig)
                let config = await MetaUtils.loadOptions(keys)
                MetaUtils.transformOptionsFrom(config, keys)
                this.metaConfig = config
            },
            // 根据config[key]里的options取出等于value的opt显示其label
            optValueToLabelOf(metaKey, value) {
                return MetaUtils.optValueToLabelOf(this.metaConfig[metaKey], value)
            },
        }
    }
</script>

<style scoped>

</style>