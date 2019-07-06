import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts/lib';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withAuth from '../../shared/components/withAuth';
import Loader from '../../shared/components/Loader';
import {
  fetchWeeklyWageData,
  fetchWeeklyHourData,
  fetchLocationHourData,
} from '../api';

const styles = theme => ({
  chartRoot: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(6),
  },
  section: {
    height: 400,
  },
  chart: {
    fontFamily: theme.typography.fontFamily,
  },
});

class StatisticsPage extends PureComponent {
  state = {
    weeklyWageData: [],
    weeklyHourData: [],
    locationHourData: [],
    isWeeklyWageDataLoading: false,
    isWeeklyHourDataLoading: false,
    isLocationHourDataLoading: false,
  };

  componentDidMount() {
    this.setState({
      isWeeklyWageDataLoading: true,
      isWeeklyHourDataLoading: true,
      isLocationHourDataLoading: true,
    });

    fetchWeeklyWageData()
      .then(response => {
        const weeklyWageData = response.data.weeklyWageData;
        this.setState({ weeklyWageData, isWeeklyWageDataLoading: false });
      })
      .catch(err => console.log(err));

    fetchWeeklyHourData()
      .then(response => {
        const weeklyHourData = response.data.weeklyHourData;
        this.setState({ weeklyHourData, isWeeklyHourDataLoading: false });
      })
      .catch(err => console.log(err));

    fetchLocationHourData()
      .then(response => {
        const locationHourData = response.data.locationHourData;
        this.setState({ locationHourData, isLocationHourDataLoading: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    const {
      weeklyWageData,
      weeklyHourData,
      locationHourData,
      isWeeklyWageDataLoading,
      isWeeklyHourDataLoading,
      isLocationHourDataLoading,
    } = this.state;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.chartRoot}>
            {isWeeklyWageDataLoading ? (
              <Loader loading={isWeeklyWageDataLoading} />
            ) : (
              <section className={classes.section}>
                <Typography variant="h5" component="h3">
                  Wage per week
                </Typography>
                <ResponsiveContainer>
                  <LineChart
                    className={classes.chart}
                    data={weeklyWageData}
                    margin={{ top: 15, right: 30 }}
                  >
                    <XAxis dataKey="name" tickMargin={10} />
                    <YAxis tickMargin={10} tickFormatter={tick => `€${tick}`} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={value => `€${value.toFixed(2)}`} />
                    <Line type="monotone" dataKey="weeklyWage" name="wage" />
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
                  Hours per week
                </Typography>
                <ResponsiveContainer>
                  <LineChart
                    className={classes.chart}
                    data={weeklyHourData}
                    margin={{ top: 15, right: 30 }}
                  >
                    <XAxis dataKey="name" tickMargin={10} />
                    <YAxis tickMargin={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line type="monotone" dataKey="weeklyHours" name="hours" />
                  </LineChart>
                </ResponsiveContainer>
              </section>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chartRoot}>
            {isLocationHourDataLoading ? (
              <Loader loading={isLocationHourDataLoading} />
            ) : (
              <section className={classes.section}>
                <Typography variant="h5" component="h3">
                  Hours per location
                </Typography>
                <ResponsiveContainer>
                  <BarChart
                    className={classes.chart}
                    data={locationHourData}
                    margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="location" tickMargin={10} />
                    <YAxis tickMargin={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3f51b5" />
                  </BarChart>
                </ResponsiveContainer>
              </section>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.chartRoot}>
            {isLocationHourDataLoading ? (
              <Loader loading={isLocationHourDataLoading} />
            ) : (
              <section className={classes.section}>
                <Typography variant="h5" component="h3">
                  Number of times per location
                </Typography>
                <ResponsiveContainer>
                  <BarChart
                    className={classes.chart}
                    data={locationHourData}
                    margin={{ top: 15, right: 30, left: 0, bottom: 5 }}
                  >
                    <XAxis dataKey="location" tickMargin={10} />
                    <YAxis tickMargin={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Bar
                      dataKey="numberOfTimes"
                      fill="#3f51b5"
                      name="number of times"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </section>
            )}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

StatisticsPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withAuth(withStyles(styles)(StatisticsPage));
