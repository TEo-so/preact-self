import { EMPTY_ARR } from "./constants"
import { creatVNode, Fragment } from "./createElement"
import { Component } from './component'
import { options } from "./options"

export function diff(parentDom, newVNode, oldVNode, commitQueue) {
    let nodeType = newVNode?.type
    let newProps = newVNode?.props
    let oldProps
    let oldState
    let isNew // 是否是初次渲染
    let component
    let renderResult
    // for hook
    try {
        if (typeof nodeType === 'function') {
            const contextType = nodeType.contextType
            const componentContext = contextType?._defaultValue
            console.log('componentContext',componentContext)
            if (oldVNode?._component) {
                component = newVNode._component = oldVNode._component
            } else {
                if ('prototype' in nodeType && nodeType.prototype.render) {
                    // 自定义函数组件
                    component = newVNode._component = new nodeType(newProps,componentContext)
                    // 不需要更改原型也能更改到值，不懂为什么
                    // component._proto_ = Component.prototype
                } else {
                    // fragment 
                    // console.log('nodeType', nodeType)
                    component = newVNode._component = new Component(newProps,componentContext)
                    component.constructor = nodeType
                    component.render = doRender
                }
                isNew = true
                component._renderCallbacks = []
            }
            component.context = componentContext
            // 位置错了
            if (options._render) options._render(newVNode)
            // 第一次没有_nextState,赋值
            // 之后更新，所以nextState就作为component上一次的state
            if (component._nextState == null) {
                component._nextState = component.state
            }

            // 它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。

            if (nodeType.getDerivedStateFromProps != null) {
                // 参数： newProps, oldState
                Object.assign(component._nextState, nodeType.getDerivedStateFromProps(
                    newProps, component._nextState
                ))

            }

            // 应该不算old 吧
            oldProps = component.props
            oldState = component.state

            // TODO: != 与 !== 的bug
            // unsafe 暂时不考虑

            if (isNew) {
                // getDerivedStateFromProps 与 componentWillMount 是互斥的吗？
                if (nodeType.getDerivedStateFromProps == null &&
                    nodeType.componentWillMount != null) {
                    nodeType.componentWillMount()
                }
                if (component.componentDidMount != null) {
                    component._renderCallbacks.push(component.componentDidMount);
                }
            } else {
                // if (nodeType.getDerivedStateFromProps == null &&
                //     newProps !== oldProps &&
                //     component.componentWillReceiveProps != null
                // ) {
                //     component.componentWillReceiveProps(newProps, oldProps)
                // }

                // newVNode._original === oldVNode._original
                // undefined === undefined

                if ((!component._force &&
                    component.shouldComponentUpdate != null &&
                    component.shouldComponentUpdate(newProps, component._nextState) === false
                )) {
                    component.state = component._nextState
                    component.props = newProps
                    component._vnode = newVNode
                    // 函数组件更新时直接复用_dom
                    component._vnode = newVNode
                    newVNode._dom = oldVNode._dom
                    newVNode._children = oldVNode._children
                    newVNode._children.forEach(vnode => {
                        if (vnode) vnode._parent = newVNode;
                    });
                    // 没看懂这里的逻辑和下面逻辑的关系
                    if (component._renderCallbacks.length) {
                        commitQueue.push(component);
                    }
                    return
                }

                if (component.componentDidUpdate != null) {
                    console.log('didUpdate会执行吗')
                    component._renderCallbacks.push(() => {
                        component.componentDidUpdate(oldProps, oldState);
                    });
                }
            }
            component._vnode = newVNode
            component.props = newProps
            component._parentDom = parentDom
            // 更新state, 可能在lifeCycle中更改过
            component.state = component._nextState
            // 调用render 方法
            renderResult = component.render(component.props,component.context)
            renderResult = renderResult ?
                Array.isArray(renderResult) ? renderResult : [renderResult]
                : []
            diffChildren(parentDom, renderResult, newVNode, oldVNode, commitQueue)
            // 为啥要在子组件这里再执行一遍
            if (component._renderCallbacks.length) {
                commitQueue.push(component);
            }
        } else {
            newVNode._dom = diffElementNodes(oldVNode?._dom, newVNode, oldVNode, commitQueue)
        }
        // 执行useEffect
        if (options._diffed) options._diffed(newVNode)

    } catch (e) {
        console.log(e)
    }
}



