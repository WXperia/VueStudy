//这俩时Vue 1.0中的方法，在2.0中被删除，这里做了一个实现，用于解决跨组件的事件派发
//componentName主要是用来提高性能做优化的，并且需要在每个vue文件中自己去写好。vue原生是没有这个属性的。
Vue.prototype.$dispatch = function (componentName, eventName, data) {
    //使用apply 为了使用apply []数组形式传参的特性
    dispatch.apply(this, [componentName, eventName].concat(data))
  }
function dispatch(componentName, eventName, data) {
    console.log('dispatch')
    let parent = this.$parent || this.$root
    let name = parent.$options.componentName
    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;
      //这里继续找
      if (parent) {
        name = parent.$options.componentName
      }
    }
    //上面的循环中，如果找到了对应的componentName，就将事件派发，如果没有则继续找
    if (parent) {
      parent.$emit.apply(parent, [eventName].concat(data))
    }
  
  }
  Vue.prototype.$boardcast = function (componentName, eventName, data) {
    boardcast.call(this, componentName, eventName, data)
  }
  
  function boardcast(componentName, eventName, data) {
      
    this.$children.forEach(child => {
        //这里获取每个子组件的组件名，
      let name = child.$option.componentName
      if (name === componentName) {
        child.$emit.apply(child, [eventName].concat(data))
      } else {
        broadcast.apply(child, [componentName, eventName].concat([params]));
      }
  
    })
  }