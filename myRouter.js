let Vue;
class mVueRouter {
  constructor(options) {
    this.$options = options;
    //创建一个路由path和route映射
    this.routeMap = {};
    //将来当前路径current需要响应式
    //利用vue响应式原理可以做到这一点
    this.app = new Vue({
      data: {
        current: "/"
      }
    });
  }
  init() {
    //解析路由配置
    this.bindEvent();
    //初始化路由地址配置
    this.createRouteMap(this.$options);
    //全局挂载两个组件
    this.initComponent();
  }
  createRouteMap(options) {
    options.routes.forEach(item => {
      // '/home':object {}
      this.routeMap[item.path] = item;
    });
  }
  bindEvent() {
    window.addEventListener("load", this.onHashChange.bind(this),false);
    window.addEventListener("hashchange", this.onHashChange.bind(this),false);
  }
  onHashChange(e) {
    this.app.current = window.location.hash.slice(1) || "/";
  }
  initComponent() {
    Vue.component("router-view", {
      //h函数方式实现
      render: h =>  {
        //获取需要渲染的函数
        let component = this.routeMap[this.app.current].component;
        return h(component);
      }
      //react jsx方式实现 需要
      /*   render(h) {
                return <a href={this.to}>{this.$slots.default}</a>
            }  */
    });
    Vue.component("router-link", {
      props: {
        to: String
      },
      //使用箭头函数 这里的this指向了 mVUeRouter
      render(h) {
        return h(
          "a",
          {
            attrs: {
              href: "#" + this.to
            }
          },
          this.$slots.default
        );
      }
      //react jsx方式实现 需要
      /*   render(h) {
                return <a href={this.to}>{this.$slots.default}</a>
            }  */
    });
  }
}

mVueRouter.install = function(_vue) {
  /* 
          Vue.use()会调用这个install方法，将 _vue 实例传进来
      */
  _vue.mixin({
    beforeCreate() {
      //这里的代码将来会在初始化的时候被调用
      //将router挂载到prototype上
      //这里检查Vue实例是否已经有了对应的router实例保证router只挂载一次
      if (this.$options.router) {
        /* 
                    在new Vue({
                        router
                    })时起作用
                */
        Vue.prototype.$router = this.$options.router;
        //初始化组件
        this.$options.router.init();
      }
      // Vue.prototype.$router = this.$options.router;
    }
  });
  Vue = _vue;
  //在beforeCreate钩子前挂载router实例到根节点上
};

export default mVueRouter;
