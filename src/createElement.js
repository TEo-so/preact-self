import { diff, commitRoot } from "./render"
import { shallowCompare } from "./utils"

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

export function memo(component, isEqual) {
     if(!isEqual) isEqual = shallowCompare
    // memo 只会对比props,所以还要测试state 
    // state 更改还是会更改的
    function Memoized(props) {
        this.shouldComponentUpdate = function shouldUpdate(nextProps) {
            return comparer(props,nextProps)
        }
        return creatVNode(component,props)
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






