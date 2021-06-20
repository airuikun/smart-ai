// import "css.escape";

const defaultOpts = {
  // required opts
  Vue: null,
  appOptions: null,
  template: null
};

export default function singleSpaVue(userOpts) {
  if (typeof userOpts !== "object") {
    throw new Error(`single-spa-vue requires a configuration object`);
  }

  const opts = {
    ...defaultOpts,
    ...userOpts
  };

  if (!opts.Vue) {
    throw new Error("single-spa-vuejs must be passed opts.Vue");
  }

  if (!opts.appOptions) {
    throw new Error("single-spa-vuejs must be passed opts.appOptions");
  }

  // Just a shared object to store the mounted object state
  let mountedInstances = {};

  return {
    bootstrap: bootstrap.bind(null, opts, mountedInstances),
    mount: mount.bind(null, opts, mountedInstances),
    unmount: unmount.bind(null, opts, mountedInstances),
    update: update.bind(null, opts, mountedInstances)
  };
}

function bootstrap(opts) {
  console.log('初始化启动乐乐乐乐乐乐')
  if (opts.loadRootComponent) {
    return opts.loadRootComponent().then(root => (opts.rootComponent = root));
  } else {
    return Promise.resolve();
  }
}

function mount(opts, mountedInstances, props) {
  console.log('挂载乐乐乐乐乐乐乐乐')
  return Promise.resolve().then(() => {
    debugger
    const appOptions = { ...opts.appOptions };
    console.log(98765,appOptions)
    if (props.domElement && !appOptions.el) {
      appOptions.el = props.domElement;
    }

    if (!appOptions.el) {
      // console.log(99876)
      // debugger
      const htmlId = `single-spa-application:${props.name}`;
      appOptions.el = `#${CSS.escape(htmlId)} .single-spa-container`;
      let domEl = document.getElementById(htmlId);
      if (!domEl) {
        domEl = document.createElement("div");
        domEl.id = htmlId;
        document.body.appendChild(domEl);
      }

      // single-spa-vue@>=2 always REPLACES the `el` instead of appending to it.
      // We want domEl to stick around and not be replaced. So we tell Vue to mount
      // into a container div inside of the main domEl
      if (!domEl.querySelector(".single-spa-container")) {
        const singleSpaContainer = document.createElement("div");
        singleSpaContainer.className = "single-spa-container";
        domEl.appendChild(singleSpaContainer);
      }

      mountedInstances.domEl = domEl;
    }

    if (!appOptions.render && !appOptions.template && opts.rootComponent) {
      appOptions.render = h => h(opts.rootComponent);
    }

    if (!appOptions.data) {
      appOptions.data = {};
    }

    appOptions.data = { ...appOptions.data, ...props };
    mountedInstances.instance = new opts.Vue(appOptions);
    if (mountedInstances.instance.bind) {
      mountedInstances.instance = mountedInstances.instance.bind(
        mountedInstances.instance
      );
    }
    return mountedInstances.instance;
  });
  return Promise.resolve();
}

function update(opts, mountedInstances, props) {
  console.log('更新乐乐乐乐乐乐')
  return Promise.resolve().then(() => {
    const data = {
      ...(opts.appOptions.data || {}),
      ...props
    };
    for (let prop in data) {
      mountedInstances.instance[prop] = data[prop];
    }
  });
}

function unmount(opts, mountedInstances) {
  console.log('卸载了卸载ile哈哈哈哈哈')
  return Promise.resolve().then(() => {
    mountedInstances.instance.$destroy();
    mountedInstances.instance.$el.innerHTML = "";
    delete mountedInstances.instance;

    if (mountedInstances.domEl) {
      mountedInstances.domEl.innerHTML = "";
      delete mountedInstances.domEl;
    }
  });
}
