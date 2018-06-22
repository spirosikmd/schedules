import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    response: {
      schedule: [],
      totalHours: 0
    }
  };

  componentDidMount() {
    this.callApi()
      .then(response => this.setState({ response }))
      .catch(err => console.log(err));
  }

  callApi = async () => {
    const response = await fetch("/schedule");
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div>
        <header>
          <h1>Welcome to Jenny's Schedule</h1>
        </header>
        <div>
          <table>
            <thead>
              <th>Date</th>
              <th>Location</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Hours</th>
            </thead>
            <tbody>
              {this.state.response.schedule.map(daySchedule => (
                <tr>
                  <td>{daySchedule.date}</td>
                  <td>{daySchedule.location}</td>
                  <td>{daySchedule.startTime}</td>
                  <td>{daySchedule.endTime}</td>
                  <td>{daySchedule.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <strong>Total Hours:</strong> {this.state.response.totalHours}
        </div>
      </div>
    );
  }
}

export default App;
