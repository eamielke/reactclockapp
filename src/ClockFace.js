import React, {Component} from 'react';
import { DateTime } from 'luxon';

class ClockFace extends Component {

    constructor(props) {

        super(props);

        this.state = {
            hour: this.getCurrentHour(),
            minute: this.getCurrentMinute(),
            seconds: this.getCurrentSeconds(),
            ms: this.getCurrentMs(),
            tickingSecondHand: true
        };

        this.toggleTicking = this.toggleTicking.bind(this);

    }

    getFaceDiameter() {
        return this.props.faceDiameter - 30;
    }

    getTimeZone() {
        let tz = 'local';
        if (this.props.timeZone) {
            tz = this.props.timeZone;
        }
        return tz;
    }

    getCurrentDate() {
        let local = DateTime.local();
        return local.setZone(this.getTimeZone());
    }

    getCurrentHour() {

        return this.getCurrentDate().hour;

    }

    getCurrentMinute() {
        return this.getCurrentDate().minute;
    }

    getCurrentSeconds() {
        return this.getCurrentDate().second;
    }

    getCurrentMs() {
        return this.getCurrentDate().millisecond;
    }

    getHourAngle() {
        return this.calculateHourAngle(this.state.hour, this.state.minute);
    }

    getMinuteAngle() {
        return this.calculateMinuteAngle(this.state.minute, this.state.seconds);
    }

    getSecondsAngle() {

        return this.calculateSecondsAngle(this.state.seconds, this.state.ms);
    }


    calculateHourAngle(hour, minute) {

        if (hour > 12) {
            hour = hour - 12;
        }

        return (30 * (hour % 12)) + (minute / 2);
    }

    calculateMinuteAngle(minute, seconds) {

        return 6 * (minute % 60) + seconds / 10;
    }


    calculateSecondsAngle(seconds, ms) {
        let accurateSec = seconds;
        if (!this.state.tickingSecondHand) {
            accurateSec = (seconds) + ms / 1000;
        }

        return (6 * (accurateSec % 60));
    }


    updateTime() {
        this.setState({
            hour: this.getCurrentHour(),
            minute: this.getCurrentMinute(),
            seconds: this.getCurrentSeconds(),
            ms: this.getCurrentMs()
        });

        const ctx = this.refs.canvasForeGround.getContext('2d');
        ctx.webkitImageSmoothingEnabled = true;
        this.resetClockFace(ctx);
        this.drawHand(ctx, this.getHourAngle(), 'black', 4, .80 * this.getFaceDiameter() / 2);
        this.drawHand(ctx, this.getMinuteAngle(), 'blue', 2, .95 * this.getFaceDiameter() / 2);
        this.drawHand(ctx, this.getSecondsAngle(), 'red', 1, .98 * this.getFaceDiameter() / 2);

    }

    formatTime(time) {
        if ((time + "").length < 2) {
            return "0" + time;
        } else {
            return time;
        }
    }


    resetClockFace(ctx) {
        ctx.resetTransform();
        ctx.clearRect(0, 0, this.props.faceDiameter, this.props.faceDiameter);
        ctx.translate(this.props.faceDiameter / 2, this.props.faceDiameter / 2);
    }

    drawDial(ctx) {
        ctx.webkitImageSmoothingEnabled = true;
        this.resetClockFace(ctx);
        ctx.arc(0, 0, this.getFaceDiameter() / 2, 0, 2 * Math.PI);
        ctx.stroke();
        this.drawHourMarks(ctx);
        this.drawMinuteMarks(ctx);
    }

    drawHourMarks(ctx) {

        for (let i = 0; i < 13; i++) {
            ctx.save();
            ctx.rotate((this.calculateHourAngle(i, 0, 0)) * Math.PI / 180);
            ctx.fillRect(.90 * this.getFaceDiameter() / 2 - 10, -1.5, 10, 3);
            ctx.restore();

        }

    }

    drawMinuteMarks(ctx) {

        for (let i = 0; i < 60; i++) {
            ctx.save();
            ctx.rotate((this.calculateMinuteAngle(i, 0, 0)) * Math.PI / 180);
            ctx.fillRect(0.90 * this.getFaceDiameter() / 2 - 5, -0.5, 5, 1);
            ctx.restore();

        }

    }

    drawHand(ctx, angle, color, handWidth, handLength) {
        ctx.save();
        ctx.rotate((angle - 90) * Math.PI / 180);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fillRect(0, -0.5 * handWidth, handLength, handWidth);
        ctx.restore();
    }


    componentDidMount() {
        this.interval = setInterval(() => this.updateTime(), 50);
        const ctx = this.refs.canvasBackground.getContext('2d');
        this.drawDial(ctx);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    toggleTicking() {
        this.setState({
            hour: this.getCurrentHour(),
            minute: this.getCurrentMinute(),
            seconds: this.getCurrentSeconds(),
            ms: this.getCurrentMs(),
            tickingSecondHand: !this.state.tickingSecondHand
        });
    }


    getStatsTable() {

        return (<div className="centeredTable">
            <table className="centeredTable">
                <tbody>
                <tr>
                    <td className="headerCell">Hour Angle</td>
                    <td className="valueCell">{this.getHourAngle()} degrees</td>
                </tr>
                <tr>
                    <td className="headerCell">Minute Angle</td>
                    <td className="valueCell">{this.getMinuteAngle()} degrees</td>
                </tr>
                <tr>
                    <td className="headerCell">Second Angle</td>
                    <td className="valueCell">{this.getSecondsAngle().toFixed(2)} degrees</td>
                </tr>
                </tbody>
            </table>
            <table className="centeredSmallTable">
                <tbody>
                <tr>
                    <td>{this.formatTime(this.state.hour)}:</td>
                    <td>{this.formatTime(this.state.minute)}:</td>
                    <td>{this.formatTime(this.state.seconds)}</td>
                </tr>
                </tbody>
            </table>
        </div>);
    }


    render() {
        let statsTable;

        if (this.props.displayStats) {
            statsTable = this.getStatsTable();
        }

        let tz;

        if (this.props.timeZone) {
            tz = this.props.timeZone;
        } else {
            tz = this.getCurrentDate().zone.name;
        }

        return (
            <div>

                {statsTable}

                <div onClick={this.toggleTicking} className="analogClock" title={tz}
                     style={{width: this.props.faceDiameter + 'px', height: this.props.faceDiameter + 'px'}}>
                    <canvas className="canvasForeGround" ref="canvasForeGround" width={this.props.faceDiameter}
                            height={this.props.faceDiameter}/>
                    <canvas className="canvasBackGround" ref="canvasBackground" width={this.props.faceDiameter}
                            height={this.props.faceDiameter}/>
                </div>
            </div>
        )
    }
}

export default ClockFace;