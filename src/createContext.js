import { enqueueRender } from './component'

export function createContext(defaultValue) {
    const context = {
        _defaultValue: defaultValue,
        _provider:null, // Provider 的实例
        Consumer(props, contextValue) {
			return props.children[0](contextValue);
        },
        Provider(props) {
            // 暂时不接入memo和shouldComponentUpdate
            let subs = []
            context._provider = this
            if (props.value !== context._defaultValue) {
                context._defaultValue = props.value
            }
            // 更新value会执行
            this.shouldComponentUpdate = function (_props) {
                if (this.props.value !== _props.value) {
                    subs.some(enqueueRender)
                }
            }
            // 初始化Provider也会初始化该函数，从而让Consumers调用

            this.sub = c => {
                console.log('会执行provider sub函数吗')
                subs.push(c)
                let old = c.componentWillUnmount
                c.componentWillUnmount = () => {
                    // 如果某一个consumer c 会被卸载，那么他也不应该在Provider的subs当中，不用再执行enqueueRender
                    subs.splice(subs.indexOf(c), 1)
                    if(old) old.call(c)
                }

            }

            return props.children[0];
        }
    }
    return (context.Provider._contextRef = context.Consumer.contextType = context);
}