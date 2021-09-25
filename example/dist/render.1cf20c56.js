// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EMPTY_ARR = exports.EMPTY_OBJ = void 0;
var EMPTY_OBJ = {};
exports.EMPTY_OBJ = EMPTY_OBJ;
var EMPTY_ARR = {};
exports.EMPTY_ARR = EMPTY_ARR;
},{}],"../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../src/createElement.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = createElement;
exports.creatVNode = creatVNode;
exports.Fragment = Fragment;
exports.createRef = createRef;
exports.enqueueRender = enqueueRender;
exports.process = process;
exports.renderComponent = renderComponent;
exports.getDomSibling = getDomSibling;
exports.Component = void 0;

var _render = require("./render");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function createElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  var normalizeProps = {
    children: []
  };
  Object.keys(props || {}).forEach(function (key) {
    // 包括 ref 和 key
    normalizeProps[key] = props[key];
  });
  children = Array.isArray(children) ? children : [children];
  normalizeProps.children = children;
  return creatVNode(type, normalizeProps);
}

function creatVNode(type, props) {
  var _props$key, _props$ref;

  var vnode = {
    type: type,
    props: props,
    key: (_props$key = props.key) !== null && _props$key !== void 0 ? _props$key : null,
    ref: (_props$ref = props.ref) !== null && _props$ref !== void 0 ? _props$ref : null,
    _children: null,
    _parent: null,
    _depth: 0,
    _dom: null,
    _component: null //如果是函数组件就会有component,不然就是dom

  };
  return vnode;
}

function Fragment(props) {
  return props.children;
}

function createRef() {
  return {
    current: null
  };
}

var Component = function Component(props, context) {
  _classCallCheck(this, Component);

  this.props = props;
  this.context = context;
};
/**
 * 
 * @param {*} update 
 * @param {*} callback 将在 setState 完成合并并重新渲染组件后执行,建议使用 componentDidUpdate() 来代替
 * @returns 
 */


exports.Component = Component;

Component.prototype.setState = function (update, callback) {
  var updateState;

  if (typeof update === 'function') {
    // 先不考虑props
    updateState = update(this.state, this.props); // update 返回更新之后的值
  }

  if (update) {
    updateState = update;
  }

  if (updateState) {
    Object.assign(this.state || {}, updateState);
  }

  if (!updateState) return;

  if (this._vnode) {
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  }
};

Component.prototype.forceUpdate = function (callback) {
  if (this._vnode) {
    this._force = true;
    if (callback) this._renderCallbacks.push(callback);
    enqueueRender(this);
  }
};

function enqueueRender(c) {
  // defer 微任务 等于Promise.then()
  rerenderQueue.push(c);
  defer(process);
}

function process() {
  // 会根据_depth 去rerender , 确实应该从上而下
  rerenderQueue.forEach(function (c) {
    renderComponent(c);
  });
}

function renderComponent(componnent) {
  var vnode = componnent._vnode;
  var parentDom = componnent._parentDom;

  if (parentDom) {
    var oldVNode = Object.assign({}, vnode);
    var commitQueue = [];
    oldVNode._original = vnode._original + 1; // 为啥传两个相同的vnode

    (0, _render.diff)(parentDom, vnode, oldVNode, commitQueue);
    (0, _render.commitRoot)(commitQueue, vnode);
  }
}

var rerenderQueue = []; // 微任务

var defer = typeof Promise == 'function' ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

