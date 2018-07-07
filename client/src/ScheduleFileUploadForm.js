import React, { PureComponent } from 'react';

class ScheduleFileUploadForm extends PureComponent {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

    this.fileInput = React.createRef();
  }

  handleSubmit(event) {
    event.preventDefault();

    const file = this.fileInput.current.files[0];

    if (!file) {
      return;
    }

    this.props.onSubmit(file);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="sb-flex">
        <div className="sb-form-control sb-flex sb-align-items-center sb-margin-right">
          <label
            className="sb-margin-right"
            htmlFor="scheduleFile"
            style={{ flex: 1 }}
          >
            Or upload a new one:
          </label>
          <input
            className="sb-input"
            type="file"
            id="scheduleFile"
            ref={this.fileInput}
            style={{ flex: 2 }}
          />
        </div>
        <button className="sb-btn" type="submit">
          Upload
        </button>
      </form>
    );
  }
}

export default ScheduleFileUploadForm;
