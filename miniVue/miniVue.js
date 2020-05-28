//vue的工作机制
//Vue的响应式原理
//Vue编译器
//依赖收集
let isObject = function (o) {
  return Object.prototype.toString.call(o) === "[object Object]";
};
class miniVue {
  constructor(options) {
    this.$options = options;

    //数距响应化

    this.$data = options.data;

    this.observe(this.$data);
    new Watcher(this,'test');
    this.test
    new Watcher(this,'fool.bar')
    this.fool.bar
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
    Object.defineProperty(this,key,{
        get(){
            return this.$data[key]
        },
        set(newVal){
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
  constructor(vm,key) {
      //创建实例时，立刻将该实例指向Dep.target
    Dep.target = this;
    this.vm = vm
    this.key = key
  }
  upDate() {
    console.log(this.key+`${this.vm}`);
  }
}
