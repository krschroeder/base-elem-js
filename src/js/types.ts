export type FindBy = 'id' | 'class' | 'tag';
export type AppendMethod = 'append' | 'prepend' | 'after' | 'before';
// export type NearMethod = 'closest' | 'next' | 'prev' | 'parent';
export type ClassOrId = '#' | '.';
export type SelectorElem = HTMLElement | Document | Window;
export type EventFn = <T extends HTMLElement>(ev: any, elem?: SelectorElem | T) => void;
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

export type CSSActionStatesObj = Record<keyof CSSActionStates,string>;