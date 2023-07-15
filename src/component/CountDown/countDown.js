import React from "react";
import Countdown from "react-countdown";
import { FormattedMessage, injectIntl } from "react-intl";

let dayLeft;

function setDate(endTime) {
  var launchDate = new Date(endTime).toUTCString();
  
  var currDate = new Date();
  let daysDiff =
    (new Date(launchDate).getTime() - currDate.getTime()) /
    (1000 * 60 * 60 * 24);
  let hoursDiff = (daysDiff - parseInt(daysDiff)) * 24;
  let minDiff = (hoursDiff - parseInt(hoursDiff)) * 60;
  let secDiff = (minDiff - parseInt(minDiff)) * 60;
  let milisec = (secDiff - parseInt(secDiff)) * 1000;
  const daysLeft = parseInt(daysDiff) * 24 * 60 * 60 * 1000;
  const hourLeft = parseInt(hoursDiff) * 60 * 60 * 1000;
  const minLeft = parseInt(minDiff) * 60 * 1000;
  const secLeft = parseInt(secDiff) * 1000;
  dayLeft = daysLeft + hourLeft + minLeft + secLeft + milisec;
}

class CountDown extends React.PureComponent {
  constructor(props) {
    super(props);

    // setDate(
    //   new Date(
    //     new Date(this.props.boxInitiateTime).setDate(
    //       new Date(this.props.boxInitiateTime).getDate() +
    //         this.props.currentInterval
    //     )
    //   ).getTime()
    // );
    setDate(new Date(this.props.boxInitiateTime).getTime());
    this.state = {
      counter: 0,
    };
    this.intervalCounter = "";
  }

  componentDidMount() {
    this.intervalCounter = setInterval(() => {
      // setDate(
      //   new Date(
      //     new Date(this.props.boxInitiateTime).setDate(
      //       new Date(this.props.boxInitiateTime).getDate() +
      //         this.props.currentInterval
      //     )
      //   ).getTime()
      // );
      setDate(new Date(this.props.boxInitiateTime).getTime());

      this.setState({ counter: this.state.counter + 1 });
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {
    clearInterval(this.intervalCounter);
  }

  render() {
    const renderer = ({ days, hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a completed state
        this.props.handleTimeOut(this.props?.roundExpiration);
        return (
          <p>{/* <FormattedMessage id="Sale Started"></FormattedMessage> */}</p>
        );
      } else {
        // Render a countdown
        return (
          <p className="mb-0">
            {days >= 10 ? days : "0" + days}
            <span className="mobCountTitle">
              {" "}
              <FormattedMessage id="days"></FormattedMessage>{" "}
            </span>
            | {hours >= 10 ? ' ' + hours : "0" + hours}
            <span className="mobCountTitle">
              {" "}
              <FormattedMessage id="hours"></FormattedMessage>{" "}
            </span>
            | {minutes >= 10 ? ' ' + minutes : " 0" + minutes}
            <span className="mobCountTitle">
              {" "}
              <FormattedMessage id="min"></FormattedMessage>{" "}
            </span>
            | {seconds >= 10 ? ' ' + seconds : " 0" + seconds}{" "}
            <span className="mobCountTitle">
              {" "}
              <FormattedMessage id="sec"></FormattedMessage>{" "}
            </span>{" "}
          </p>
        );
      }
    };
    return (
      <React.Fragment>
        {/* <Button
         
          block
          
          variant="primary"       
        > */}
          {/* <FormattedMessage id="cmingsoon"></FormattedMessage> */}
          <div className="text-white" >
            {dayLeft && !isNaN(dayLeft) && this.props.boxInitiateTime !== "" && (
              <Countdown
                date={new Date().getTime() + dayLeft}
                renderer={
                  renderer
                }
              />
            )}
          </div>
        {/* </Button> */}
      </React.Fragment>
    );
  }
}

export default injectIntl(CountDown);
