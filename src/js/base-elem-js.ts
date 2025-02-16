import type { 
    Selector, 
    SelectorElem, 
    SelectorElems,
    SelectorRoot,
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
 
const $be = (selector?: string | SelectorRoot | BaseElem, base?: HTMLElement) => new BaseElem(selector, base);

$be.static = BaseStatic;
$be.BaseElem = BaseElem;

export default $be;
export type { 
    AppendMethod,
    BaseElem, 
    CSSActionStates, 
    CSSActionStatesObj,
    SelectorElem as EventElem, 
    EventFn, 
    EventName, 
    FindBy,
    SyntheticEvent, 
    Selector,
    SelectorElem,
    SelectorElems,
    SelectorRoot
};