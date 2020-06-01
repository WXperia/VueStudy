//compile

class Compile {
    constructor(el, vm) {
        this.$el = document.querySelector(el)
        console.log(this.$el)
        this.$vm = vm
        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el)
            this.compile(this.$fragment)
            this.$el.appendChild(this.$fragment)
        }
    }
    //获取所有节点
    node2Fragment(el) {
        const fragment = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
    //编译过程
    compile(el) {
        let childNodes = el.childNodes
        // console.log(childNodes)
        Array.from(childNodes).forEach(node => {
            if (this.isElement(node)) {
                if (node.childNodes && node.childNodes.length) {
                    this.compile(node)
                }
            } else if (this.isInterpolation(node)) {
                this.compileText(node)
            }

        })

    }
    compileText(node){
       this.update(node,this.$vm,RegExp.$1,'text')
    }
    textUpdater(node,value){
        node.textContent = value
    }
    update(node,vm,exp,dir){
        //这样就会自动根据类型去更新对应的textUpdater
        const updateFn = this[`${dir}Updater`];
        updateFn && updateFn(node,vm[exp]);
        //值发生改变的时候调用new Watcher
        new Watcher(vm,exp,function(value){
            updateFn && updateFn(node,value)
        })
    }
    isElement(node) {
        return node.nodeType === 1
    }
    isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

} 