function diffChildren(parentDom, renderResult, newParentVNode, oldParentVNode, commitQueue) {
    let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR
    newParentVNode._children = []
    console.log('diffChildren', renderResult)
    let oldVNode
    let refs = []// 如果存在多个ref怎么解决

    for (let i = 0; i < renderResult.length; i++) {
        let childVNode = renderResult[i]
        if (typeof childVNode === 'string' || typeof childVNode === 'number' || typeof childVNode === 'bigint') {
            // childNode === 'text' demo
            childVNode = newParentVNode._children[i] = creatVNode(null, childVNode)
        } else if (Array.isArray(childVNode)) {
            childVNode = newParentVNode._children[i] = creatVNode(
                Fragment,
                { children: childVNode }
            )
        } else {
            childVNode = newParentVNode._children[i] = childVNode
        }
        childVNode._parent = newParentVNode
        childVNode._depth = newParentVNode._depth + 1

        let lastIndex = 0
        let find = false
        for (let j = 0; j < oldChildren.length; j++) {
            oldVNode = oldChildren[j]
            if (oldVNode &&
                oldVNode.key === childVNode.key &&
                oldVNode.type === childVNode.type
            ) {
                find = true
                oldChildren[j] = null
                diff(parentDom, childVNode, oldVNode, commitQueue)
                oldVNode = null
                if (j < lastIndex) {
                    // 需要移动
                    // for inserbefore 需要知道在前一个node的后一个真实dom
                    const refNode = renderResult[i - 1]._dom.nextSibling
                    parentDom.insertBefore(oldVNode._dom, refNode)
                } else {
                    lastIndex = j
                }
                break
            }
        }
        if (!find) {
            diff(parentDom, childVNode, null, commitQueue)
            if (oldChildren.length) {
                const refNode = i - 1 < 0
                    ? oldChildren[0]._dom
                    : renderResult[i - 1]._dom.nextSibling
                childVNode._dom && parentDom.insertBefore(childVNode._dom, refNode)
            } else {
                childVNode._dom && parentDom.appendChild(childVNode._dom)
            }
        }

        // 处理refs
        let newRef
        // console.log('newRef', childVNode.ref, oldVNode?.ref, newRef = childVNode.ref && oldVNode?.ref != newRef)
        if ((newRef = childVNode.ref) && oldVNode?.ref != newRef) {
            // 比起源码存三个数组值，是不是直接存一个对象值会更好
            if (oldVNode?.ref) refs.push({ ref: oldVNode.ref, value: null, vnode: childVNode })
            refs.push({ ref: childVNode.ref, value: childVNode._component || childVNode._dom, vnode: childVNode })
        }


    }

    for (let i = 0; i < oldChildren.length; i++) {
        if (oldChildren[i] !== null) {
            parentDom.removeChild(oldChildren[i]._dom)
            // unmount(oldChildren[i],parentVNode)
            // 还是要补充unmount 函数： 卸载的生命周期，ref的去除
        }
    }

    // Set refs only after unmount
    if (refs) {
        for (let i = 0; i < refs.length; i++) {
            applyRef(refs[i]);
        }
    }
}

export function unmount(vnode, parentVNode) {
    const ref = vnode.ref
    if (!ref.current || ref.current === vnode._dom) {
        // ? parentVNode
        applyRef({ ref, value: null, parentVNode })
    }
    if (vnode._component != null) {
        if (vnode._component.componentWillUnmount) {
            try {
                vnode._component.componentWillUnmount()
            } catch (e) {
            }
        }
    }

}

