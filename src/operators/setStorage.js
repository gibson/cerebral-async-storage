function setStorageFactory(key, value) {
  function setStorage({ storage: asyncStorage, resolve }) {
    asyncStorage.set(resolve.value(key), resolve.value(value))
  }

  return setStorage
}

export default setStorageFactory
