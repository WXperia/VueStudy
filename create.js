import Vue from "vue";

export default function create(Component, props) {
  const vm = new Vue({
    render(h) {
      return h(Component, { props });
    }
    //用来挂载到虚拟dom上进行更新
  }).$mount();
  //通过vm 获取实例
 
  //挂载真实的dom节点
  document.body.append(vm.$el);
  const comp = vm.$children[0];
  //清理函数
  comp.remove = () => {
    //移除真实dom节点
    document.body.removeChild(vm.$el);
    //销毁vm实例对象npm run
    vm.$destroy();
  };
  return comp; 
}
