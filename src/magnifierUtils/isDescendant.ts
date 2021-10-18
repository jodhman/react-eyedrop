export const isDescendant = (parent, child) => {
  let node = child
  while (node != null) {
    if (node === parent) {
      return true
    }
    node = node.parentNode
  }
  return false
}
