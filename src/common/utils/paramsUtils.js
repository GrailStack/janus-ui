export function deleteUndefinedParams(params) {
    let p = JSON.parse(JSON.stringify(params)) || {}
    let out = {}
    Object.keys({...p}).forEach(key => {
        let val = p[key]
        if (val !== null && val !== undefined) {
            out[key] = val
        }
    })
    return out
}


export function pick(object, props) {
    let out = {}
    props = props ? props : Object.keys(object)
    props.forEach(key => {
        out[key] = JSON.parse(JSON.stringify(object[key]))
    })
    return out
}