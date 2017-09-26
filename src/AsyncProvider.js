// @flow
import {AsyncStorage} from 'react-native';

export class AsyncProvider {
  prefix = '';
  syncPaths: Set<string> = new Set();

  constructor(options: { prefix: string }) {
    if (options && options.prefix) {
      this.prefix = options.prefix + '.';
    }
  }

  /**
   * handle change on cerebral flush event
   * @param controller cerebral controller
   * @param [changes]
   */
  handler = (controller: Object, changes: [Object]) => {
    const values = new Map();
    // iterate changes
    for (let i = 0; i < changes.length; i++) {
      let change = changes[i];
      // generate path for change
      let currentPath = change.path.join('.');
      // iterate items for sync
      this.syncPaths.forEach((path) => {
        // check current path for including to sync items
        if (currentPath.indexOf(path) === 0) {
          // getting value
          let value = controller.getState(path);
          values.set(this.prefix + path, AsyncProvider.serialize(value));
        }
      });
    }
    if (values.size > 0) {
      // if has items for sync
      AsyncStorage.multiSet(Array.from(values));
    }
  };

  registerPaths({path, keys}: { path: string, keys: Array<string> }) {
    const result = [];
    for (let i = 0; i < keys.length; i++) {
      const item = `${path}.${keys[i]}`;
      result.push(item);
      this.syncPaths.add(item);
    }

    return result;
  }

  static serialize(data: any) {
    return JSON.stringify(data);
  }

  static deserialize(data: string) {
    return JSON.parse(data);
  }

  /**
   * Returns array of values for keys in param [[key, value], [key2, value2]]
   * @param [keys]
   * @returns {Promise.<Array>}
   */
  async multiGet(keys: [string]) {
    // create object without prototype
    const result = [];
    const data = await AsyncStorage.multiGet(keys.map(key => this.prefix + key));
    for (let i = 0; i < data.length; i++) {
      let [name, value] = data[i];
      result.push([
        // replace name prefix
        name.replace(this.prefix, ''),
        // unpack value
        value ? AsyncProvider.deserialize(value) : null
      ]);
    }

    return result;
  }

  /**
   * Getting single value from storage
   * @param key
   * @returns {Promise.<*>}
   */
  async get(key: string) {
    const result = await AsyncStorage.getItem(this.prefix + key);
    if (result) {
      return AsyncProvider.deserialize(result);
    }

    return null;
  }

  /**
   * Setting single value to storage
   * @param key
   * @param value
   * @returns {Promise.<void>}
   */
  async set(key: string, value: any) {
    await AsyncStorage.setItem(this.prefix + key, AsyncProvider.serialize(value));
  }

  /**
   * Remove value from storage
   * @param key
   * @returns {Promise.<void>}
   */
  async remove(key: string) {
    await AsyncStorage.removeItem(this.prefix + key);
  }
}