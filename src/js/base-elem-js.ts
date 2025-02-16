import type { 
    Selector, 
    EventElem, 
    SelectorElem,
    SelectorElems,
    EventFn, 
    EventName, 
    SyntheticEvent, 
    CSSActionStates, 
    CSSActionStatesObj,
    FindBy,
    AppendMethod
} from './types';

import BaseStatic from './core/BaseStatic';
import BaseElem from './core/BaseElem';
 
const $be = (selector?: Selector | BaseElem, base?: HTMLElement) => new BaseElem(selector, base);

$be.static = BaseStatic;
$be.BaseElem = BaseElem;

export default $be;
export type { 
    AppendMethod,
    BaseElem, 
    CSSActionStates, 
    CSSActionStatesObj,
    EventElem, 
    EventFn, 
    EventName, 
    FindBy,
    SyntheticEvent, 
    Selector,
    SelectorElem,
    SelectorElems
};