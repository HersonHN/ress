// jquery like functions

function find(query, parent) {
  parent = parent || document;
  if (Array.isArray(parent)) {
    parent = parent[0];
    if (!parent) throw 'Empty array';
  }
  let elements = parent.querySelectorAll(query);
  return Array.from(elements);
}

function findOne(query, parent) {
  return find(query, parent)[0];
}

function id(str) {
  return document.getElementById(str);
}

function is(el, query) {
  let func = 
    el.matches || 
    el.matchesSelector || 
    el.msMatchesSelector || 
    el.mozMatchesSelector || 
    el.webkitMatchesSelector ||
    el.oMatchesSelector;
    
  return func.call(el, query);
}

function addClass(element, className) {
  element.classList.add(className);
}

function removeClass(element, className) {
  element.classList.remove(className);
}

export default {find, findOne, id, is, addClass, removeClass};