function getDomSibling(vnode, childIndex) {
  if (childIndex == null) {
    // Use childIndex==null as a signal to resume the search from the vnode's sibling
    return vnode._parent ? getDomSibling(vnode._parent, vnode._parent._children.indexOf(vnode) + 1) : null;
  }

  var sibling;

  for (; childIndex < vnode._children.length; childIndex++) {
    sibling = vnode._children[childIndex];

    if (sibling != null && sibling._dom != null) {
      // Since updateParentDomPointers keeps _dom pointer correct,
      // we can rely on _dom to tell us if this subtree contains a
      // rendered DOM node, and what the first rendered DOM node is
      return sibling._dom;
    }
  } // If we get here, we have not found a DOM node in this vnode's children.
  // We must resume from this vnode's sibling (in it's parent _children array)
  // Only climb up and search the parent if we aren't searching through a DOM
  // VNode (meaning we reached the DOM parent of the original vnode that began
  // the search)


  return typeof vnode.type == 'function' ? getDomSibling(vnode) : null;
}
},{"./render":"../src/render.ts","process":"../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../src/options.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.options = void 0;
var options = {};
exports.options = options;
},{}],"../src/render.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.commitRoot = exports.diffElementNodes = exports.applyRef = exports.unmount = exports.diff = exports.render = void 0;

var constants_1 = require("./constants");

var createElement_1 = require("./createElement");

var options_1 = require("./options");

function render(vnode, parentDom) {
  console.log('render', vnode, parentDom);
  var oldVNode = parentDom._children || constants_1.EMPTY_OBJ;
  var commitQueue = [];
  diff(parentDom, vnode, oldVNode, commitQueue);
  commitRoot(commitQueue, vnode);
}

exports.render = render;

