type UrlParamsInit = string[][] | Record<string, string> | string | URLSearchParams;
type UpdateUrlType = 'replace' | 'push' | 'replaceHash' | 'pushHash' | 'replaceSearch' | 'pushSearch';
type UpdateType = 'hash' | 'search' | 'object';

interface UrlStateResult {
    params: URLSearchParams;
    updateType: UpdateType;
}

const w = window;

const update = (
    init: UrlParamsInit = w.location.hash, 
    propsToUpdate?: Record<string, string>, 
    updateUrl: UpdateUrlType | 'none' = 'replace'
): UrlStateResult => {
    
    const params = new URLSearchParams(init);
    const updateType = typeof init === 'string' ? 
        init.startsWith('#') ? 'hash' : init.startsWith('?') ? 
        'search' : 'object' : 'object'
    ;
     
    if (propsToUpdate) {
        for (const [key, value] of Object.entries(propsToUpdate)) {
            if (value === null) params.delete(key);
            else params.set(key, value);
        }
    }

    if (updateUrl && updateUrl !== 'none') {

        urlUpdate(updateType, updateUrl, params);
    }

    return {
        params,
        updateType
    };
};

const urlUpdate = (
    updateType: UpdateType, 
    updateUrlType: UpdateUrlType, 
    params: URLSearchParams
): string => {

    const { hash, search, pathname } = w.location;
    const paramsStr = params.toString();
    // const initStr = typeof init === 'string' ? init : '';
    const paramsUrlStr =   
        // if hash then update accordingly
        updateType === 'hash' ? 
        `${search}#${paramsStr}` :  
        // if search then update accordingly
        updateType === 'search' ? 
        `?${paramsStr}${hash}` :  
        // if an object was passed in and we're updating the hash 
        // as specified in the updateUrl parameter
        updateUrlType === 'replaceHash' || updateUrlType === 'pushHash' ? 
        `#${paramsStr}` : 
        // else default to updating the search portion of the URL
        `?${paramsStr}${hash}`
    ;

    const newUrl = `${pathname}${paramsUrlStr}`;

    if (updateUrlType.startsWith('replace')) {
        w.history.replaceState(null, '', newUrl);
    } else if (updateUrlType.startsWith('push')) {
        w.history.pushState(null, '', newUrl);
    }

    return newUrl;
}

const hash = (
    newProps: Record<string, string>, 
    updateType: UpdateUrlType = 'replaceHash'
) => update(window.location.hash, newProps, updateType);

const search = (
    newProps: Record<string, string>, 
    updateType: UpdateUrlType = 'replaceSearch'
) => update(window.location.search, newProps, updateType);

const urlState = {
    update,
    urlUpdate,
    hash,
    search
};

export default urlState;