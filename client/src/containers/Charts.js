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
} from 'recharts/lib';
import { connect } from 'react-redux';
import { fetchWeeklyWageDataAggregation } from '../api';
import { fetchSettingsForUser } from '../actions/settingsActions';

class Charts extends PureComponent {
  state = {
    weeklyWageData: [],
  };

  constructor(props) {
    super(props);

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    const { token } = this.props;

    this.props
      .fetchSettingsForUser(token)
      .then(() => {
        fetchWeeklyWageDataAggregation(
          token,
          this.props.settings.person,
          this.props.settings.hourlyWage
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
      <div className="sb-padding">
        {weeklyWageData.length > 0 && (
          <section
            style={{ height: 600 }}
            className="sb-tile sb-padding-bottom-xl sb-padding-top sb-padding-right sb-padding-left"
          >
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
    );
  }
}

const mapStateToProps = state => ({
  token: state.authReducer.token,
  settings: state.settingsReducer.settings,
});

const mapDispatchToProps = dispatch => ({
  fetchSettingsForUser: token => dispatch(fetchSettingsForUser(token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Charts);
