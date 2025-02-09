import type { Selector } from './types';

import BaseStatic from './core/BaseStatic';
import BaseElem from './core/BaseElem';

const be = (selector?: Selector, base?: HTMLElement) => new BaseElem(selector, base);

be.static = BaseStatic;

export default be;