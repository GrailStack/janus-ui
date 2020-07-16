import $axios from "../../../api";

export class MetaUtils {

    static async loadOptions(keys){
       return await $axios.post('/admin/metadata/queryMultiDict',{dictCodes:keys})|| {}
    }

    /*static async loadOptions1(keys) {
        let rawData = await $axios({
            url: '/admin/metadata/list',
            method: 'post',
            data: {
                searchKeys: keys
            },
        })
        rawData = rawData || {}
        keys.forEach(key => {
            rawData[key] = this._getOptions(rawData, key)
        })
        return rawData
    }

    // 从元数据里取options 一定是数组
    static _getOptions(rawData, key) {
        let option = (rawData[key] || [])[0] || {}
        let list = option.dictDataModelList || []
        let items = list.sort((a, b) => a.itemSort < b.itemSort)
        return items
    }*/

    //
    static defaultTransform = _ => ({..._, label: _.itemName, value: _.itemValue})

    static useNameTranfrom = _ => ({..._, label: _.itemName, value: _.itemName})

    static useValueTranfrom = _ => ({..._, label: _.itemValue, value: _.itemValue})

    // 从metadata里取出item来，转成{value:,label }形式
    static transformOptionsFrom(config, keys, tranformFn) {
        tranformFn = tranformFn ? tranformFn : this.defaultTransform
        keys.forEach(key => {
            config[key] = (config[key] || []).map(tranformFn)
        })
        return config
    }


    // 根据[{value,label}]获得显示label
    static optValueToLabelOf(options, value) {
       // debugger
        let opt = (options || []).find(_ => "##" + _.value === "##" + value)
        return opt ? opt.label : "?< " + value + " >?"
    }

}