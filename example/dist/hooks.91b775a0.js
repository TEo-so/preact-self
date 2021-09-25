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
},{}],"../src/createElement.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createElement = createElement;
exports.creatVNode = creatVNode;
exports.Fragment = Fragment;
exports.createRef = createRef;

var _render = require("./render");

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
},{"./render":"../src/render.ts"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

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
},{}],"../src/component.js":[function(require,module,exports) {

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueRender = enqueueRender;
exports.process = process;
exports.renderComponent = renderComponent;
exports.getDomSibling = getDomSibling;
exports.Component = void 0;

var _diff = require("./diff");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

    (0, _diff.diff)(parentDom, vnode, oldVNode, commitQueue);
    (0, _diff.commitRoot)(commitQueue, vnode);
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
},{"./diff":"../src/diff.js","process":"../../../../../usr/local/lib/node_modules/parcel-bundler/node_modules/process/browser.js"}],"../src/options.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.options = void 0;
var options = {};
exports.options = options;
},{}],"../src/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;
exports.unmount = unmount;
exports.applyRef = applyRef;
exports.diffElementNodes = diffElementNodes;
exports.commitRoot = commitRoot;

var _constants = require("./constants");

var _createElement = require("./createElement");

var _component = require("./component");

var _options = require("./options");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
      if (oldVNode !== null && oldVNode !== void 0 && oldVNode._component) {
        component = newVNode._component = oldVNode._component;
      } else {
        if ('prototype' in nodeType && nodeType.prototype.render) {
          // 自定义函数组件
          component = newVNode._component = new nodeType(newProps); // 不需要更改原型也能更改到值，不懂为什么
          // component._proto_ = Component.prototype
        } else {
          // fragment 
          component = newVNode._component = new _component.Component(newProps);
          component.constructor = nodeType;
          component.render = doRender;
        }

        isNew = true;
        component._renderCallbacks = [];
      } // 位置错了


      if (_options.options._render) _options.options._render(newVNode); // 第一次没有_nextState,赋值
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


    if (_options.options._diffed) _options.options._diffed(newVNode);
  } catch (e) {
    console.log(e);
  }
}

