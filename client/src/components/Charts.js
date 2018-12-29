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
import Grid from '@material-ui/core/Grid';
import {
  fetchWeeklyWageDataAggregation,
  fetchWeeklyHourDataAggregation,
} from '../api';
import withAuth from './withAuth';
import Loader from './Loader';

const styles = theme => ({
  chartRoot: {
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
    weeklyHourData: [],
    isWeeklyWageDataLoading: false,
    isWeeklyHourDataLoading: false,
  };

  componentDidMount() {
    this.setState({
      isWeeklyWageDataLoading: true,
      isWeeklyHourDataLoading: true,
    });
    fetchWeeklyWageDataAggregation()
      .then(response => {
        const weeklyWageData = response.data.weeklyWageData;
        this.setState({ weeklyWageData, isWeeklyWageDataLoading: false });
      })
      .catch(err => console.log(err));

    fetchWeeklyHourDataAggregation()
      .then(response => {
        const weeklyHourData = response.data.weeklyHourData;
        this.setState({ weeklyHourData, isWeeklyHourDataLoading: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    const {
      weeklyWageData,
      weeklyHourData,
      isWeeklyWageDataLoading,
      isWeeklyHourDataLoading,
    } = this.state;

    return (
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Paper className={classes.chartRoot}>
            {isWeeklyWageDataLoading ? (
              <Loader loading={isWeeklyWageDataLoading} />
            ) : (
              <section className={classes.section}>
                <Typography variant="h5" component="h3">
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
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chartRoot}>
            {isWeeklyHourDataLoading ? (
              <Loader loading={isWeeklyHourDataLoading} />
            ) : (
              <section className={classes.section}>
                <Typography variant="h5" component="h3">
                  Weekly Hours
                </Typography>
                <ResponsiveContainer>
                  <LineChart
                    className={classes.chart}
                    data={weeklyHourData}
                    margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={value => value.toFixed(2)} />
                    <Legend />
                    <Line type="monotone" dataKey="weeklyHours" />
                  </LineChart>
                </ResponsiveContainer>
              </section>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withAuth(withStyles(styles)(Charts));
