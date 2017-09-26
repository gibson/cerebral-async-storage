function getStorageFactory(key) {
  function getStorage({ asyncStorage, resolve }) {
    return {
      value: asyncStorage.get(resolve.value(key)),
    }
  }

  return getStorage
}

export default getStorageFactory
