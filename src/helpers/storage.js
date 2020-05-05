
export function get(item, { clearIfFails } = {}) {
  let obj = localStorage.getItem(item);
  if (!obj) return;

  try {
    obj = JSON.parse(obj);
    return obj;
  } catch(e) {
    if (e instanceof SyntaxError) {
      console.error(`${item} JSON malformed at localStorage`);
      if (clearIfFails) localStorage.removeItem(item);
    }
  }
}

export function set(item, value) {
  let json = JSON.stringify(value);
  localStorage.setItem(item, json);
}