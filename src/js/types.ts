export type FindBy = 'id' | 'class' | 'tag';
export type AppendMethod = 'append' | 'prepend' | 'after' | 'before';
export type ClassOrId = '#' | '.';
export type SelectorElem = HTMLElement | Document | Window;
export type EventFn = <EE>(ev: any, elem?: SelectorElem | EE) => void;
// export type SelectorElem = [Window] | [Document];
export type SelectorElems = [Window | Document | HTMLElement] | HTMLElement[];
export type Selector = string | SelectorElems;
export type SelectorRoot = HTMLElement[] | HTMLElement | Window | Document;
export type SyntheticEvent = `[${string}]`;
export type NativeEvents = keyof HTMLElementEventMap;
export type WindowEvents = keyof WindowEventHandlersEventMap;
export type DocEvents = keyof DocumentEventMap;
export type EventName = `${NativeEvents | WindowEvents | DocEvents}.${string}` | NativeEvents | WindowEvents | DocEvents | SyntheticEvent;
 

export interface CSSProperties extends CSSStyleDeclaration {
    [key: `--${string}`]: string | null;
}
 
export interface CSSActionStates {
    active: string;
    starting: string;
    ending: string;
}

export type CSSActionStatesObj = Record<keyof CSSActionStates,string>;