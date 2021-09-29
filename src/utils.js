export function shallowCompare(a, b) {
  for (let i in a) if (!(i in b)) return true
  // 如何避免prop.children  = [] 前后都是
  for (let i in b) {
    // 暂时不对比 children是空数组的情况
    if(i === 'children' && !a[i].length  && !a[i].length) continue
    if (a[i] !== b[i]) return true
  }
  return false
}