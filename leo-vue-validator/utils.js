
const class2type = {}
"Boolean Number String Function Array Date RegExp Object".split(" ").forEach((name) => {
    class2type["[object " + name + "]"] = name.toLowerCase()
})

const toString = Object.prototype.toString
export function type(obj) {
    return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
}

export function extend() {
    let options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false

    if(typeof target === "boolean") {
        deep = target
        target = arguments[i] || {}
        i++
    }

    if(typeof target !== "object" && type(target) !== 'function') {
        target = {}
    }

    if(i === length) {
        target = this
        i--
    }

    for(; i < length; i++) {
        if((options = arguments[i]) != null) {
            for(name in options) {
                src = target[name]
                copy = options[name]
                if(target === copy) {
                    continue
                }
                if(deep && copy && ((type(copy) === 'object') ||
                    (copyIsArray = Array.isArray(copy)))) {
                    if(copyIsArray) {
                        copyIsArray = false
                        clone = src && Array.isArray(src) ? src : []
                    }else {
                        clone = src && (type(src) === 'object') ? src : {}
                    }
                    target[name] = extend(deep, clone, copy)
                }else if(copy !== undefined) {
                    target[name] = copy
                }
            }
        }
    }
    return target
}

export function isPromise(val) {
    if (val && val.then && type(val.then) === 'function') {
        return true
    }
    return false
}