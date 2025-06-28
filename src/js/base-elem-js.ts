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

import BaseStatic, {type BaseElemStatic } from './core/BaseStatic';
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
    SelectorRoot,
    BaseElemFactory
};