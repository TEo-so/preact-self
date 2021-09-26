import { enqueueRender } from './component'

export function createContext(defaultValue) {
    const context = {
        _defaultValue:defaultValue,
        Consumer(props, contextValue) {
			return props.children(contextValue);
        },
        Provider(props) {
            // 暂时不接入memo和shouldComponentUpdate
            if (props.value !== context._defaultValue) {
                context._defaultValue = props.value
            }
            return props.children;
        }
    }
    return (context.Provider._contextRef = context.Consumer.contextType = context);
}