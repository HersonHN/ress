export function get<T>(
  item: string,
  options: {
    clearIfFails?: boolean;
    default?: T;
  } = {},
) {
  console.log('local-storage get', item);

  const obj = localStorage.getItem(item);
  if (!obj) {
    if (options.default) {
      console.log('local-storage', item, 'not in storage, returning default', options.default);
      return options.default as T;
    }

    console.log('local-storage', item, 'not in storage');
    return;
  }

  try {
    console.log('local-storage', item, '=', obj);
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
  console.log('local-storage set', item);

  let json = JSON.stringify(value);
  localStorage.setItem(item, json);
}
