import { GetType } from "../types";

// Dom shortcuts
const 
    w       = window,
    d       = document,
    body    = d.body,
    root    = d.documentElement,
    toType = (object: any): GetType => ({}).toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase(),
    oa      = Object.assign,
    af      = Array.from,
    isArr   = Array.isArray,
    isStr = (str: any) => typeof str === 'string',
    isObj = (obj: any) => toType(obj) === 'object'
;

export {
    w,
    d, 
    body,
    root,
    toType,
    oa, 
    af, 
    isArr, 
    isStr,
    isObj
}