function removeStorageFactory(key) {
  function removeStorage({ asyncStorage, resolve }) {
    return {
      value: asyncStorage.remove(resolve.value(key)),
    }
  }

  return removeStorage
}

export default removeStorageFactory
