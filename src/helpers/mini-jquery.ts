// jquery like functions

export function find(query: string, parent?: Document | Element): Element[] {
  parent = parent ?? document;

  if (Array.isArray(parent)) {
    parent = parent[0];
    if (!parent) throw 'Empty array';
  }
  let elements = parent.querySelectorAll(query);
  return Array.from(elements);
}

export function findOne(query: string, parent?: Document | Element): Element | null {
  return find(query, parent)[0];
}

export function id(str: string): Element | null {
  return document.getElementById(str);
}

export function is(el: Element, query: string) {
  return el.matches(query);
}

export function isHidden(element: HTMLElement) {
  let style = window.getComputedStyle(element);
  let isDisplayNone = style.display === 'none';
  let isVisiblityHidden = style.visibility === 'hidden';
  let noOffset = !element.offsetWidth && !element.offsetHeight;
  let isHidden = isDisplayNone || isVisiblityHidden || noOffset;
  return isHidden;
}

export function isVisible(element: HTMLElement) {
  return !isHidden(element);
}

export function addClass(element: Element, className: string) {
  element.classList.add(className);
}

export function removeClass(element: Element, className: string) {
  element.classList.remove(className);
}

export function trigger(element: Element, eventName: string, data: Record<string, unknown>) {
  let event = new CustomEvent(eventName, { detail: data });
  event.initEvent(eventName, true, false);
  element.dispatchEvent(event);
}

export default {
  find,
  findOne,
  id,
  addClass,
  removeClass,
  is,
  isHidden,
  isVisible,
  trigger,
};
