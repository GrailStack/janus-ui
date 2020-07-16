export const ServiceTypeEnum = {
    DISCOVERY: "DISCOVERY",
    LOAD_BALANCE: "LOAD_BALANCE",
    STRAIGHT_FORWARD: "STRAIGHT_FORWARD"
}


export class apiFormDataUtils {
    static createAPIMetaConfig() {
        return ({
            cluster_codes: [],
            api_protocol: [],
            //
            http_method: [],
            api_param_position: [],//api参数位置
            api_param_dataType: [],//api参数数据类型
            api_paramTransType: [],//请求入参模式：
            //
            API_OutServiceType: [],
            API_OutServiceProtocol: []
        })
    }





    // 创建空的
    static createFormData() {
        return ({
            id: undefined,
            //step1
            name: '',
            clusterCode: "",
            description: '',
            //step2
            protocol: "",
            path: "",
            method: '',
            paramTransType: '',
            paramTransConfig: {
                params: [
                    // this.createStep2Params()
                ]
            },
            //
            outServiceConfig: {
                outServices: [
                    this.createOutServiceItem()
                ]
            },
        })
    }

    // 第二部的param
    static createStep2Params() {
        return {
            "dataType": "",
            "defaultValue": "",

            "description": "",
            "name": "",
            "position": "",
            "required": true
        }
    }

    // 第3步的service
    static createOutServiceItem() {
        return {
            method: "",
            name: "",
            paramTransConfig: {
                paramMappings: [
                    // this.createStep3Params()
                ]
            },
            // path 参数 可能是JSON
            path: "",
            protocol: "",
            type: "",
            uri: "",
            uriList: []
        }
    }


    // 第二步添加params
    static addStep2NewParams(formData) {
        let param = this.createStep2Params()
        formData.paramTransConfig.params.push(param)
        let paramsStep3 = formData.outServiceConfig.outServices[0].paramTransConfig.paramMappings
        paramsStep3.push({
            ...param,
            "afterName": "",
            "afterPosition": "",
        })
    }

    // 第二步删除
    static deleteStep2Param(formData, index) {
        formData.paramTransConfig.params.splice(index, 1)
        let paramsStep3 = formData.outServiceConfig.outServices[0].paramTransConfig.paramMappings;
        paramsStep3.splice(index, 1)
    }

    static checkStep3Data() {
        if (!(formData.outServiceConfig && formData.outServiceConfig.outServices.length)) {
            formData.outServiceConfig = {
                outServices: [
                    this.createOutServiceItem()
                ]
            }
        }
    }

    // step2完成后 到第三步 params数据转换
    static transformAfterStep2(formData) {
        let paramsStep2 = formData.paramTransConfig.params
        let paramsStep3 = formData.outServiceConfig.outServices[0].paramTransConfig.paramMappings;
        // let isInStep2 = findName => paramsStep2.findIndex(param2 => param2.name === findName) !== -1
        let newStep3 = []
        paramsStep2.forEach((step2, index) => {
            let step3 = paramsStep3[index]
            newStep3.push({
                // 如果第三步没有填 就自动填第二步的
                afterName: step3.afterName === '' ? step2.name : step3.afterName,
                afterPosition: step3.afterPosition === '' ? step2.position : step3.afterPosition,
                ...step2,
            })
        })
        formData.outServiceConfig.outServices[0].paramTransConfig.paramMappings = newStep3;
    }


    // 是否table显示的 URI
    static isTableURI(outService) {
        return outService.type === ServiceTypeEnum.LOAD_BALANCE || outService.type === ServiceTypeEnum.STRAIGHT_FORWARD
    }

    // 回显示
    static transformFromData(data) {
        let outService = data.outServiceConfig.outServices[0]
        outService.uriList = []
        if (this.isTableURI(outService)) {
            outService.uriList = JSON.parse(outService.uri)
            outService.uri = ''
        }
        return data
    }

    // 上传
    static transformToParams(formData) {
        let params = JSON.parse(JSON.stringify(formData))
        let outService = params.outServiceConfig.outServices[0]
        if (this.isTableURI(outService)) {
            outService.uri = JSON.stringify(outService.uriList)
            delete outService.uriList
        }
        return params
    }
}