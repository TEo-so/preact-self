import {options} from './options'
// 定义几个全局变量
let currentIndex
let currentComponent
// let currentHook = 0   // 代码里currentHook用数字为hook标识类型
let afterPaintEffects = []
let oldBeforeRender = options._render
let originalDiffed = options._diffed
let oldCommit = options._commit

options._render = (vnode) => {
    if (oldBeforeRender) oldBeforeRender()
    currentComponent = vnode._component
    currentIndex = 0
    const hooks = currentComponent._hooks
    if (hooks) {
		hooks._pendingEffects.forEach(invokeCleanup);
		hooks._pendingEffects.forEach(invokeEffect);
		hooks._pendingEffects = [];
	}
}

options._diffed = (vnode) => {
    if (originalDiffed) originalDiffed()
    const c = vnode._component
    if (c && c._hooks && c._hooks._pendingEffects) {
        afterPaintEffects.push(c)
        afterPaint(flushAfterPaintEffects)
    }
}

// 处理hooks的同步执行 useLayoutEffect
// 为了和useEffect行为一致
options._commit = (vnode, commitQueue) => {
    commitQueue.some(component => {
        try {
            component._renderCallbacks.forEach(invokeCleanup)
            component._renderCallbacks = component._renderCallbacks.filter(cb => cb._value ? invokeEffect(cb) : true) 
        } catch (e) {
            commitQueue.some(c => {
                if (c._renderCallbacks) c._renderCallbacks = []
            })
            commitQueue = []
            options._catchError(e,component._vnode)
            
        }
    })
    if(oldCommit) oldCommit(vnode,commitQueue)  
}

const afterPaint = requestAnimationFrame

function flushAfterPaintEffects() {
    afterPaintEffects.forEach(component => {
		if (component._parentDom) {
			try {
				component._hooks._pendingEffects.forEach(invokeCleanup);
				component._hooks._pendingEffects.forEach(invokeEffect);
				component._hooks._pendingEffects = [];
			} catch (e) {
				component._hooks._pendingEffects = [];
				// options._catchError(e, component._vnode);
			}
		}
	});
	afterPaintEffects = [];
}


function getHookState(index) {
    const hooks = currentComponent._hooks ||
    (
        currentComponent._hooks = {
            _list: [],
            _pendingEffects:[]
        }
    )
    if (index >= hooks._list.length) {
        hooks._list.push({})
    }
    return hooks._list[index]
}

/**
 * 
 * @param {*} reducer 
 * @param {*} initialState 
 * @param {*} init 
 * @returns 
 */
export function useReducer(reducer, initialState,init) {
    const hookState = getHookState(currentIndex++)
    // 返回state和action 
    if (!hookState._component) {
        hookState._component = currentComponent
        
        hookState._value = [
            init ? init(initialState) : initialState,
            action => {
                const nextState = reducer(hookState._value[0], action)
                    if (nextState !== hookState._value[0]) {
                        hookState._value = [nextState, hookState._value[1]]
                        // todo 函数组件刷新方法
                        // 源代码的方法？ 为什么要这么做？ 强制刷新？
                        // 函数组件只是借用一下？
                        hookState._component.setState({});

                    }
           }
        ]
    }   
    // 返回value 和 dispatch
    return hookState._value
}

export function useState(initialState) {
    return useReducer(
        (state,action) => (typeof action === 'function') ? action(state): action,
        initialState
    )
}

export function useEffect(effect, deps) {
    const hookState = getHookState(currentIndex++)
    if (!hookState.deps || hookState._deps !== deps) {
        hookState._deps = deps
        hookState._value = effect
        // 渲染之后异步执行
        currentComponent._hooks._pendingEffects.push(hookState)
    }
}

export function useLayoutEffect(effect, deps) {
    const hookState = getHookState(currentIndex++)
    if (!hookState.deps || hookState._deps !== deps) {
        hookState._deps = deps
        hookState._value = effect
        // 渲染之后同步执行
        currentComponent._renderCallbacks.push(hookState)
    }
}

// 如果没有传依赖 每次都会执行
export function useMemo(factory, deps) {
    const hookState = getHookState(currentIndex++)
    if (!hookState.deps || hookState._deps !== deps) {
        hookState._deps = deps
        hookState._value = factory()
        hookState._factory = factory
    }
    return hookState._value
}

export function useRef(initialValue) {
    return useMemo(()=>({current:initialValue}),[])
}

export function useCallback(callback, deps) {
    return useMemo(()=>callback,deps)
}

export function useContext(context) {
    const hookState = getHookState(currentIndex++)
    hookState._context = context
    return context._defaultValue
}
//为什么 useErrorBoundary 不在react实现
export function useErrorBoundary(cb) {
    const hookState = getHookState(currentIndex++)
    const [errValue,setErrValue] = useState()
    hookState._value = cb
    if (!currentComponent.componentDidCatch) {
        currentComponent.componentDidCatch = err => {
            if (state._value) state._value(err)
            setErrValue(err)
        }
    }
    return [errValue, ()=>{setErrValue(undefined)}]
}

function invokeEffect(hook) {
    const comp = currentComponent;
    hook._cleanup = hook._value();
	currentComponent = comp;
}

function invokeCleanup(hook) {
    const comp = currentComponent;
	if (typeof hook._cleanup == 'function') hook._cleanup();
	currentComponent = comp; 
}