import { diff, commitRoot } from "./render"
import { shallowCompare } from "./utils"
import { Component } from "./component"

export function createElement(type, props, ...children) {
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

// memo 适用于函数组件
export function memo(FC, areEqual) {
     if(!areEqual) areEqual = shallowCompare
    // 只会比较props 但是如果是函数组件，拥有useState、useReducer、useContext，当有state和context的时候还是会触发改变
    function Memoized(props) {
        // return true 就是要更新
        this.shouldComponentUpdate = function shouldUpdate(nextProps) {
            return areEqual(props,nextProps)
        }
        return creatVNode(FC,props)
    }
    return Memoized
}
export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this.props, nextProps) || shallowCompare(this.state, nextState)
  }

  render() {
    return this.props.children
  }
}

export function createRef() {
    return {current:null}
}






