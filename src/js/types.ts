export type FindBy = 'id' | 'class' | 'tag';
export type AppendMethod = 'append' | 'prepend' | 'after' | 'before';
// export type NearMethod = 'closest' | 'next' | 'prev' | 'parent';
export type ClassOrId = '#' | '.';
export type SelectorElem = HTMLElement | Document | Window;
export type EventFn = <T extends HTMLElement>(ev: any, elem?: SelectorElem | T, ...args: any[]) => void;
export type MapFn = <T extends HTMLElement>(elem: HTMLElement, i: number) => T | HTMLElement;
export type FilterFn = (elem: HTMLElement, i: number) => boolean;
export type SelectorElems = [Window | Document | HTMLElement] | HTMLElement[];
export type Selector = string | SelectorElems;
export type SelectorRoot = HTMLElement[] | HTMLElement | Window | Document;
export type SyntheticEvent = `[${string}]`;
export type NativeEvents = keyof HTMLElementEventMap;
export type WindowEvents = keyof WindowEventHandlersEventMap;
export type DocEvents = keyof DocumentEventMap;
export type EventName = `${NativeEvents | WindowEvents | DocEvents}.${string}` | NativeEvents | WindowEvents | DocEvents | SyntheticEvent;
export type PlainObject<T> = Record<string, T>;
export type GenericObj = PlainObject<any>;
export type GetType = 
    "undefined" | "object" | "boolean" | 
    "number" | "bigint" | "string" | 
    "symbol" | "function" | "null"
;
  
export type MergeOptions = boolean | 'deep' | 'noNull' | 'noFalsy';

export interface CSSProperties extends CSSStyleDeclaration {
    [key: `--${string}`]: string | null;
}
 
export interface CSSActionStates {
    active: string;
    starting: string;
    ending: string;
}

export type CancelAnimateFn = (cancel: () => void) => void;

export interface BaseElemStatic {
    // Constants
    CSS_ACTION_STATES: CSSActionStatesObj;
    
    // CSS and Class methods
    addClass: (elem: HTMLElement, cssNames: string | string[]) => void;
    rmClass: (elem: HTMLElement, cssNames: string | string[]) => void;
    tgClass: (elem: HTMLElement, cssNames: string | string[], toggle?: boolean) => void;
    hasClass: (elem: HTMLElement, cssNames: string | string[]) => boolean;
    
    // Attribute and CSS methods
    attr: (elem: HTMLElement, attrs: Record<string, string> | string) => string | void;
    css: (elem: HTMLElement, attrs: Partial<CSSProperties> | string) => string;
    
    // CSS Action States
    cssActionStates: (nameSpace: string, baseObj?: CSSActionStatesObj) => CSSActionStatesObj;
    
    // Element manipulation
    empty: (elem: HTMLElement) => void;
    elemRects: (elem: HTMLElement) => DOMRect;
    
    // Element finding
    find: <T extends HTMLElement>(el: string, base?: HTMLElement | Document) => T[];
    findBy: (type: FindBy, find: string, base?: HTMLElement | Document) => HTMLElement[] | HTMLElement | null;
    findOne: <T = HTMLElement>(el: string, base?: HTMLElement | Document) => T;
    
    // Element creation and parsing
    make: <T extends keyof HTMLElementTagNameMap>(
        selector: T | `${T}.${string}` | `${T}#${string}`, 
        propsOrHtml?: Partial<HTMLElementTagNameMap[T]> | string | HTMLElement | HTMLElement[], 
        html?: string | HTMLElement | HTMLElement[]
    ) => HTMLElementTagNameMap[T];
    htmlParse: (htmlStr: string) => ChildNode[];
    
    // Visibility
    isVisible: (el: HTMLElement) => boolean;
    isHidden: (el: HTMLElement) => boolean;
    
    // Array and iteration
    map: <T>(elems: HTMLElement[], fn: (el: HTMLElement, i: number) => T, unique?: boolean) => (HTMLElement | T)[];
    
    // Object utilities
    merge: (configOrTarget: MergeOptions | MergeOptions[] | GenericObj, ...objects: GenericObj[]) => GenericObj;
    
    // DOM traversal
    parents: (elem: HTMLElement, selector: string, untilElem?: HTMLElement | string) => HTMLElement[];
    siblings: (elem: HTMLElement, selector?: string, includeKeyEl?: boolean) => HTMLElement[];
    next: (elem: HTMLElement, selector?: string) => HTMLElement;
    prev: (elem: HTMLElement, selector?: string) => HTMLElement;
    // Type utility
    toType: (object: any) => GetType;
    
    // Event methods
    on: (
        baseEl: SelectorElem,
        evtName: EventName,
        fn: EventFn,
        delegateEl?: string | HTMLElement[],
        config?: boolean | AddEventListenerOptions
    ) => void;
    off: (
        target: SelectorElem,
        evtName: EventName,
        config?: boolean | AddEventListenerOptions
    ) => void;
    trigger: (
        target: HTMLElement | Window | Document,
        evtName: string,
        delegateEl?: string,
        config?: boolean | AddEventListenerOptions
    ) => void;
    
    // Animation utilities
    useTransition: () => (
        startFn: (...args: any) => void,
        endFn: (...args: any) => void,
        duration?: number
    ) => void;
    useCssAnimate: (
        elems: HTMLElement | HTMLElement[],
        baseCss?: string
    ) => [
        (start: boolean, duration?: number, endFn?: () => void) => void,
        CSSActionStates
    ];
    animateByFrame: (fn: CancelAnimateFn, fps: number) => () => void;
    
    // Utility functions
    af: <T>(list: any) => T[];
    isArr: (val: any) => val is any[];
    isStr: (val: any) => val is string;
    oa: <T extends Record<string, any>>(target: T, ...sources: Partial<T>[]) => T;
}

export type CSSActionStatesObj = Record<keyof CSSActionStates,string>;