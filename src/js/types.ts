export type FindBy = 'id' | 'class' | 'tag';
export type AppendMethod = 'append' | 'prepend' | 'after' | 'before';
export type ClassOrId = '#' | '.';
export type EventElem = HTMLElement | Document | Window;
export type EventFn = (ev: any, elem?: EventElem) => void;
export type Selector = string | HTMLElement | HTMLElement[];

export interface CSSProperties extends CSSStyleDeclaration {
    [key: `--${string}`]: string | null;
}

export interface CSSActionStates {
    active: string;
    starting: string;
    ending: string;
}

export type CSSActionStatesObj = Record<keyof CSSActionStates,string>;