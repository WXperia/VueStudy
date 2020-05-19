
// // import Vue from "vue";

// export default function create(Component, props) {
//   const vm = new Vue({
//     render(h) {
//       return h(Component, { props });
//     }
//     //用来挂载到虚拟dom上进行更新
//   }).$mount();
//   //通过vm 获取实例
 
//   //挂载真实的dom节点
//   document.body.append(vm.$el);
//   const comp = vm.$children[0];
//   //清理函数
//   comp.remove = () => {
//     //移除真实dom节点
//     document.body.removeChild(vm.$el);
//     //销毁vm实例对象npm run
//     vm.$destroy();
//   };
//   return comp; 
// }
//能够使用vue.use()挂载到实例中
let vue ;
class create {
  constructor(){
    this.Components = undefined;
    this.props = undefined
  }
  $create(Components,props){
    this.Components = Components;
    this.props = props
    const vm = new vue({
      render(h){
        return h(Components,{props})
      }
    }).$mount()
    document.body.append(vm.$el)
    const comp = vm.$children[0]
    comp.remove = ()=>{
      document.body.removeChild(vm.$el)
      vm.$destroy()
    }
    return comp
  }
}

create.install = function(_vue){
  
  // if(!_vue.prototype.$create){
    _vue.prototype.$create = this.prototype.$create
    vue = _vue
  // }
}

export default create