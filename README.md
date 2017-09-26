# cerebral async storage

## Install
**NPM**

`npm install cerebral-async-storage`

## Description
This module exposes react-native async storage as a provider,
where it by default parses and serializes to JSON.

The main feature - you can synchronize your app state with async storage and auto restore state on app starting.

## Instantiate

```js
import {Controller} from 'cerebral'
import StorageProvider from 'cerebral-async-storage'

const controller = Controller({
  providers: [StorageProvider({
    // Set prefix for your application, its optional
    prefix: 'somePrefix'
  })]
})
```
## Auto sync
For auto sync your state you need define your module as a function, like this:
```javascript
import {restoreState} from 'cerebral-async-storage/operators';

export default ({path, controller}) => {
  controller.on('initialized', () => {
    // run signal with the $NAME$ - anything like restoreAuthState
    controller.runSignal('$NAME$', [restoreState], {
       path, // path for keys like @app@
       keys: ['status', 'profile'] // keys for sync from current module 
     });
  });

  return {
    state: {
      status: true,
      profile: {
        name: "John Dow"
      }
    },
    signals: {},
    modules: {}
  }
}
```

# Base actions
## get
Get data from storage.

*action*
```javascript
function someAction({asyncStorage}) {
  const data = asyncStorage.get('someKey')
}
```

*operator*
```javascript
import {state, props} from 'cerebral/tags'
import {getStorage} from 'cerebral-async-storage/operators'

export default [
  getStorage('someKey'),
  function someAction ({props}) {
    props.value // Whatever was on "someKey"
  }
]
```

## remove
Remove data from storage.

*action*
```javascript
function someAction({asyncStorage}) {
  asyncStorage.remove('someKey')
}
```

*operator*
```javascript
import {state} from 'cerebral/tags'
import {removeStorage} from 'cerebral-async-storage/operators'

export default [
  removeStorage(state`currentStorageKey`)
]
```

## set
Write data to storage.

*action*
```javascript
function someAction({asyncStorage}) {
  asyncStorage.set('someKey', {foo: 'bar'})
}
```

*operator*
```javascript
import {state, props} from 'cerebral/tags'
import {setStorage} from 'cerebral-async-storage/operators'

export default [
  setStorage(state`currentStorageKey`, props`someData`)
]
```
