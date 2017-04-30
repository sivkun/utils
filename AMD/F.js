//向比保重传入模块管理器对象F（~屏蔽压缩文件时，前面漏写;报错）
~(function(F){
    //模块缓存。存储已经创建的模块
    var moduleCache = {};
    // F.moduleCache=moduleCache;
    F.module = function(url,modDeps,modCallback){
        var args = [].slice.call(arguments),
            callback = args.pop(),
            deps = (args.length&&args[args.length-1] instanceof Array) ? args.pop():[],
            url = args.length?args.pop():null,
            //依赖模块序列
            params = [],
            depsCount = 0,
            i=0,
            len;
        if(len = deps.length){
            while(i<len){
                (function(i){
                    depsCount++;
                    loadModule(deps[i],function(mod){
                        params[i]=mod;
                        depsCount--;
                        if(depsCount === 0){
                            setModule(url,params,callback);
                        }
                    });
                })(i);
                i++;
            }
        }else{
            setModule(url,[],callback);  
        }
    };
   var loadModule = function(moduleName,callback){
       var _module;
       if(moduleCache[moduleName]){
           _module = moduleCache[moduleName];
           if(_module.status === 'loaded'){
               setTimeout(callback(_module.exports),0);
           }else{
               _module.onload.push(callback);
           }
       }else{
           //此处在moduleCache中注册moduleName，由于loadModule只有在加载依赖时被调用，
           //因此只有模块被依赖，才能在moduleCache中注册moduleName.
           moduleCache[moduleName] = {
               moduleName : moduleName,
               status : 'loading',
               exports:null,
               onload:[callback]
           };
           loadScript(getUrl(moduleName));
       }
   };
   var getUrl = function(moduleName){
       return String(moduleName).replace(/\.js$/g,'')+'.js';
   };
   var loadScript = function(src){
       var _script = document.createElement('script');
       _script.type='text/JavaScript';
       _script.charset='UTF-8';
       _script.async=true;
       _script.src = src;
       document.getElementsByTagName('head')[0].appendChild(_script);
   };
   var setModule = function(moduleName,params,callback){
       var _module,fn;
       if(moduleCache[moduleName]){
           _module=moduleCache[moduleName];
           _module.status = 'loaded';
           _module.exports = callback?callback.apply(_module,params):null;
           while(fn = _module.onload.shift()){
               fn(_module.exports);
           }
       }else{
            callback&&callback.apply(null,params)
       }
   }
})((function(){
    return window.F = {}
})())