import React, { Component } from 'react';

class App extends Component {
  state = {
    response: {
      schedule: [],
      totalHours: 0,
    },
    person: 'Jenny',
  };

  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  componentDidMount() {
    this.fetchScheduleForPerson(this.state.person)
      .then(response => this.setState({ response }))
      .catch(err => console.log(err));
  }

  fetchScheduleForPerson = async person => {
    const response = await fetch(`/schedule?person=${person}`);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  generateScheduleWithFileAndPerson = async (file, person) => {
    const data = new FormData();
    data.set('scheduleFile', file);
    data.set('person', person);

    const response = await fetch('/upload', {
      method: 'post',
      body: data,
    });

    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  handleSubmit = async event => {
    event.preventDefault();

    const file = this.fileInput.current.files[0];

    this.generateScheduleWithFileAndPerson(file, this.state.person)
      .then(() => {
        this.fetchScheduleForPerson(this.state.person).then(response =>
          this.setState({ response })
        );
      })
      .catch(err => console.log(err));
  };

  render() {
    return (
      <div>
        <header>
          <h1>Welcome to {this.state.person}'s Schedule</h1>
        </header>
        <div>
          <form onSubmit={this.handleSubmit}>
            <input className="sb-input" type="file" ref={this.fileInput} />
            <button className="sb-btn" type="submit">
              Submit
            </button>
          </form>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Location</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Total Hours</th>
              </tr>
            </thead>
            <tbody>
              {this.state.response.schedule.map(daySchedule => (
                <tr key={daySchedule.date}>
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
