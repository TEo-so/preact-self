import {diff,commitRoot} from './diff'
export class Component {
    constructor(props, context) {
        this.props = props
        this.context = context
    }
}

/**
 * 
 * @param {*} update 
 * @param {*} callback 将在 setState 完成合并并重新渲染组件后执行,建议使用 componentDidUpdate() 来代替
 * @returns 
 */
Component.prototype.setState = function (update, callback) {
    let updateState
    if (typeof update === 'function') {
        // 先不考虑props
        updateState = update(this.state, this.props) // update 返回更新之后的值
    }else if (update) {
        updateState = update
    }
    if (updateState) {
        this.state = Object.assign(this.state || {}, updateState)
    }
      console.log('state',updateState,this.state)
    if (!updateState) return
    if (this._vnode) {
        if (callback) this._renderCallbacks.push(callback);
        enqueueRender(this)
    }   
}


Component.prototype.forceUpdate = function (callback) {
    if (this._vnode) {
        this._force = true
        if (callback) this._renderCallbacks.push(callback)
        enqueueRender(this)
    }
}

export function enqueueRender(c) {
    // defer 微任务 等于Promise.then()
    rerenderQueue.push(c)
    defer(process)
}

export function process() {
    // 防止上一次的renderQueue 再执行
    let queue = rerenderQueue
    rerenderQueue = []
    queue.forEach(c => { renderComponent(c) })
}

export function renderComponent(componnent) {
    console.log('renderComponent',componnent)
    let vnode = componnent._vnode
    let parentDom = componnent._parentDom
    if (parentDom) {
        const oldVNode = Object.assign({}, vnode)
        let commitQueue = []
        oldVNode._original = vnode._original + 1
        // 为啥传两个相同的vnode
        diff(parentDom, vnode, oldVNode, commitQueue)
        commitRoot(commitQueue,vnode)
    }
}

let rerenderQueue = []
// 微任务
const defer =
	typeof Promise == 'function'
		? Promise.prototype.then.bind(Promise.resolve())
		: setTimeout;

export function getDomSibling(vnode, childIndex) {
	if (childIndex == null) {
		// Use childIndex==null as a signal to resume the search from the vnode's sibling
		return vnode._parent
			? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1)
			: null;
	}

	let sibling;
	for (; childIndex < vnode._children.length; childIndex++) {
		sibling = vnode._children[childIndex];

		if (sibling != null && sibling._dom != null) {
			// Since updateParentDomPointers keeps _dom pointer correct,
			// we can rely on _dom to tell us if this subtree contains a
			// rendered DOM node, and what the first rendered DOM node is
			return sibling._dom;
		}
	}

	// If we get here, we have not found a DOM node in this vnode's children.
	// We must resume from this vnode's sibling (in it's parent _children array)
	// Only climb up and search the parent if we aren't searching through a DOM
	// VNode (meaning we reached the DOM parent of the original vnode that began
	// the search)
	return typeof vnode.type == 'function' ? getDomSibling(vnode) : null;
}
