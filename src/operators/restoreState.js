async function restoreState({asyncStorage, state}) {
  const keys = asyncStorage.getPaths();
  const data = await asyncStorage.multiGet(keys);
  for (let i = 0; i < data.length; i++) {
    let [path, value] = data[i];
    if (value) {
      state.set(path, value);
    }
  }
}

export default restoreState;
