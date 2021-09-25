import { EMPTY_OBJ } from "./constants"
import { diff, commitRoot } from './diff'

export function render(vnode, parentDom) {
    console.log('render', vnode, parentDom)
    let oldVNode = parentDom._children || EMPTY_OBJ
    let commitQueue = []
    diff(parentDom, vnode, oldVNode, commitQueue)
    commitRoot(commitQueue, vnode)
}



