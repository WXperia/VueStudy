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
                if (node.childNodes && node.childNodes.length>0) {
                    this.compile(node)
                }
                this.compileAttr(node)
            } else if (this.isInterpolation(node)) {
                this.compileText(node)
            }

        })

    }
    compileEvent(node,attrName,funName){
        const dir = attrName.substring(1)
        this.bindEvent(node,dir,funName)
    }
    bindEvent(node,EventName,funName){
        console.log(node)
        console.log(this.$vm)
        const handerEvent = this.$vm.$options.methods && this.$vm.$options.methods[funName]
        console.log(handerEvent)
        console.log(EventName)
        if(handerEvent && EventName){
            node.addEventListener(EventName,handerEvent.bind(this.$vm))
        }
        
    }
    compileAttr(node){
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr=>{
            const attrName = attr.name;//属性名
            const exp = attr.value;//属性值
            if(this.isDirective(attrName)){
                const dir = attrName.split('-')[1]
                this[dir] && this[dir](node,this.$vm,exp)
            }
            if(this.isEvent(attrName)){ 
                this.compileEvent(node,attrName,exp)
            }
        })
    }
    isDirective(attrName){
        return attrName.indexOf('k-') === 0
    }
    isEvent(attrName){
        return attrName.indexOf('@') === 0
    }
    compileText(node){
       this.update(node,this.$vm,RegExp.$1,'text')
    }
    text(node,vm,exp){
        this.update(node,vm,RegExp.$1,'text')
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