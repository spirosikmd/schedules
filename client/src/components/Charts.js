import React, { PureComponent } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { connect } from 'react-redux';
import { fetchWeeklyWageDataAggregation, fetchSettings } from '../api';

class Charts extends PureComponent {
  state = {
    weeklyWageData: [],
  };

  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { email } = this.props.user.profileObj;

    fetchSettings(email)
      .then(settings => {
        fetchWeeklyWageDataAggregation(
          email,
          settings.person,
          settings.hourlyWage
        ).then(response => {
          const chartData = [];
          const weeklyWageData = response.data.weeklyWageData;
          Object.keys(weeklyWageData).forEach(name => {
            chartData.push({ name, weeklyWage: weeklyWageData[name] });
          });
          this.setState({ weeklyWageData: chartData });
        });
      })
      .catch(err => console.log(err));
  }

  handleBackButtonClick(event) {
    event.preventDefault();
    this.props.navigate('/');
  }

  render() {
    const { weeklyWageData } = this.state;

    return (
      <div>
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
              <h1 className="sb-header__title sb-title">Charts</h1>
            </div>
          </div>
        </header>
        <div className="sb-padding">
          {weeklyWageData.length > 0 && (
            <section style={{ height: 600 }}>
              <h2>Weekly Wage</h2>
              <ResponsiveContainer>
                <LineChart
                  data={weeklyWageData}
                  margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weeklyWage" />
                </LineChart>
              </ResponsiveContainer>
            </section>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.userReducer.user,
});

export default connect(mapStateToProps)(Charts);
