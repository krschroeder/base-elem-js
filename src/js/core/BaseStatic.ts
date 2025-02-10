 import type {
    FindBy,
    AppendMethod,
    ClassOrId,
    EventFn,
    Selector,
    CSSActionStates,
    CSSActionStatesObj,
    CSSProperties
} from '../types';
 

// Dom shortcuts
const 
    d = document,
    oa = Object.assign,
    isArr = Array.isArray
;

const eventFunctionCache: Map<string, EventFn> = new Map();
 
const 
    // Props
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
    // Finding Elems
    // 
    findBy = (type:FindBy, find: string, base: HTMLElement | Document = d)=> {

        if (type === 'class') return Array.from(base.getElementsByClassName(find)) as HTMLElement[];
        if (type === 'id')    return d.getElementById(find) as HTMLElement;
        if (type === 'tag')   return Array.from(base.getElementsByTagName(find)) as HTMLElement[];

        return null;
    },

    find = <T extends HTMLElement>(el: string, base: HTMLElement | Document = d): T[] =>  {
        return Array.from(base.querySelectorAll(el));
    },
    
    findOne = <T = HTMLElement>(el: string, base: HTMLElement | Document = d): T => {
        return base.querySelector(el) as T;
    },

    // 
    // CSS and Attrs
    // 
    attr = (elem: HTMLElement, attrs: Record<string,string> | string) => {

        if (typeof attrs === 'string') {
            return elem.getAttribute(attrs);
        } else {

            for ( const key in attrs ) {
                const val = attrs[key];
                if (val === null) {
                    elem.removeAttribute(key)
                } else {
    
                    elem.setAttribute(key, attrs[key])
                }
            }
        }
    },

    css = (elem: HTMLElement, attrs: Partial<CSSProperties> | string) => {

        if (typeof attrs === 'string') {  
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

    offset = (elem: HTMLElement) => {
        return elem.getClientRects()[0];
    },

    // 
    // Element Creation / Removal
    // 
    make = <K extends keyof HTMLElementTagNameMap>(
        selector: K | `${K}.${string}` | `${K}#${string}`, 
        props: Partial<HTMLElementTagNameMap[K]> = {}, 
        html?: string): HTMLElementTagNameMap[K] => {   
        const
            tagName = selector.split(/(\#|\.)/)[0],
            className = getCssAttr(selector, '.', '#'),
            id = getCssAttr(selector, '#', '.'),
            baseObj = rmObjectNullVals({className, id}),
            elem = oa(d.createElement(tagName), oa(baseObj, props)) as HTMLElementTagNameMap[K]
        ;

        if (html) {
            elem.append(...htmlParse(html));
        }
    
        return elem;
    },

    htmlParse = (htmlStr: string, ): ChildNode[] => {
  
        const doc = (new DOMParser()).parseFromString(htmlStr, 'text/html');
        const elList = Array.from(doc.body.childNodes);
    
        // remove scripts, even though they're non-exectable with the DOMParser
        return elList.filter(el => el.nodeName.toLowerCase() !== 'script');
    },

    empty = (elem: HTMLElement) => {
        while(elem.firstChild) {
            elem.removeChild( elem.firstChild)
        }
    },

    // 
    // Event
    // 
    on = (
        baseEl: HTMLElement | Window = document.body,
        evtName: `${Event['type']}.${string}` | string, 
        fn: EventFn, 
        delegateEl: string = null,
        config: boolean | AddEventListenerOptions = false
    ): void => {
        const evt = evtName.split('.')[0] as Event['type'];
        const evtFn = (e: Event) => {
            if (delegateEl && baseEl instanceof HTMLElement) {
                
                const delegateElems = baseEl.querySelectorAll(delegateEl);
                const delegateElem = getDelegatedElem(baseEl, delegateElems, e.target as HTMLElement);
                
                if (delegateElem) fn(e, delegateElem);
               
            } else {
                fn(e);
            }
        };

        eventFunctionCache.set(evtName, evtFn );
        
        baseEl.addEventListener(evt, evtFn, config);
    },
  
    off = (
        target: HTMLElement | Window = document.body,
        evtName: string, 
        config: boolean | AddEventListenerOptions = false
    ): void => {

        const eventNamesToRm = evtName.split(' ').filter(e => e);

        for (const eventNameToRm of eventNamesToRm) {
            if (eventFunctionCache.has(eventNameToRm)) {
               
                target.removeEventListener(
                    eventNameToRm.split('.')[0], 
                    eventFunctionCache.get(eventNameToRm),
                    config
                );
        
                eventFunctionCache.delete(eventNameToRm);
            }
        }
    },
    // 
    // Transition
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

const getCssAttr = (styleStr: string, find: ClassOrId, rm: ClassOrId): null | string => {
    const styleProp = styleStr.indexOf(find) !== -1 ? styleStr.split(find)[1] : null;

    if (!styleProp) return null;
    const rmIndex = styleProp.indexOf(rm);
    return rmIndex !== -1 ? styleProp.substring(0, rmIndex) : styleProp;
}

const rmObjectNullVals = (obj: Record<string, string>) => {
    const retObj = {};

    for (const key in obj) {
        const val = obj[key];
        if (val !== null) Object.assign(retObj, {[key]: val});
    }
   
    return retObj;
}

const getDelegatedElem = (
    baseElem: HTMLElement, 
    delegateElems: NodeListOf<Element> | null, 
    clickEl: HTMLElement
): HTMLElement => {
    if (delegateElems.length) {
        const rootElems = Array.from(delegateElems);
        
        for(let i = 0, l = rootElems.length; i < l; i++) {
            const rootEl = rootElems[i] as HTMLElement;
            if (clickEl === rootEl) return rootEl;
            let currentElement = clickEl.parentElement;
            
            while (currentElement) {
                if (currentElement === rootEl) return rootEl;
                if (baseElem === currentElement) {
                    currentElement = null;
                    continue;
                }
            
                currentElement = currentElement.parentElement;
            }
        }
    }

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
    offset,
    off,
    on,
    rmClass,
    tgClass,
    useTransition,
    useCssAnimate
};

export default BaseStatic;