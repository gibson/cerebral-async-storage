import {AsyncProvider} from './AsyncProvider';

function StorageProvider({prefix = null} = {}) {
  let provider = null;

  function createProvider(context) {
    provider = new AsyncProvider({prefix});
    context.controller.on('flush', provider.handler.bind(null, context.controller));
    return provider;
  }

  return (context) => {
    context.asyncStorage = provider = provider || createProvider(context);

    return context;
  };
}

export default StorageProvider;
