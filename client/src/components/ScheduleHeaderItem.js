import React, { PureComponent } from 'react';

class ScheduleHeaderItem extends PureComponent {
  render() {
    return (
      <div
        className="sb-padding-left sb-padding-right sb-padding-top-s sb-padding-bottom-s"
        style={{ flex: this.props.flex }}
      >
        <strong>{this.props.text}</strong>
      </div>
    );
  }
}

export default ScheduleHeaderItem;
