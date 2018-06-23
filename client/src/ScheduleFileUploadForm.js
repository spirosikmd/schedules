import React, { PureComponent } from 'react';

class ScheduleFileUploadForm extends PureComponent {
  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();

    const file = this.fileInput.current.files[0];

    this.props.onSubmit(file);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="sb-form-control">
          <label className="sb-label" htmlFor="schedule-file">
            Schedule File:
          </label>
          <div className="sb-form-control__input">
            <input
              className="sb-input"
              id="schedule-file"
              type="file"
              ref={this.fileInput}
            />
          </div>
        </div>
        <button className="sb-btn" type="submit">
          Submit
        </button>
      </form>
    );
  }
}

export default ScheduleFileUploadForm;
