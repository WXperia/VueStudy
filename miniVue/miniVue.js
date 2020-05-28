//vue的工作机制
//Vue的响应式原理
//Vue编译器
//依赖收集
let isObject = function(o){
    return  Object.prototype.toString.call(o) === '[object Object]'
   }
class miniVue {
    constructor(options) {
        this.$options = options;

        //数距响应化

        this.$data = options.data;

        this.observe(this.$data)
    }
    observe(data){
        if(!data || !isObject(data)){
            return;
        }
        Object.keys(data).forEach(key=>{
                this.defineReactive(data,key,data[key])
        })
    } 
    defineReactive(data,key,val){
        this.observe(val)
        const dep = new Dep()
        Object.defineProperty(data,key,{
            get(){
                Deps.target && dep.addDep(Dep.target)
                return val;
            },
            set(newVal){
                if(val===newVal){
                    return;
                }else {
                    dep.notify()
                    val = newVal;
                }
                
            }
        })
    }
}

class Dep {
    constructor (){
        this.deps = []
    }
    addDep(dep){
        this.deps.push(dep)
    }
    notify(val){
        this.deps.forEach(dep=>
            dep.upDate(val)
        )
    }
}

class Watcher {
    constructor(){
        Deps.target = this
    }
    upDate(val){
        console.log('???????')
    }
}