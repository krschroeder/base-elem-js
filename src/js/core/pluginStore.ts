
// store for managing plugins being installed
type PluginFunction = (...args: any[]) => any;
const plugins: WeakMap<Element, PluginFunction[]> = new WeakMap();

const pluginStore = {
    add(elem: Element, plugin: PluginFunction) {
        const set = plugins.get(elem);
        let elementPlugins = set || [];
        elementPlugins.push(plugin);
        if (!set) {
            plugins.set(elem, elementPlugins);
        }
    },
    rm(elem: Element, pluginName: string) {
        let elementPlugins = plugins.get(elem) || [];

        for (let i = 0, l = elementPlugins.length; i < l; i++) {
            if (elementPlugins[i].name === pluginName) {
                elementPlugins.splice(i, 1);
                break;
            }
        }
    },
    get(elem: Element) {
        return plugins.get(elem) || [];
    }
};



export default pluginStore;