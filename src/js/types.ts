export type FindBy = 'id' | 'class' | 'tag';
export type AppendMethod = 'append' | 'prepend' | 'after' | 'before';
export type ClassOrId = '#' | '.';
export type EventElem = HTMLElement | Document | Window;
export type EventFn = <EE>(ev: any, elem?: EventElem | EE) => void;
export type Selector = string | HTMLElement | HTMLElement[];
export type SyntheticEvent = `[${string}]`;
export type NativeEvent = keyof HTMLElementEventMap;
export type EventName =  `${NativeEvent}.${string}` | NativeEvent | SyntheticEvent;
 

export interface CSSProperties extends CSSStyleDeclaration {
    [key: `--${string}`]: string | null;
}
 
export interface CSSActionStates {
    active: string;
    starting: string;
    ending: string;
}

export type CSSActionStatesObj = Record<keyof CSSActionStates,string>;