// ref 如果用于html元素, 接收dom元素作为其current 属性
// 如果用于class组件，则接收实例
export function applyRef(refObj) {
    const { ref, value, vnode } = refObj
    try {
        if (typeof ref == 'function') ref(value);
        else ref.current = value;
    } catch (e) {
        options._catchError(e, vnode);
    }
}

export function diffElementNodes(dom, newVNode, oldVNode, commitQueue) {
    // 不考虑复用excessDomChildren的情况
    let nodeType = newVNode?.type
    let newProps = newVNode?.props
    let oldProps = oldVNode?.props
    if (dom == null) {
        if (nodeType === null) {
            return document.createTextNode(newProps)
        } else {
            dom = document.createElement(nodeType, newProps.is && newProps)
        }
    }
    if (nodeType === null) {
        // 文本节点修改的情况
        // nodeValue 与 data 设置一样 都是设置文本内容
        // During hydration, we still have to split merged text from SSR'd HTML.
        if (oldProps !== newProps) {
            dom.data = newProps;
        }
    } else {
        newVNode._dom = dom
        diffProps(dom, newProps, oldProps)
        let children = newVNode.props.children
        children = Array.isArray(children) ? children : [children]
        diffChildren(dom, children, newVNode, oldVNode, commitQueue)
    }
    return dom
}


function diffProps(dom, newProps, oldProps) {
    oldProps = oldProps ? oldProps : []
    // 第一遍循环删除oldProps上newProps上不存在的props
    for (let i in oldProps) {
        if (i !== 'key' && i !== 'children' && !(i in newProps)) {
            setProperty(dom, i, null, oldProps[i])
        }
    }

    // 第二遍循环遍历newProps，修改oldProps的值
    for (let i in newProps) {
        if (i !== 'key' && i !== 'children') {
            setProperty(dom, i, newProps[i], oldProps[i])
        }
    }
}

function setProperty(dom, name, value, oldValue) {
    // 样式有可能是一串字符串，也有可能是一个对象
    if (name === 'style') {
        if (typeof value === 'string') {
            dom.style.cssText = value
        } else {
            if (typeof oldValue === 'string') {
                dom.style.cssText = ''
            }
            if (typeof oldValue === 'object') {
                for (let i in oldValue) {
                    setStyle(dom.style, i, '')
                }
            }
            if (typeof value === 'object') {
                for (let i in value) {
                    setStyle(dom.style, i, value[i])
                }
            }
        }
    } else if (name[0] === 'o' && name[1] === 'n') {
        name = name.replace(/Capture$/, '')
        // Infer correct casing for DOM built-in events:
        if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2);
        else name = name.slice(2);
        if (value) {
            if (!oldValue) {
                dom.addEventListener(name, value);
            }
        } else {
            dom.removeEventListener(name, value);
        }
    } else if (name !== 'dangerouslySetInnerHTML') {
        // 暂时没考虑 svg 以及 class 写法
        if (
			name !== 'href' &&
			name !== 'list' &&
			name !== 'form' &&
			// Default value in browsers is `-1` and an empty string is
			// cast to `0` instead
			name !== 'tabIndex' &&
            name !== 'download' &&
            name in dom
        ) {
            console.log('setProperty',name,value == null)
            try {
                dom[name] = value == null ? '' : value;
                return 
			} catch (e) {}
        }
    }
}

function setStyle(style, key, value) {
    if (key[0] === '-') {
        style.setProperty(key, value);
    } else if (value == null) {
        style[key] = '';
    } else if (typeof value != 'number') {
        style[key] = value;
    } else {
        style[key] = value + 'px';
    }
}

function doRender(props,context) {
    return this.constructor(props,context)
}

// 用来执行render之后的生命周期钩子
// some 到底是怎么用的
export function commitRoot(commitQueue, root) {
    console.log('commitRoot', commitQueue, root)
    if (options._commit) options._commit(root, commitQueue);
    const queue = commitQueue
    commitQueue = []
    queue.some(c => {
        try {
            const cbs = c._renderCallbacks
            cbs.some(cb => {
                cb.call(c)
            });
        } catch (e) {
        }
    })
}