//vue的工作机制
//Vue的响应式原理
//Vue编译器
//依赖收集
//compile

const isObject = function (o) {
  return Object.prototype.toString.call(o) === "[object Object]";
};
class miniVue {
  constructor(options) {
    this.$options = options;
    //数距响应化
    this.$data = options.data;
    this.observe(this.$data);
    callHook(this,'beforeCreate')
    // new Watcher(this,'test');
    // this.test
    // new Watcher(this,'fool.bar')
    // this.fool.bar
    new Compile(options.el,this);
    callHook(this,'created')
  }
  observe(data) {
    if (!data || !isObject(data)) {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
      this.dataPoxy(key)
    });
  }
  defineReactive(data, key, val) {
    this.observe(val);
    const watcher = new Dep();
    Object.defineProperty(data, key, {
      get() {
          //Dep.target === Watcher
        Dep.target && watcher.addWatcher(Dep.target);
        return val;
      },
      set(newVal) {
        if (val === newVal) {
          return;
        } else {
          val = newVal;
          watcher.notify();
        }
      },
    });
  }
  dataPoxy(key){
    //   this[key] = this.$data[key]
      //想了想，感觉有点问题，还是换了上面这种方法。
    Object.defineProperty(this,key,{
        get(){
            return this.$data[key]
        },
        set(newVal){
          //触发在$data上各个属性的set属性
            this.$data[key] = newVal
        }
    })
  }
}

class Dep {
  constructor() {
      //存贮所有的依赖
    this.watchers = [];
  }
  addWatcher(watcher) {
    this.watchers.push(watcher);
  }
  notify(val) {
    this.watchers.forEach((watcher) => watcher.upDate());
  }
}

class Watcher {
  constructor(vm,key,cb) {
      //创建实例时，立刻将该实例指向Dep.target
    this.vm = vm
    this.key = key
    this.cb = cb
    Dep.target = this;
    this.vm[this.key]
    Dep.target = null;
  }
  upDate() {
    this.cb.call(this.vm,this.vm[this.key])
  }
}
