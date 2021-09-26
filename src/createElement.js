import { diff, commitRoot } from "./render"

export function createElement(type, props, children) {
    const normalizeProps = { children: [] }
    Object.keys(props || {}).forEach(key => {
        // 包括 ref 和 key
        normalizeProps[key] = props[key]
    })
    normalizeProps.children = children
    return creatVNode(type, normalizeProps)
}

export function creatVNode(type, props) {
    const vnode = {
        type,
        props,
        key: props.key ?? null,
        ref: props.ref ?? null,
        _children: null,
        _parent: null,
        _depth: 0,
        _dom: null,
        _component: null, //如果是函数组件就会有component,不然就是dom
    }
    return vnode
}

export function Fragment(props) {
    return props.children
}

export function createRef() {
    return {current:null}
}






