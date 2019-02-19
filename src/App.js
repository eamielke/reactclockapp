import React, {Component} from 'react';
import './App.css';
import ClockFace from "./ClockFace";

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="clockFace">
                    <ClockFace faceDiameter="200" displayStats={true}/>
                </div>
                <div className="clockFace">
                    <ClockFace faceDiameter="100" displayStats={false} timeZone="America/Los_Angeles"/>
                </div>
                <div className="clockFace">
                    <ClockFace faceDiameter="100" displayStats={false} timeZone="Europe/London"/>
                </div>
            </div>
        );
    }
}

export default App;