function diffChildren(parentDom, renderResult, newParentVNode, oldParentVNode, commitQueue) {
  var oldChildren = oldParentVNode && oldParentVNode._children || _constants.EMPTY_ARR;
  newParentVNode._children = [];
  console.log('diffChildren', renderResult);
  var oldVNode;
  var refs = []; // 如果存在多个ref怎么解决

  for (var i = 0; i < renderResult.length; i++) {
    var _oldVNode;

    var childVNode = renderResult[i];

    if (typeof childVNode === 'string' || typeof childVNode === 'number' || typeof childVNode === 'bigint') {
      // childNode === 'text' demo
      childVNode = newParentVNode._children[i] = (0, _createElement.creatVNode)(null, childVNode);
    } else if (Array.isArray(childVNode)) {
      childVNode = newParentVNode._children[i] = (0, _createElement.creatVNode)(_createElement.Fragment, {
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
        var _refNode = i - 1 < 0 ? oldChildren[0]._dom : renderResult[i - 1]._dom.nextSibling;

        childVNode._dom && parentDom.insertBefore(childVNode._dom, _refNode);
      } else {
        childVNode._dom && parentDom.appendChild(childVNode._dom);
      }
    } // 处理refs


    var newRef = void 0; // console.log('newRef', childVNode.ref, oldVNode?.ref, newRef = childVNode.ref && oldVNode?.ref != newRef)

    if ((newRef = childVNode.ref) && ((_oldVNode = oldVNode) === null || _oldVNode === void 0 ? void 0 : _oldVNode.ref) != newRef) {
      var _oldVNode2;

      // 比起源码存三个数组值，是不是直接存一个对象值会更好
      if ((_oldVNode2 = oldVNode) !== null && _oldVNode2 !== void 0 && _oldVNode2.ref) refs.push({
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

  for (var _i = 0; _i < oldChildren.length; _i++) {
    if (oldChildren[_i] !== null) {
      parentDom.removeChild(oldChildren[_i]._dom); // unmount(oldChildren[i],parentVNode)
      // 还是要补充unmount 函数： 卸载的生命周期，ref的去除
    }
  } // Set refs only after unmount


  if (refs) {
    for (var _i2 = 0; _i2 < refs.length; _i2++) {
      applyRef(refs[_i2]);
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
} // ref 如果用于html元素, 接收dom元素作为其current 属性
// 如果用于class组件，则接收实例


function applyRef(refObj) {
  var ref = refObj.ref,
      value = refObj.value,
      vnode = refObj.vnode;

  try {
    if (typeof ref == 'function') ref(value);else ref.current = value;
  } catch (e) {
    _options.options._catchError(e, vnode);
  }
}

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

function diffProps(dom, newProps, oldProps) {
  oldProps = oldProps ? oldProps : []; // 第一遍循环删除oldProps上newProps上不存在的props

  for (var i in oldProps) {
    if (i !== 'key' && i !== 'children' && !(i in newProps)) {
      setProperty(dom, i, null, oldProps[i]);
    }
  } // 第二遍循环遍历newProps，修改oldProps的值


  for (var _i3 in newProps) {
    if (_i3 !== 'key' && _i3 !== 'children') {
      setProperty(dom, _i3, newProps[_i3], oldProps[_i3]);
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
        for (var _i4 in value) {
          setStyle(dom.style, _i4, value[_i4]);
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
  if (_options.options._commit) _options.options._commit(root, commitQueue);
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
},{"./constants":"../src/constants.js","./createElement":"../src/createElement.js","./component":"../src/component.js","./options":"../src/options.js"}],"../src/render.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = void 0;

var constants_1 = require("./constants");

var diff_1 = require("./diff");

function render(vnode, parentDom) {
  console.log('render', vnode, parentDom);
  var oldVNode = parentDom._children || constants_1.EMPTY_OBJ;
  var commitQueue = [];
  (0, diff_1.diff)(parentDom, vnode, oldVNode, commitQueue);
  (0, diff_1.commitRoot)(commitQueue, vnode);
}

exports.render = render;
},{"./constants":"../src/constants.js","./diff":"../src/diff.js"}],"../src/index.ts":[function(require,module,exports) {
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
},{"./render":"../src/render.ts","./createElement":"../src/createElement.js"}],"../src/hooks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useReducer = useReducer;
exports.useState = useState;
exports.useEffect = useEffect;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useRef = useRef;
exports.useCallback = useCallback;
exports.useErrorBoundary = useErrorBoundary;

var _options = require("./options");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 定义几个全局变量
var currentIndex;
var currentComponent; // let currentHook = 0   // 代码里currentHook用数字为hook标识类型

var afterPaintEffects = [];
var oldBeforeRender = _options.options._render;
var originalDiffed = _options.options._diffed;
var oldCommit = _options.options._commit;

_options.options._render = function (vnode) {
  if (oldBeforeRender) oldBeforeRender();
  currentComponent = vnode._component;
  console.log('currentComponent', vnode, currentComponent);
  currentIndex = 0;
  var hooks = currentComponent._hooks;

  if (hooks) {
    hooks._pendingEffects.forEach(invokeCleanup);

    hooks._pendingEffects.forEach(invokeEffect);

    hooks._pendingEffects = [];
  }
};

_options.options._diffed = function (vnode) {
  if (originalDiffed) originalDiffed();
  var c = vnode._component;

  if (c && c._hooks && c._hooks._pendingEffects) {
    afterPaintEffects.push(c);
    afterPaint(flushAfterPaintEffects);
  }
}; // 处理hooks的同步执行 useLayoutEffect
// 为了和useEffect行为一致


_options.options._commit = function (vnode, commitQueue) {
  commitQueue.some(function (component) {
    try {
      component._renderCallbacks.forEach(invokeCleanup);

      component._renderCallbacks = component._renderCallbacks.filter(function (cb) {
        return cb._value ? invokeEffect(cb) : true;
      });
    } catch (e) {
      commitQueue.some(function (c) {
        if (c._renderCallbacks) c._renderCallbacks = [];
      });
      commitQueue = [];

      _options.options._catchError(e, component._vnode);
    }
  });
  if (oldCommit) oldCommit(vnode, commitQueue);
};

var afterPaint = requestAnimationFrame;

function flushAfterPaintEffects() {
  afterPaintEffects.forEach(function (component) {
    if (component._parentDom) {
      try {
        component._hooks._pendingEffects.forEach(invokeCleanup);

        component._hooks._pendingEffects.forEach(invokeEffect);

        component._hooks._pendingEffects = [];
      } catch (e) {
        component._hooks._pendingEffects = []; // options._catchError(e, component._vnode);
      }
    }
  });
  afterPaintEffects = [];
}

function getHookState(index) {
  var hooks = currentComponent._hooks || (currentComponent._hooks = {
    _list: [],
    _pendingEffects: []
  });

  if (index >= hooks._list.length) {
    hooks._list.push({});
  }

  return hooks._list[index];
}
/**
 * 
 * @param {*} reducer 
 * @param {*} initialState 
 * @param {*} init 
 * @returns 
 */


function useReducer(reducer, initialState, init) {
  var hookState = getHookState(currentIndex++); // 返回state和action 

  if (!hookState._component) {
    hookState._component = currentComponent;
    hookState._value = [init ? init(initialState) : initialState, function (action) {
      var nextState = reducer(hookState._value[0], action);

      if (nextState !== hookState._value[0]) {
        hookState._value = [nextState, hookState._value[1]]; // todo 函数组件刷新方法
        // 源代码的方法？ 为什么要这么做？ 强制刷新？
        // 函数组件只是借用一下？

        hookState._component.setState({});
      }
    }];
  } // 返回value 和 dispatch


  return hookState._value;
}

function useState(initialState) {
  return useReducer(function (state, action) {
    return typeof action === 'function' ? action(state) : action;
  }, initialState);
}

function useEffect(effect, deps) {
  var hookState = getHookState(currentIndex++);

  if (!hookState.deps || hookState._deps !== deps) {
    hookState._deps = deps;
    hookState._value = effect; // 渲染之后异步执行

    currentComponent._hooks._pendingEffects.push(hookState);
  }
}

function useLayoutEffect(effect, deps) {
  var hookState = getHookState(currentIndex++);

  if (!hookState.deps || hookState._deps !== deps) {
    hookState._deps = deps;
    hookState._value = effect; // 渲染之后同步执行

    currentComponent._renderCallbacks.push(hookState);
  }
} // 如果没有传依赖 每次都会执行


function useMemo(factory, deps) {
  var hookState = getHookState(currentIndex++);

  if (!hookState.deps || hookState._deps !== deps) {
    hookState._deps = deps;
    hookState._value = factory();
    hookState._factory = factory;
  }

  return hookState._value;
}

function useRef(initialValue) {
  return useMemo(function () {
    return {
      current: initialValue
    };
  }, []);
}

function useCallback(callback, deps) {
  return useMemo(function () {
    return callback;
  }, deps);
} //为什么 useErrorBoundary 不在react实现


function useErrorBoundary(cb) {
  var hookState = getHookState(currentIndex++);

  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      errValue = _useState2[0],
      setErrValue = _useState2[1];

  hookState._value = cb;

  if (!currentComponent.componentDidCatch) {
    currentComponent.componentDidCatch = function (err) {
      if (state._value) state._value(err);
      setErrValue(err);
    };
  }

  return [errValue, function () {
    setErrValue(undefined);
  }];
}

function invokeEffect(hook) {
  var comp = currentComponent;
  hook._cleanup = hook._value();
  currentComponent = comp;
}

function invokeCleanup(hook) {
  var comp = currentComponent;
  if (typeof hook._cleanup == 'function') hook._cleanup();
  currentComponent = comp;
}
},{"./options":"../src/options.js"}],"hooks.jsx":[function(require,module,exports) {
"use strict";

var _src = _interopRequireDefault(require("../src"));

var _render = require("../src/render");

var _hooks = require("../src/hooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// 函数组件继承Component,render = doRender
function App() {
  var _useState = (0, _hooks.useState)('state'),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1];

  (0, _hooks.useEffect)(function () {
    console.log('执行effect');
  }, [value]);
  (0, _hooks.useLayoutEffect)(function () {
    console.log('执行useLayoutEffect');
  }, [value]);

  var changeValue = function changeValue() {
    setValue('change');
  };

  return /*#__PURE__*/_src.default.createElement("div", null, /*#__PURE__*/_src.default.createElement("p", null, "simple react: hooks"), /*#__PURE__*/_src.default.createElement("button", {
    onClick: changeValue
  }, "\u66F4\u6539state\u7684\u503C"), /*#__PURE__*/_src.default.createElement("p", null, value));
}

var root = document.querySelector('#root');

_src.default.render( /*#__PURE__*/_src.default.createElement(App, null), root);
},{"../src":"../src/index.ts","../src/render":"../src/render.ts","../src/hooks":"../src/hooks.js"}],"../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
},{}]},{},["../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","hooks.jsx"], null)
//# sourceMappingURL=/hooks.91b775a0.js.map