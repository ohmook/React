import React, { Component } from "react";
import ReactDom from "react-dom";
import img from "react-image";
import App from './components/App';
import {sum, minus} from './js/lib/test.js';
import {testa, testb} from './js/lib/test.js';
import * as test2 from './js/lib/test.js';
import {testa as testta2} from './js/lib/test.js';
import test from './js/lib/test.js';
import FormContainer from './js/components/container/FormContainer.js';
//import $fn from './js/lib/cascade_2.js';


// const rootElement = document.getElementById('root');
// ReactDOM.render(<App />, rootElement);

//const rootElement = document.getElementById('root');
//ReactDOM.render(<FormContainer />, rootElement);

ReactDom.render(<FormContainer/>, document.querySelector('#root'));

sum(1,2);
minus(3, 4);

console.log("===", testa);
testb("정묵1112");
console.log("===", testa);


test2.sum(11, 12);

console.log("last=>", testta2);

console.log(test2.plus2(12, 13));

console.log(test(12, 13));

console.log("::::");

////////LinkedList//////////

var Node = function(item){
    this.element = item;
    this.next = null;
    this.priv = null;
};

var LinkedList = function(){

    var head = new Node('head');

    this.head = head;
    this.find = LinkedList.find;
    this.insert = LinkedList.insert;
}

LinkedList.find = function(item){
    var head = this.head;

    while(item && head.next && head.element !== item){
        head = head.next;
    }

    return head;
};

LinkedList.insert = function(item){
    var fnode = this.find(item),
        nnode = new Node(item);

    nnode.next = fnode.next;
    fnode.next = nnode;
    nnode.priv = fnode;
};

var llist = new LinkedList;

llist.insert("test1");
llist.insert("test2");
llist.insert("test3");
llist.insert("test3");
llist.insert("test4");
llist.insert("test2");
llist.find('test2');
llist.find('test4');
llist.find('test5');
console.log("llist", llist);


var linkedList = function(){
    var llist = Object.create(linkedList.method);

    llist.head = new Node('head');

    return llist;
}

linkedList.method = {
    find : function(item){
        var head = this.head;

        while(item && head.next && head.element !== item){
            head = head.next;
        }

        return head;
    },
    insert : function(item){
        var fnode = this.find(item),
            nnode = new Node(item);

        nnode.next = fnode.next;
        fnode.next = nnode;
        nnode.priv = fnode;
    }
};

var llist2 = linkedList();

llist2.insert("test1");
llist2.insert("test2");
llist2.insert("test3");
llist2.insert("test3");
llist2.insert("test4");
llist2.insert("test2");
llist2.find('test2');
llist2.find('test4');
llist2.find('test5');

var llist3 = linkedList();

llist3.insert("test11");
llist3.insert("test22");
llist3.insert("test33");
llist3.insert("test33");
llist3.insert("test44");
llist3.insert("test22");
llist3.find('test22');
llist3.find('test43');
llist3.find('test55');

console.log("llist", llist2);
console.log("llist", llist3);


var linkedList2 = function(){
    var newl = Object.create(linkedList2.method),
        head = new Node('head');

    newl.head = head;
    newl.head.next = head;
    newl.head.priv = head;

    return newl;
}

linkedList2.method = {

    find : function(item){
        var head = this.head;

        while(item && head.next.element !== 'head' && head.element !== item){
            head = head.next;
        }

        return head;
    },
    insert : function(item){
        var fnode = this.find(item),
            nnode = new Node(item);

        nnode.next = fnode.next;
        fnode.next = nnode;
        nnode.priv = fnode;
    }
};

var llist3 = linkedList2();

llist3.insert("test111");
llist3.insert("test222");
llist3.insert("test333");
llist3.insert("test333");
llist3.insert("test444");
llist3.insert("test222");

console.log(llist3);

