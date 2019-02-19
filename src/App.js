import React, {Component} from 'react';
import './App.css';
import ClockFace from "./ClockFace";

class App extends Component {
    render() {
        return (
            <div className="App mainDiv">
                <div className="clockDiv">
                    <ClockFace faceDiameter="200" displayStats={false} />
                </div>
                <div className="clockDiv">
                    <ClockFace faceDiameter="100" displayStats={false} timeZone="America/Los_Angeles"
                               drawMinuteMarks={true} xScaleFactor="2" yScaleFactor="1"/>
                </div>
                <div className="clockDiv">
                    <ClockFace faceDiameter="100" displayStats={false} timeZone="Europe/London" drawHourMarks={false}/>
                </div>
                <div className="clockDiv">
                    <ClockFace faceDiameter="100" displayStats={false} timeZone="Europe/Istanbul"
                               drawMinuteMarks={false} xScaleFactor="2"/>
                </div>
            </div>
        );
    }
}

export default App;
