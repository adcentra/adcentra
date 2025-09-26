function snakeString(str: string) {
  return str.replace(/[A-Z]/g, (match, offset) => (offset > 0 ? '_' : '') + match.toLowerCase())
}

// Source: https://github.com/knadh/listmonk/blob/master/frontend/src/utils.js
// snakeKeys recursively snake_cases all keys in a given object (array or {}).
// For each key it traverses, it passes a dot separated key path to an optional testFunc() bool.
// so that it can snake_case or leave a particular key alone based on what testFunc() returns.
// eg: The keypath for {"data": {"results": ["createdAt": 123]}} is
// .data.results.*.createdAt (array indices become *)
// testFunc() can examine this key and return true to convert it to snake_case
// or false to leave it as-is.
function snakeKeys(obj: object, testFunc?: (keyPath: string) => boolean, keys?: string): unknown {
  if (obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((o: object) => snakeKeys(o, testFunc, `${keys || ''}.*`))
  }

  if (obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const keyPath = `${keys || ''}.${key}`
      let k = key

      // If there's no testfunc or if a function is defined and it returns true, convert.
      if (testFunc === undefined || testFunc(keyPath)) {
        k = snakeString(key)
      }

      return {
        ...result,
        [k]: snakeKeys(obj[key as keyof object], testFunc, keyPath),
      }
    }, {})
  }

  return obj
}

export default snakeKeys
