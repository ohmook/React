export function sum(...args){
    let [b ,a] = args;
    console.log("SUM A="+a+",B="+b);
}

function minus(...args){
    let [b ,a] = args;

    console.log("MINUS="+(b-a));
}

export {minus};

export var testa = "오";

export function testb(val){
    testa = val;
}


function plus(a, b){
    return a+b;
}


function defaults(){
    return "Result=>"+testa
}

export {plus as plus2}

export {defaults as default}