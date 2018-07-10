import querystring from 'querystring';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import ScheduleItem from './ScheduleItem';
import ScheduleHeader from './ScheduleHeader';
import { fetchScheduleForPerson, createEvents, updateSchedule } from './api';

class Schedule extends PureComponent {
  state = {
    schedule: {},
    isCreatingEvents: false,
  };

  constructor(props) {
    super(props);

    this.handleCreateEventsClick = this.handleCreateEventsClick.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    this.getSchedule();
  }

  handleBackButtonClick(event) {
    event.preventDefault();
    this.props.navigate('/');
  }

  handleCreateEventsClick() {
    this.setState({ isCreatingEvents: true });

    createEvents(this.state.schedule.schedule)
      .then(events => {
        events.forEach(event => {
          console.log(
            `Event created: ${event.created} | ${event.description} | ${
              event.location
            }`
          );
        });

        this.setState({ isCreatingEvents: false });

        const { email } = this.props.user.profileObj;

        updateSchedule(email, this.props.scheduleId, {
          eventsCreatedOnce: true,
        })
          .then(() => {
            this.getSchedule();
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  getSchedule() {
    const search = querystring.parse(this.props.location.search.substring(1));
    const { person, hourlyWage } = search;
    const { email } = this.props.user.profileObj;

    fetchScheduleForPerson(email, this.props.scheduleId, person, hourlyWage)
      .then(schedule => this.setState({ schedule }))
      .catch(err => console.log(err));
  }

  render() {
    const {
      schedule,
      totalHours,
      totalWeeklyWage,
      name,
      eventsCreatedOnce,
    } = this.state.schedule;

    return (
      <div className="sb-flex sb-flex-column">
        <header className="sb-header">
          <button
            className="sb-header__back"
            aria-label="Back"
            onClick={this.handleBackButtonClick}
          >
            <svg className="sb-icon" viewBox="0 0 9 16">
              <path d="M8.02631579,16 C8.13407895,16 8.24181579,15.9588947 8.32402632,15.8766579 C8.48847368,15.7122368 8.48847368,15.4456316 8.32402632,15.2812105 L1.04281579,8 L8.32402632,0.718763158 C8.48847368,0.554342105 8.48847368,0.287736842 8.32402632,0.123315789 C8.15957895,-0.0411052632 7.893,-0.0411315789 7.72857895,0.123315789 L0.149631579,7.70226316 C-0.0148157895,7.86668421 -0.0148157895,8.13328947 0.149631579,8.29771053 L7.72857895,15.8766579 C7.81081579,15.9588947 7.91855263,16 8.02631579,16 L8.02631579,16 Z" />
            </svg>
          </button>
          <div className="sb-header__content">
            <div className="sb-header__text">
              <h1 className="sb-header__title sb-title">{name}</h1>
              {eventsCreatedOnce && (
                <p className="sb-header__info sb-text">
                  You have created events for this schedule already!
                </p>
              )}
            </div>
            <button
              className="sb-header__btn sb-btn sb-btn--primary"
              onClick={this.handleCreateEventsClick}
              disabled={this.state.isCreatingEvents}
            >
              {this.state.isCreatingEvents
                ? 'creating events...'
                : 'create events'}
            </button>
          </div>
        </header>

        <div className="sb-padding">
          <ScheduleHeader />

          {schedule &&
            schedule.map(daySchedule => (
              <ScheduleItem key={daySchedule.date} daySchedule={daySchedule} />
            ))}

          <div>
            <strong>Total Hours:</strong> {totalHours}
          </div>

          <div>
            <strong>Total Weekly Wage:</strong>{' '}
            {totalWeeklyWage && totalWeeklyWage.toFixed(2)} EUR
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
});

export default connect(mapStateToProps)(Schedule);
