import React, { Component } from "react";
import ReactDOM from "react-dom";
import img from "react-image";
import App from './components/App';
import {sum, minus} from './js/lib/test.js';
import {testa, testb} from './js/lib/test.js';


const rootElement = document.getElementById('root');

//rootElement.appendChild(<Img src='http://gw.aerix.co.kr/style/img/screenThema/thumbnail_03.jpg' />);

ReactDOM.render(<App />, rootElement);

sum(1,2);
minus(3, 4);

console.log("===", testa);
testb("정묵1112");
console.log("===", testa);