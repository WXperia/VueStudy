let Vue;

function install(_vue) {
  Vue = _vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

class store {
  constructor(options = {}) {
    this.state = new Vue({
      data: options.state,
    });
    this.mutations = options.mutations || {};
    this.actions = options.actions || {};
    options.getters && this.initGetters(options.getters);
  }
  commit = (type, arg) => {
    this.mutations[type](this.state, arg);
  }
  dispatch = (type, arg) => {
    return this.actions[type]({ commit: this.commit }, arg);
  }
  initGetters = (getters) => {
    Object.keys(getters).forEach((key) => {
      Object.defineProperty(getters[key], key, {
        get: () => {
          return getters[key](this.state);
        },
      });
    });
  };
}
