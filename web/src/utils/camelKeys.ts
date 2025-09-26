function camelString(str: string) {
  const s = str.replace(/[-_\s]+(.)?/g, (match, chr) => (chr ? chr.toUpperCase() : ''))
  return s.slice(0, 1).toLowerCase() + s.slice(1)
}

// Source: https://github.com/knadh/listmonk/blob/master/frontend/src/utils.js
// camelKeys recursively camelCases all keys in a given object (array or {}).
// For each key it traverses, it passes a dot separated key path to an optional testFunc() bool.
// so that it can camelcase or leave a particular key alone based on what testFunc() returns.
// eg: The keypath for {"data": {"results": ["created_at": 123]}} is
// .data.results.*.created_at (array indices become *)
// testFunc() can examine this key and return true to convert it to camelcase
// or false to leave it as-is.
function camelKeys(obj: object, testFunc?: (keyPath: string) => boolean, keys?: string): object {
  if (obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((o: object) => camelKeys(o, testFunc, `${keys || ''}.*`))
  }

  if (obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const keyPath = `${keys || ''}.${key}`
      let k = key

      // If there's no testfunc or if a function is defined and it returns true, convert.
      if (testFunc === undefined || testFunc(keyPath)) {
        k = camelString(key)
      }

      return {
        ...result,
        [k]: camelKeys(obj[key as keyof object], testFunc, keyPath),
      }
    }, {})
  }

  return obj
}

export default camelKeys
