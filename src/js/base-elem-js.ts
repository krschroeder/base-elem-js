import type { 
    AppendMethod,
    BaseElemStatic,
    CSSActionStates, 
    CSSActionStatesObj,
    EventFn, 
    EventName, 
    FindBy,
    Selector, 
    SelectorElem, 
    SelectorElems,
    SelectorRoot,
    SyntheticEvent 
} from './types';

import BaseStatic from './core/BaseStatic';
import BaseElem from './core/BaseElem';
import { oa } from './core/helpers';
 
type BaseElemFactory = ((selector?: string | SelectorRoot | BaseElem, base?: HTMLElement) => BaseElem) & 
    BaseElemStatic & 
    { BaseElem: typeof BaseElem };

const $be = (selector?: string | SelectorRoot | BaseElem, base?: HTMLElement) => new BaseElem(selector, base);

oa($be, BaseStatic);
$be.BaseElem = BaseElem;

export default $be as BaseElemFactory;
export type { 
    AppendMethod,
    BaseElem, 
    BaseElemFactory,
    BaseElemStatic,
    CSSActionStates, 
    CSSActionStatesObj,
    EventFn, 
    EventName, 
    FindBy,
    Selector,
    SelectorElem as EventElem, 
    SelectorElem,
    SelectorElems,
    SelectorRoot,
    SyntheticEvent
}