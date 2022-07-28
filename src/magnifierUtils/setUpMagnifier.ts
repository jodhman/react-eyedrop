export const setUpMagnifier = (magnifier, magnifierContent) => {
  magnifierContent.innerHTML = ''
  magnifier.style.backgroundColor = magnifier.ownerDocument.body.style.backgroundColor
}
