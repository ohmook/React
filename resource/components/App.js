import React, { Component } from "react";

class App extends Component {
    
    getName(){
        return "묵1";
    }
    name2(){
        alert(this.getName());
    }

    render(){
        return (
            <div>
                <h1>Cascade22</h1>
                <button onClick={this.name2.bind(this)}>TEST</button>
            </div>
        );
    }
}


export default App;