 import type {
    EventFn,
    EventName,
    FindBy,
    GenericObj,
    GetType,
    MergeOptions,
    CSSActionStates,
    CSSActionStatesObj,
    CSSProperties,
    SelectorElem
} from '../types';

import { af, body, root, d, isArr, isStr, oa } from './helpers';


type EventCache = Map<string,EventFn>;
const eventFnCache:WeakMap<SelectorElem,EventCache> = new WeakMap();

const cssSplitRgx = /([\.\#][\w-_\s]+)/g;

const 
    // region Props
    CSS_ACTION_STATES = Object.freeze({
        active:     'active',
        starting:   'starting',
        ending:     'ending'
    }) as CSSActionStatesObj,
    
    cssActionStates = (nameSpace: string, baseObj: CSSActionStatesObj = CSS_ACTION_STATES):CSSActionStatesObj => {
        const retObj = {};
        const prefix = nameSpace ? nameSpace + '-' : '';

        for (const key in baseObj) {
            if (Object.hasOwn(baseObj, key)) {

                Object.assign(retObj, {
                    [key]: prefix + baseObj[key as keyof CSSActionStates]
                });
            }
        }
        return retObj as CSSActionStatesObj;
    },  
    // 
    // region Finding Elems
    // 
    findBy = (type:FindBy, find: string, base: HTMLElement | Document = d) => {

        if (type === 'class') return af(base.getElementsByClassName(find)) as HTMLElement[];
        if (type === 'id')    return d.getElementById(find) as HTMLElement;
        if (type === 'tag')   return af(base.getElementsByTagName(find)) as HTMLElement[];

        return null;
    },

    find = <T extends HTMLElement>(el: string, base: HTMLElement | Document = d): T[] =>  {
        return af(base.querySelectorAll(el));
    },
    
    findOne = <T = HTMLElement>(el: string, base: HTMLElement | Document = d): T => {
        return base.querySelector(el) as T;
    },

    map = <T>(elems: HTMLElement[], fn: (el: HTMLElement, i:number) => T, unique: boolean = false): (HTMLElement | T)[] => {
        let i = 0, elem, prevRes;
        const retElems:(T | HTMLElement)[] = [];
        while (elem = elems[i]) {
            const res = fn(elem, i++);

            if (!res) continue; // only truthy value
           
            if (unique) {
                if (res !== prevRes || !elems.find(el => el === res)) retElems.push(res);
                prevRes = res;
            } else retElems.push(res);
        }  
        return retElems; 
    },

    parents = (elems: HTMLElement[], selector: string, untilElem?: HTMLElement | string): HTMLElement[] => {
        const untilIsStr = isStr(untilElem);
        const retElems: HTMLElement[] = [];
        
        map(elems as HTMLElement[], elem => {
                while (elem = elem.parentElement) {
                    if (elem.matches(selector)) {
                        if (untilElem) retElems.unshift(elem);
                        else return elem;
                    }
                    
                    if ( untilElem &&
                        untilIsStr ? elem.matches(untilElem) : elem === untilElem || 
                        elem === root
                    ) break;
                }
                return retElems;
            }
        );

        return retElems;
    },

    // 
    // region CSS and Attrs
    // 
    attr = (elem: HTMLElement, attrs: Record<string,string> | string) => {

        if (isStr(attrs)) {
            if (attrs === 'value') return (elem as HTMLInputElement).value;
            return elem.getAttribute(attrs);
        } else {
            for ( const key in attrs ) {
                const val = attrs[key];
                val === null ? 
                    elem.removeAttribute(key) : 
                    elem.setAttribute(key, val);
            }
        }
    },

    css = (elem: HTMLElement, attrs: Partial<CSSProperties> | string): string => {

        if (isStr(attrs)) {  
            const styles = getComputedStyle(elem); 
            return styles.getPropertyValue(attrs);
        } else {
            
            for ( const key in <CSSProperties>attrs ) {
                const val = (attrs as CSSProperties)[key as any];
                
                if (key.startsWith('--')) {
                    elem.style.setProperty(key, val);
                } else {
                    
                    elem.style[key as any] = val;
                }
            }
        }

        return '';
    },

    addClass = (elem: HTMLElement, cssNames: string | string[]) => {
        isArr(cssNames) ?
            elem.classList.add(...cssNames):
            elem.classList.add(cssNames);
    },

    rmClass = (elem: HTMLElement, cssNames: string | string[]) => {
        isArr(cssNames) ?
            elem.classList.remove(...cssNames):
            elem.classList.remove(cssNames);
    },
    
    tgClass = (elem: HTMLElement, cssNames: string | string[], toggle?: boolean) => {
        if (isArr(cssNames)) {
            for (const cssName of cssNames) {
                elem.classList.toggle(cssName, toggle);
            }
        } else {
            elem.classList.toggle(cssNames, toggle);
        }
    },

    hasClass = (elem: HTMLElement, cssNames: string | string[]): boolean => {
        if (isArr(cssNames)) {
            return cssNames.every(cls => elem.classList.contains(cls));
        }

        return elem.classList.contains(cssNames);
    },

    elemRects = (elem: HTMLElement) => {
        return elem.getBoundingClientRect();
    },

    // 
    // region Element Creation / Removal
    // 
    make = <T extends keyof HTMLElementTagNameMap>(
        selector: T | `${T}.${string}` | `${T}#${string}`, 
        propsOrHtml: Partial<HTMLElementTagNameMap[T]> | string = {}, 
        html?: string): HTMLElementTagNameMap[T] => {   
        const
            [tag, ...attrs] = selector.split(cssSplitRgx),
            baseAttrs   = getTagAttrs (attrs),
            propsIsStr  = isStr(propsOrHtml),
            elem        = oa(d.createElement(tag), oa(baseAttrs, propsIsStr ? {} : propsOrHtml)) as HTMLElementTagNameMap[T],
            htmlToUse   = propsIsStr && !html ? propsOrHtml : (html ? html : '')
        ;
 
        if (htmlToUse) elem.append(...htmlParse(htmlToUse));
    
        return elem;
    },

    htmlParse = (htmlStr: string ): ChildNode[] => {
  
        const root = (new DOMParser()).parseFromString(htmlStr, 'text/html').body;
        // remove scripts, even though they're non-exectable with the DOMParser
        const scripts = find('script',root);
        if (scripts) scripts.forEach(s => s.remove());
        const elList = af(root.childNodes);
        return elList;
    },

    empty = (elem: HTMLElement) => {
        while(elem.firstChild) {
            elem.removeChild( elem.firstChild)
        }
    },

    toType = (object: any): GetType => ({}).toString.call(object).match(/\s([a-zA-Z]+)/)[1].toLowerCase(),
    
    merge = (configOrTarget: MergeOptions | MergeOptions[] | GenericObj, ...objects: GenericObj[]) => {
        const options: MergeOptions[] = 
            isArr(configOrTarget) ? configOrTarget : 
            toType(configOrTarget) === 'string' || toType(configOrTarget) === 'boolean' ? [configOrTarget]: [],
            // end options;

            hasOptions  = options.length > 0,
            getOpt      = (configOpt) => hasOptions ? options.some(opt => opt === configOpt) : false,
            deep        = getOpt('deep') || getOpt(true),
            noNull      = getOpt('noNull'),
            noFalsy     = getOpt('noFalsy'),
            target      = hasOptions ? objects.shift() : configOrTarget as GenericObj
        ;
        
        let mergeObj: GenericObj, i = 0;
    
        while (mergeObj = objects[i++]) {
            for (const key in mergeObj) {
                const value = mergeObj[key];
                if (deep && toType(value) === 'object') merge(options, target[key], value);
                else {
                    target[key] = value;
                    
                    if ((noNull && value === null) || (noFalsy && !value)) {
                        delete target[key];
                    }
                }
            }
        }
    
        return target;
    },

    // 
    // region Event
    // 
    on = (
        baseEl: SelectorElem = body,
        evtName: EventName, 
        fn: EventFn, 
        delegateEl: string | HTMLElement[] = null,
        config: boolean | AddEventListenerOptions = false
    ): void => {
        const evt = evtName.split('.')[0];
        const evtFn = (e: Event) => {
            if (delegateEl && baseEl instanceof HTMLElement) {
                
                const delegateElems = isStr(delegateEl) ? find(delegateEl, baseEl) : delegateEl;
                // if isTrusted then its a native click
                const elTarget = e.isTrusted ? e.target : (e['__synthTarget'] ?? e.target);
                const delegateElem = getDelegatedElem(baseEl, delegateElems, elTarget);
                
                if (delegateElem) fn(e, delegateElem);
            } else {
                fn(e, baseEl);
            }
        };

        if (eventFnCache.has(baseEl)) {
            eventFnCache.get(baseEl).set(evtName, evtFn)
        } else {
            eventFnCache.set(baseEl, new Map([[evtName, evtFn]]));
        }
        
        baseEl.addEventListener(evt, evtFn, config);
    },
   
    off = (
        target: SelectorElem = body,
        evtName: EventName, 
        config: boolean | AddEventListenerOptions = false
    ): void => {
        if (eventFnCache.has(target)) {
            const 
                tgtFnMap = eventFnCache.get(target),
                evt = evtName.split('.')[0],
                fn = tgtFnMap.get(evtName)
            ;

            target.removeEventListener( evt, fn, config);
            tgtFnMap.delete(evtName);
        }
    },

    trigger = (
        target: HTMLElement | Window | Document = body,
        evtName: string,
        delegateEl: string = null,
        config: boolean | AddEventListenerOptions = false
    ) => {
        const delegateEls = delegateEl ? find(delegateEl, target instanceof Window ? body : target) : null; 
        if (delegateEls && delegateEls.length === 0) return;
        

        const [evt, nameSpace = ''] = evtName.split('.');
        if (nameSpace && eventFnCache.has(target)) {
            const fn = eventFnCache.get(target).get(evtName);
            if (fn) {
                const evt = new Event(evtName);
                oa(evt, {__synthTarget: delegateEls[0]});
                target.addEventListener(evtName, fn, config);
                target.dispatchEvent(evt);
                target.removeEventListener(evtName, fn, config)
            }
            
        } else {
            target.dispatchEvent(new Event(evtName));
        }
    },

    // 
    // region Transition
    // 
    useTransition = () => {
        let inTransition = false;
        let tto: ReturnType<typeof window.setTimeout> = null;
        let currEndTransitionFn = () => {};
    
        return (
            startFn: (...args: any) => void, 
            endFn: (...args: any) => void, 
            duration: number = 300
        ) => {
            
            if (inTransition) {
                currEndTransitionFn();
                clearTimeout(tto);
            }
    
            startFn();
    
            currEndTransitionFn = endFn;
    
            inTransition = true;
            tto = setTimeout(() => {
                currEndTransitionFn();
    
                inTransition = false;
            }, duration)
        }
    },

    useCssAnimate = (elems: HTMLElement | HTMLElement[], baseCss: string = '' ): [
        (start: boolean, duration?: number, endFn?: () => void) => void,
        CSSActionStates
    ] => {
        const transition = useTransition();
       
        const cssState = cssActionStates(baseCss);
        
        const cssAnimate = (start: boolean, duration: number = 400, endFn: () => void = () => {}) => {
            
            const cssTarget = start ? cssState.starting : cssState.ending;
            const startAnimate = (elem: HTMLElement) => {
                elem.offsetHeight;//reflow
                addClass(elem, cssTarget);
                rmClass(elem, cssState.active);
            }
            const endAnimate = (elem: HTMLElement) => {
                rmClass(elem, cssTarget);
                tgClass(elem,cssState.active, start);
            }

            transition(() => {
                isArr(elems) ? 
                elems.forEach(startAnimate) : 
                startAnimate(elems);
            }, () => {
                isArr(elems) ? 
                elems.forEach(endAnimate) : 
                endAnimate(elems);
                endFn();
            }, duration);
        };
        
        return [
            cssAnimate,
            cssState
        ];
    },
    isVisible = (el: HTMLElement): boolean => {
        const vis = 
            el.offsetParent !== null ||
            !!(el.offsetWidth ||
            el.offsetHeight ||
            el.getClientRects().length)
        ; 
    
        return vis;
    },
    isHidden = (el: HTMLElement): boolean => !isVisible(el)
;

// 
// Helpers
// 

const getTagAttr = (attrList: string[], rm: '.' | '#') => attrList.filter(e => e.startsWith(rm)).map(e => e.substring(1));
const getTagAttrs = (attrList: string[]) => {
    
    const 
        attrs = {},
        classes = getTagAttr(attrList, '.'),
        id = getTagAttr(attrList, '#')
    ;

    for (const val of attrList) {
        if (classes.length) oa(attrs,{className: classes.join(' ')});
        if (id.length) oa (attrs, {id: id[0]});
    }
    return attrs;
}

 

const getDelegatedElem = (
    baseElem: HTMLElement, 
    delegateElems: HTMLElement[] | null, 
    evtTarget: HTMLElement
): HTMLElement => {
    let i = 0, rootEl = null;
   
    while (rootEl = delegateElems[i++] as HTMLElement) {
         
        if (evtTarget === rootEl) return rootEl;
        let currentElement = evtTarget.parentElement;
        
        while (currentElement) {
            if (currentElement === rootEl) return rootEl;
            if (baseElem === currentElement) {
                currentElement = null;
                continue;
            }
        
            currentElement = currentElement.parentElement;
        }
    }
    // }

    return null;
}

const BaseStatic = {
    CSS_ACTION_STATES,
    addClass,
    attr,
    css,
    cssActionStates,
    empty,
    find,
    findBy,
    findOne,
    hasClass,
    htmlParse,
    isVisible,
    isHidden,
    make,
    map,
    merge,
    parents,
    toType,
    elemRects,
    off,
    on,
    trigger,
    rmClass,
    tgClass,
    useTransition,
    useCssAnimate
};

export default BaseStatic;