function diff(parentDom, newVNode, oldVNode, commitQueue) {
  var nodeType = newVNode === null || newVNode === void 0 ? void 0 : newVNode.type;
  var newProps = newVNode === null || newVNode === void 0 ? void 0 : newVNode.props;
  var oldProps;
  var oldState;
  var isNew; // 是否是初次渲染

  var component;
  var renderResult; // for hook

  try {
    if (typeof nodeType === 'function') {
      if (oldVNode === null || oldVNode === void 0 ? void 0 : oldVNode._component) {
        component = newVNode._component = oldVNode._component;
      } else {
        if ('prototype' in nodeType && nodeType.prototype.render) {
          // 自定义函数组件
          component = newVNode._component = new nodeType(newProps); // 不需要更改原型也能更改到值，不懂为什么
          // component._proto_ = Component.prototype
        } else {
          // fragment 
          component = newVNode._component = new createElement_1.Component(newProps);
          component.constructor = nodeType;
          component.render = doRender;
        }

        isNew = true;
        component._renderCallbacks = [];
      } // 位置错了


      if (options_1.options._render) options_1.options._render(newVNode); // 第一次没有_nextState,赋值
      // 之后更新，所以nextState就作为component上一次的state

      if (component._nextState == null) {
        component._nextState = component.state;
      } // 它应返回一个对象来更新 state，如果返回 null 则不更新任何内容。


      if (nodeType.getDerivedStateFromProps != null) {
        // 参数： newProps, oldState
        Object.assign(component._nextState, nodeType.getDerivedStateFromProps(newProps, component._nextState));
      } // 应该不算old 吧


      oldProps = component.props;
      oldState = component.state; // TODO: != 与 !== 的bug
      // unsafe 暂时不考虑

      if (isNew) {
        // getDerivedStateFromProps 与 componentWillMount 是互斥的吗？
        if (nodeType.getDerivedStateFromProps == null && nodeType.componentWillMount != null) {
          nodeType.componentWillMount();
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
        if (!component._force && component.shouldComponentUpdate != null && component.shouldComponentUpdate(newProps, component._nextState) === false) {
          component.state = component._nextState;
          component.props = newProps;
          component._vnode = newVNode; // 函数组件更新时直接复用_dom

          component._vnode = newVNode;
          newVNode._dom = oldVNode._dom;
          newVNode._children = oldVNode._children;

          newVNode._children.forEach(function (vnode) {
            if (vnode) vnode._parent = newVNode;
          }); // 没看懂这里的逻辑和下面逻辑的关系


          if (component._renderCallbacks.length) {
            commitQueue.push(component);
          }

          return;
        }

        if (component.componentDidUpdate != null) {
          console.log('didUpdate会执行吗');

          component._renderCallbacks.push(function () {
            component.componentDidUpdate(oldProps, oldState);
          });
        }
      }

      component._vnode = newVNode;
      component.props = newProps;
      component._parentDom = parentDom; // 更新state, 可能在lifeCycle中更改过

      component.state = component._nextState; // 调用render 方法

      renderResult = component.render(newProps);
      renderResult = renderResult ? Array.isArray(renderResult) ? renderResult : [renderResult] : [];
      diffChildren(parentDom, renderResult, newVNode, oldVNode, commitQueue); // 为啥要在子组件这里再执行一遍

      if (component._renderCallbacks.length) {
        commitQueue.push(component);
      }
    } else {
      newVNode._dom = diffElementNodes(oldVNode === null || oldVNode === void 0 ? void 0 : oldVNode._dom, newVNode, oldVNode, commitQueue);
    } // 执行useEffect


    if (options_1.options._diffed) options_1.options._diffed(newVNode);
  } catch (e) {
    console.log(e);
  }
}

exports.diff = diff;

function diffChildren(parentDom, renderResult, newParentVNode, oldParentVNode, commitQueue) {
  var oldChildren = oldParentVNode && oldParentVNode._children || constants_1.EMPTY_ARR;
  newParentVNode._children = [];
  console.log('diffChildren', renderResult);
  var oldVNode;
  var refs = []; // 如果存在多个ref怎么解决

  for (var i = 0; i < renderResult.length; i++) {
    var childVNode = renderResult[i];

    if (typeof childVNode === 'string' || typeof childVNode === 'number' || typeof childVNode === 'bigint') {
      // childNode === 'text' demo
      childVNode = newParentVNode._children[i] = (0, createElement_1.creatVNode)(null, childVNode);
    } else if (Array.isArray(childVNode)) {
      childVNode = newParentVNode._children[i] = (0, createElement_1.creatVNode)(createElement_1.Fragment, {
        children: childVNode
      });
    } else {
      childVNode = newParentVNode._children[i] = childVNode;
    }

    childVNode._parent = newParentVNode;
    childVNode._depth = newParentVNode._depth + 1;
    var lastIndex = 0;
    var find = false;

    for (var j = 0; j < oldChildren.length; j++) {
      oldVNode = oldChildren[j];

      if (oldVNode && oldVNode.key === childVNode.key && oldVNode.type === childVNode.type) {
        find = true;
        oldChildren[j] = null;
        diff(parentDom, childVNode, oldVNode, commitQueue);
        oldVNode = null;

        if (j < lastIndex) {
          // 需要移动
          // for inserbefore 需要知道在前一个node的后一个真实dom
          var refNode = renderResult[i - 1]._dom.nextSibling;
          parentDom.insertBefore(oldVNode._dom, refNode);
        } else {
          lastIndex = j;
        }

        break;
      }
    }

    if (!find) {
      diff(parentDom, childVNode, null, commitQueue);

      if (oldChildren.length) {
        var refNode = i - 1 < 0 ? oldChildren[0]._dom : renderResult[i - 1]._dom.nextSibling;
        childVNode._dom && parentDom.insertBefore(childVNode._dom, refNode);
      } else {
        childVNode._dom && parentDom.appendChild(childVNode._dom);
      }
    } // 处理refs


    var newRef // console.log('newRef', childVNode.ref, oldVNode?.ref, newRef = childVNode.ref && oldVNode?.ref != newRef)
    = void 0; // console.log('newRef', childVNode.ref, oldVNode?.ref, newRef = childVNode.ref && oldVNode?.ref != newRef)

    if ((newRef = childVNode.ref) && (oldVNode === null || oldVNode === void 0 ? void 0 : oldVNode.ref) != newRef) {
      // 比起源码存三个数组值，是不是直接存一个对象值会更好
      if (oldVNode === null || oldVNode === void 0 ? void 0 : oldVNode.ref) refs.push({
        ref: oldVNode.ref,
        value: null,
        vnode: childVNode
      });
      refs.push({
        ref: childVNode.ref,
        value: childVNode._component || childVNode._dom,
        vnode: childVNode
      });
    }
  }

  for (var i = 0; i < oldChildren.length; i++) {
    if (oldChildren[i] !== null) {
      parentDom.removeChild(oldChildren[i]._dom); // unmount(oldChildren[i],parentVNode)
      // 还是要补充unmount 函数： 卸载的生命周期，ref的去除
    }
  } // Set refs only after unmount


  if (refs) {
    for (var i = 0; i < refs.length; i++) {
      applyRef(refs[i]);
    }
  }
}

function unmount(vnode, parentVNode) {
  var ref = vnode.ref;

  if (!ref.current || ref.current === vnode._dom) {
    // ? parentVNode
    applyRef({
      ref: ref,
      value: null,
      parentVNode: parentVNode
    });
  }

  if (vnode._component != null) {
    if (vnode._component.componentWillUnmount) {
      try {
        vnode._component.componentWillUnmount();
      } catch (e) {}
    }
  }
}

exports.unmount = unmount; // ref 如果用于html元素, 接收dom元素作为其current 属性
// 如果用于class组件，则接收实例

function applyRef(refObj) {
  var ref = refObj.ref,
      value = refObj.value,
      vnode = refObj.vnode;

  try {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  } catch (e) {
    options_1.options._catchError(e, vnode);
  }
}

exports.applyRef = applyRef;

function diffElementNodes(dom, newVNode, oldVNode, commitQueue) {
  // 不考虑复用excessDomChildren的情况
  var nodeType = newVNode === null || newVNode === void 0 ? void 0 : newVNode.type;
  var newProps = newVNode === null || newVNode === void 0 ? void 0 : newVNode.props;
  var oldProps = oldVNode === null || oldVNode === void 0 ? void 0 : oldVNode.props;

  if (dom == null) {
    if (nodeType === null) {
      return document.createTextNode(newProps);
    } else {
      dom = document.createElement(nodeType, newProps.is && newProps);
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
    newVNode._dom = dom;
    diffProps(dom, newProps, oldProps);
    var children = newVNode.props.children;
    diffChildren(dom, children, newVNode, oldVNode, commitQueue);
  }

  return dom;
}

exports.diffElementNodes = diffElementNodes;

function diffProps(dom, newProps, oldProps) {
  oldProps = oldProps ? oldProps : []; // 第一遍循环删除oldProps上newProps上不存在的props

  for (var i in oldProps) {
    if (i !== 'key' && i !== 'children' && !(i in newProps)) {
      setProperty(dom, i, null, oldProps[i]);
    }
  } // 第二遍循环遍历newProps，修改oldProps的值


  for (var i in newProps) {
    if (i !== 'key' && i !== 'children') {
      setProperty(dom, i, newProps[i], oldProps[i]);
    }
  }
}

function setProperty(dom, name, value, oldValue) {
  // 样式有可能是一串字符串，也有可能是一个对象
  if (name === 'style') {
    if (typeof value === 'string') {
      dom.style.cssText = value;
    } else {
      if (typeof oldValue === 'string') {
        dom.style.cssText = '';
      }

      if (_typeof(oldValue) === 'object') {
        for (var i in oldValue) {
          setStyle(dom.style, i, '');
        }
      }

      if (_typeof(value) === 'object') {
        for (var i in value) {
          setStyle(dom.style, i, value[i]);
        }
      }
    }
  } else if (name[0] === 'o' && name[1] === 'n') {
    name = name.replace(/Capture$/, ''); // Infer correct casing for DOM built-in events:

    if (name.toLowerCase() in dom) name = name.toLowerCase().slice(2);else name = name.slice(2);

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
  return this.constructor(props);
} // 用来执行render之后的生命周期钩子
// some 到底是怎么用的


function commitRoot(commitQueue, root) {
  console.log('commitRoot', commitQueue, root);
  if (options_1.options._commit) options_1.options._commit(root, commitQueue);
  var queue = commitQueue;
  commitQueue = [];
  queue.some(function (c) {
    try {
      var cbs = c._renderCallbacks;
      cbs.some(function (cb) {
        cb.call(c);
      });
    } catch (e) {}
  });
}

exports.commitRoot = commitRoot;
},{"./constants":"../src/constants.js","./createElement":"../src/createElement.js","./options":"../src/options.js"}],"../src/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var render_1 = require("./render");

var createElement_1 = require("./createElement");

var Preact = {
  render: render_1.render,
  createElement: createElement_1.createElement,
  Component: createElement_1.Component,
  createRef: createElement_1.createRef
};
exports.default = Preact;
},{"./render":"../src/render.ts","./createElement":"../src/createElement.js"}],"render.jsx":[function(require,module,exports) {
"use strict";

var _src = _interopRequireDefault(require("../src"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

// const element = react.createElement('div', { id: 'preact'}, 'preact')
// const element = <div>text</div>
var Children = /*#__PURE__*/function (_React$Component) {
  _inherits(Children, _React$Component);

  var _super = _createSuper(Children);

  function Children() {
    _classCallCheck(this, Children);

    return _super.apply(this, arguments);
  }

  _createClass(Children, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_src.default.createElement("div", null, /*#__PURE__*/_src.default.createElement("p", null, "\u6700\u540E\u7684\u7EC4\u4EF6"), /*#__PURE__*/_src.default.createElement("p", null, this.props.name));
    }
  }]);

  return Children;
}(_src.default.Component);

var App = /*#__PURE__*/function (_React$Component2) {
  _inherits(App, _React$Component2);

  var _super2 = _createSuper(App);

  function App() {
    var _this;

    _classCallCheck(this, App);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super2.call.apply(_super2, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      value: 'prop-children',
      arr: ['list1']
    });

    _defineProperty(_assertThisInitialized(_this), "ref1", _src.default.createRef());

    _defineProperty(_assertThisInitialized(_this), "ref2", _src.default.createRef());

    _defineProperty(_assertThisInitialized(_this), "changeValue", function () {
      _this.setState({
        arr: _this.state.arr.slice().reverse()
      });
    });

    _defineProperty(_assertThisInitialized(_this), "addValue", function () {
      _this.setState({
        arr: [].concat(_toConsumableArray(_this.state.arr), ['list2'])
      });
    });

    _defineProperty(_assertThisInitialized(_this), "changeValue", function () {
      _this.setState(_objectSpread(_objectSpread({}, _this.state), {}, {
        value: "change-prop"
      }));
    });

    return _this;
  }

  _createClass(App, [{
    key: "componentDidMount",
    value: // 一些基本的生命周期
    // unsafe
    // componentWillMount() {
    //     console.log('App: will mount');
    // }
    function componentDidMount() {
      var node1 = this.ref1;
      var node2 = this.ref2;
      console.log('App: did mount', node1, node2);
    } // unsafe
    // componentWillUpdate() {
    //     console.log('App: will update');
    // }

  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      console.log('App: did update');
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      console.log('App: will unmount');
    } // 一定要写箭头函数

  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_src.default.createElement("div", {
        ref: this.ref1
      }, /*#__PURE__*/_src.default.createElement("button", {
        onClick: this.addValue
      }, "\u589E\u52A0\u4E00\u4E2A\u6570\u503C"), /*#__PURE__*/_src.default.createElement("button", {
        onClick: this.changeValue
      }, "\u66F4\u6539\u5B50\u7EC4\u4EF6prop"), this.state.arr.map(function (item) {
        return /*#__PURE__*/_src.default.createElement("li", {
          key: item
        }, item);
      }), /*#__PURE__*/_src.default.createElement(Children, {
        ref: this.ref2,
        name: this.state.value
      }));
    }
  }]);

  return App;
}(_src.default.Component);

var root = document.querySelector('#root');

_src.default.render( /*#__PURE__*/_src.default.createElement(App, null), root);
},{"../src":"../src/index.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57405" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","render.jsx"], null)
//# sourceMappingURL=/render.1cf20c56.js.map