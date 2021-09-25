import { Component, creatVNode, Fragment, getDomSibling } from "./createElement"
import { EMPTY_OBJ, EMPTY_ARR } from "./constants"
export function render(vnode, parentDom) {
    let oldVNode = parentDom._children || EMPTY_OBJ
    let oldDom = oldVNode._dom
    diff(parentDom, vnode, oldVNode, oldDom)
}

export function diff(parentDom, newVNode, oldVNode, oldDom) {
    let nodeType = newVNode?.type
    let newProps = newVNode?.props
    let oldProps
    let oldState
    let isNew // 是否是初次渲染
    let component
    let renderResult
    try {
        if (typeof nodeType === 'function') {
            if (oldVNode?._component) {
                component = newVNode._component = oldVNode._component
            } else {
                if ('prototype' in nodeType && nodeType.prototype.render) {
                    // 自定义函数组件
                    component = newVNode._component = new nodeType(newProps)
                } else {
                    // fragment 
                    component = newVNode._component = new Component(newProps)
                    component.constructor = nodeType
                    component.render = doRender
                    // console.log('fragment', component, component.render(newProps))
                }
                isNew = true
            }
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

            // TODO: != 与 !== 的报告

            if (isNew) {
                // getDerivedStateFromProps 与 componentWillMount 是互斥的吗？
                if (nodeType.getDerivedStateFromProps == null &&
                    nodeType.componentWillMount != null) {
                    nodeType.componentWillMount()
                }

                if (component.componentDidUpdate != null) {
                    component._renderCallBacks.push(component.componentDidUpdate)
                }
            } else {
                if (nodeType.getDerivedStateFromProps == null &&
                    newProps !== oldProps &&
                    component.componentWillReceiveProps != null
                ) {
                    component.componentWillReceiveProps(newProps, oldProps)
                }

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
                    // if (component._renderCallbacks.length) {
                    //     // commitQueue.push(c);
                    // }
                    return
                }
            }
            component._vnode = newVNode
            component.props = newProps
            component._parentDom = parentDom
            // 更新state, 可能在lifeCycle中更改过
            component.state = component._nextState
            // 调用render 方法
            renderResult = component.render(newProps)
            diffChildren(parentDom, renderResult, newVNode, oldVNode, oldDom)
        } else {
            newVNode._dom = diffElementNodes(oldVNode._dom, newVNode, oldVNode)
        }
    } catch (e) {
        console.log(e)
    }
}


export function diffElementNodes(dom, newVNode, oldVNode) {
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
        diffChildren(dom, children, newVNode, oldVNode, oldVNode._children && getDomSibling(oldVNode, 0))
    }
    return dom
}

function diffChildren(parentDom, renderResult, newParentVNode, oldParentVNode, oldDom) {
    // console.log('diffChildren', newParentVNode, renderResult)
    let oldVNode
    let newDom
    let oldChildren = (oldParentVNode && oldParentVNode._children) || EMPTY_ARR
    newParentVNode._children = []
    renderResult = renderResult ?
        Array.isArray(renderResult) ? renderResult : [renderResult]
        : []
    for (let i = 0; i < renderResult.length; i++) {
        let childVNode = renderResult[i]
        if (typeof childVNode === 'string' || typeof childVNode === 'number') {
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

        oldVNode = oldChildren[i]
        console.log('childVNode, oldVNode', childVNode, oldVNode)
        if (oldVNode === null ||
            (oldVNode &&
                childVNode.key === oldVNode.key &&
                childVNode.type === oldVNode.type
            )
        ) {
            // 可复用的情况
            // 为什么可复用的情况要把 oldChildren[i] 赋值为undefined
            oldChildren[i] = undefined
        } else {
            // 寻找同层的其他子节点有没有其他的可复用的vnode
            for (let j = 0; j < oldChildren.length; j++) {
                oldVNode = oldChildren[j]
                if (oldVNode &&
                    oldVNode.key === childVNode.key &&
                    oldVNode.type === childVNode.type) {
                    oldChildren[j] = undefined
                    break
                }
                // 这里赋值为null 这样就相当于 接着diff为空，就直接当作新建
                oldVNode = null
            }
        }
        oldVNode = oldVNode || EMPTY_OBJ

        // Morph the old element into the new one, but don't append it to the dom yet
        diff(parentDom, childVNode, oldVNode, oldDom)

        newDom = childVNode._dom
        if (newDom !== null) {
            // 增加对函数组件的判断
            // 为什么之前fragment 没有问题
            if (
                typeof childVNode.type == 'function' &&
                childVNode._children != null && // Can be null if childVNode suspended
                childVNode._children === oldVNode._children
            ) {
                childVNode._nextDom = oldDom = reorderChildren(
                    childVNode,
                    oldDom,
                    parentDom
                );
            } else {
                oldDom = placeChild(parentDom, childVNode, oldVNode, oldDom)
            }

            if (typeof newParentVNode.type == 'function') {
                newParentVNode._nextDom = oldDom;
            }
        }
    }
}

function placeChild(parentDom, childVNode, oldVNode, oldDom) {
    let newDom = childVNode._dom
    console.log('placeChild', newDom, oldDom)
    let nextDom
    let oldChildren = oldVNode._children
    // console.log('place', parentDom, newDom)
    if (oldDom == null || newDom !== oldDom || newDom.parentNode == null) {
        // 新增且没有后继节点，直接append
        if (oldDom == null || oldDom.parentNode !== parentDom) {
            parentDom.appendChild(newDom);
            nextDom = null;
        } else {
            // 感觉没用到啊，应该是为了防止一种特殊情况
            // for (
            //     let sibDom = oldDom, j = 0;
            //     (sibDom = sibDom.nextSibling) && j < oldChildren.length;
            //     j += 2
            // ) {
            //     if (sibDom == newDom) {
            //         break;
            //     }
            // }
            parentDom.insertBefore(newDom, oldDom)
            nextDom = oldDom
        }
    }
    if (nextDom !== undefined) {
        oldDom = nextDom
    } else {
        oldDom = newDom.nextSibling
    }
    return oldDom
}

function reorderChildren(childVNode, oldDom, parentDom) {
    for (let tmp = 0; tmp < childVNode._children.length; tmp++) {
        let vnode = childVNode._children[tmp];
        if (vnode) {
            // We typically enter this code path on sCU bailout, where we copy
            // oldVNode._children to newVNode._children. If that is the case, we need
            // to update the old children's _parent pointer to point to the newVNode
            // (childVNode here).
            vnode._parent = childVNode;

            if (typeof vnode.type == 'function') {
                oldDom = reorderChildren(vnode, oldDom, parentDom);
            } else {
                oldDom = placeChild(
                    parentDom,
                    vnode,
                    vnode,
                    oldDom
                );
            }
        }
    }

    return oldDom;
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

function doRender(props) {
    return this.constructor(props)
}

