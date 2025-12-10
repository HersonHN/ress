export function get<T>(
  item: string,
  options: {
    clearIfFails?: boolean;
    default?: T;
  } = {},
) {
  const obj = localStorage.getItem(item);
  if (!obj) {
    if (options.default) {
      return options.default as T;
    }

    return;
  }

  try {
    const parsed = JSON.parse(obj);
    return parsed as T;
  } catch (e) {
    if (e instanceof SyntaxError) {
      console.error(`${item} JSON malformed at localStorage`);
      if (options.clearIfFails) localStorage.removeItem(item);
    }
  }
}

export function set(item: string, value: unknown) {
  let json = JSON.stringify(value);
  localStorage.setItem(item, json);
}
