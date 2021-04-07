const throttle = (callback, limit) => {
    var wait = false;                 
    return function (...args) {               
        if (!wait) {                   
            callback.call(this, ...args);           
            wait = true;               
            setTimeout(function () {   
                wait = false;        
            }, limit);
        }
    }
}

export default throttle;