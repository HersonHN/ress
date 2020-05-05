// jquery like functions

export function find(query, parent) {
  parent = parent || document;
  if (Array.isArray(parent)) {
    parent = parent[0];
    if (!parent) throw 'Empty array';
  }
  let elements = parent.querySelectorAll(query);
  return Array.from(elements);
}

export function findOne(query, parent) {
  return find(query, parent)[0];
}

export function id(str) {
  return document.getElementById(str);
}

export function is(el, query) {
  let func =
    el.matches ||
    el.matchesSelector ||
    el.msMatchesSelector ||
    el.mozMatchesSelector ||
    el.webkitMatchesSelector ||
    el.oMatchesSelector;

  return func.call(el, query);
}

export function isHidden(element) {
  let style = window.getComputedStyle(element);
  let isDisplayNone = (style.display === 'none');
  let isVisiblityHidden = (style.visibility === 'hidden');
  let noOffset = (!element.offsetWidth && !element.offsetHeight);
  let isHidden = (isDisplayNone || isVisiblityHidden || noOffset);
  return isHidden;
}

export function isVisible(element) {
  return !isHidden(element);
}

export function addClass(element, className) {
  element.classList.add(className);
}

export function removeClass(element, className) {
  element.classList.remove(className);
}

export function trigger(element, eventName) {
  let event = document.createEvent('HTMLEvents');
  event.initEvent(eventName, true, false);
  element.dispatchEvent(event);
}

export default {
  find, findOne, id,
  addClass, removeClass,
  is, isHidden, isVisible,
  trigger,
};