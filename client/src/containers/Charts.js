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
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { fetchWeeklyWageDataAggregation } from '../api';
import { fetchSettingsForUser } from '../actions/settingsActions';
import withAuth from '../components/withAuth';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 6,
  },
  section: {
    height: 400,
  },
  chart: {
    fontFamily: theme.typography.fontFamily,
  },
});

class Charts extends PureComponent {
  state = {
    weeklyWageData: [],
  };

  componentDidMount() {
    this.props
      .fetchSettingsForUser()
      .then(() => {
        fetchWeeklyWageDataAggregation(
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

  render() {
    const { classes } = this.props;
    const { weeklyWageData } = this.state;

    if (weeklyWageData.length <= 0) {
      return null;
    }

    return (
      <Paper className={classes.root}>
        <section className={classes.section}>
          <Typography variant="headline" component="h3">
            Weekly Wage
          </Typography>
          <ResponsiveContainer>
            <LineChart
              className={classes.chart}
              data={weeklyWageData}
              margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={value => value.toFixed(2)} />
              <Legend />
              <Line type="monotone" dataKey="weeklyWage" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settingsReducer.settings,
});

const mapDispatchToProps = dispatch => ({
  fetchSettingsForUser: () => dispatch(fetchSettingsForUser()),
});

export default withAuth(
  withStyles(styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Charts)
  )
);
