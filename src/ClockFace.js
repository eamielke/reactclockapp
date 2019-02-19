import React, {Component} from 'react';
import {DateTime} from 'luxon';

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
        this.drawHand(ctx, this.getHourAngle(), 'black', 0.05 * (this.getFaceDiameter()),  0.02 * (this.getFaceDiameter()), .80 * this.getFaceDiameter() / 2);
        this.drawHand(ctx, this.getMinuteAngle(), 'blue', 0.05 * (this.getFaceDiameter()), 0.01 * (this.getFaceDiameter()), .90 * this.getFaceDiameter() / 2);
        this.drawHand(ctx, this.getSecondsAngle(), 'red', 1, 0.5, .90 * this.getFaceDiameter() / 2, true);
        this.drawCap(ctx);
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
        if (this.props.drawHourMarks) {
            this.drawHourMarks(ctx);
        }
        if (this.props.drawMinuteMarks) {
            this.drawMinuteMarks(ctx);
        }

        //this.drawDate(ctx);

    }

    drawDate(ctx) {
        ctx.font = '10px sans-serif';
        ctx.fillText(this.getCurrentDate().day, 0.55 * this.getFaceDiameter()/2, 1.5);
        ctx.stroke();
    }

    drawCap(ctx) {
        ctx.save();
        ctx.fillStyle = 'red';
        ctx.arc(0, 0, this.getFaceDiameter() / 30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }

    drawHourMarks(ctx) {

        let h = 0.015 * this.getFaceDiameter() * this.props.yScaleFactor;
        let w = 0.05 * this.getFaceDiameter() * this.props.xScaleFactor;
        let x = .90 * this.getFaceDiameter() / 2 - 0.05 * this.getFaceDiameter() * this.props.xScaleFactor;
        let y = -0.0075 * this.getFaceDiameter();

        for (let i = 0; i < 13; i++) {
            ctx.save();
            ctx.rotate((this.calculateHourAngle(i, 0, 0)) * Math.PI / 180);
            ctx.fillRect(x, y, w, h);
            ctx.restore();

        }

    }

    drawMinuteMarks(ctx) {

        let w = 0.025 * this.getFaceDiameter() * this.props.xScaleFactor;
        let h = 1 * this.props.yScaleFactor;
        let x = 0.90 * this.getFaceDiameter() / 2 - 0.025 * this.getFaceDiameter() * this.props.xScaleFactor;
        let y = -0.00025 * this.getFaceDiameter();


        for (let i = 0; i < 60; i++) {
            ctx.save();
            ctx.rotate((this.calculateMinuteAngle(i, 0, 0)) * Math.PI / 180);
            ctx.fillRect(x, y, w, h);
            ctx.restore();

        }

    }

    drawHand(ctx, angle, color, baseHandWidth, handWidth, handLength, tail) {
        ctx.save();
        ctx.rotate((angle - 90) * Math.PI / 180);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        //ctx.fillRect(0, -0.5 * handWidth, handLength, handWidth);
        this.drawTrapezoid(ctx, 0, 0, baseHandWidth, handWidth, handLength, tail);
        ctx.restore();
    }


    drawTrapezoid(ctx, x, y, baseWidth, width, height, tail) {

        let tailLen = 0;
        if (tail) {
            tailLen = 0.30 * height;
        }

        ctx.beginPath();
        ctx.moveTo(x - tailLen, (y + baseWidth) * -0.5);
        ctx.lineTo(x + height, (y + width) * -0.5);
        ctx.lineTo(x + height, (y + width) * 0.5);
        ctx.lineTo(x -tailLen, (y + baseWidth) * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
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


    getTimeZoneForDisplay() {
        let tz = '';

        if (this.props.timeZone) {
            tz = this.props.timeZone;
        } else {
            tz = this.getCurrentDate().zone.name;
        }
        return tz;
    }

    getTimeZoneDiv() {
        let tz = this.getTimeZoneForDisplay();
        return (<div><span>{tz}</span></div>)
    }

    render() {
        let statsTable;

        if (this.props.displayStats) {
            statsTable = this.getStatsTable();
        }

        let tz = this.getTimeZone();

        let timeZoneDiv = this.getTimeZoneDiv();


        return (
            <div>

                {statsTable}

                <div id={this.props.id + "inner"} onClick={this.toggleTicking} className="analogClock" title={tz}
                     style={{width: this.props.faceDiameter + 'px', height: this.props.faceDiameter + 'px'}}>
                    <canvas className="canvasForeGround" ref="canvasForeGround" width={this.props.faceDiameter}
                            height={this.props.faceDiameter}/>
                    <canvas className="canvasBackGround" ref="canvasBackground" width={this.props.faceDiameter}
                            height={this.props.faceDiameter}/>
                </div>

                {timeZoneDiv}
            </div>
        )
    }
}

ClockFace.defaultProps = {
    faceDiameter: 200,
    drawMinuteMarks: true,
    drawHourMarks: true,
    xScaleFactor: 1,
    yScaleFactor: 1
}

export default ClockFace;