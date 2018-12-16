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
import { fetchWeeklyWageDataAggregation } from '../api';
import withAuth from '../components/withAuth';
import Loader from '../components/Loader';

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
    isLoading: true,
  };

  componentDidMount() {
    fetchWeeklyWageDataAggregation()
      .then(response => {
        const weeklyWageData = response.data.weeklyWageData;
        this.setState({ weeklyWageData, isLoading: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { classes } = this.props;
    const { weeklyWageData, isLoading } = this.state;

    if (isLoading) {
      return <Loader loading={isLoading} />;
    }

    if (weeklyWageData.length <= 0) {
      return null;
    }

    return (
      <Paper className={classes.root}>
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
      </Paper>
    );
  }
}

export default withAuth(withStyles(styles)(Charts));
