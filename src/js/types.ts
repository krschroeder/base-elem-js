export type FindBy = 'id' | 'class' | 'tag';
export type AppendMethod = 'append' | 'prepend' | 'after' | 'before';
export type ClassOrId = '#' | '.';
export type EventElem = HTMLElement | Document | Window;
export type EventFn = <EE>(ev: any, elem?: EventElem | EE) => void;
export type SelectorElem = HTMLElement | Window | Document;
export type SelectorElems = SelectorElem | HTMLElement[];
export type Selector = string | SelectorElems;
export type SyntheticEvent = `[${string}]`;
export type NativeEvent = keyof HTMLElementEventMap;
export type WindowEvents = keyof WindowEventHandlersEventMap;
export type EventName = `${NativeEvent | WindowEvents}.${string}` | NativeEvent | WindowEvents | SyntheticEvent;
 

export interface CSSProperties extends CSSStyleDeclaration {
    [key: `--${string}`]: string | null;
}
 
export interface CSSActionStates {
    active: string;
    starting: string;
    ending: string;
}

export type CSSActionStatesObj = Record<keyof CSSActionStates,string>;