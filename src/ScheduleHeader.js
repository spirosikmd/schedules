import React, { PureComponent } from 'react';
import ScheduleHeaderItem from './ScheduleHeaderItem';

class ScheduleHeader extends PureComponent {
  render() {
    return (
      <div className="sb-tile sb-margin-bottom-s">
        <div className="sb-flex">
          <ScheduleHeaderItem text="Date" flex="3" />
          <ScheduleHeaderItem text="Location" flex="1" />
          <ScheduleHeaderItem text="Start Time" flex="2" />
          <ScheduleHeaderItem text="End Time" flex="2" />
          <ScheduleHeaderItem text="Hours" flex="1" />
          <ScheduleHeaderItem text="Work With" flex="4" />
        </div>
      </div>
    );
  }
}

export default ScheduleHeader;
