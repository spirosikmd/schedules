import React, { PureComponent } from 'react';

class ScheduleFileUploadForm extends PureComponent {
  componentDidMount() {
    this.dropListener = document.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();

      const file = event.dataTransfer.files[0];
      this.props.onSubmit(file);
    });

    this.dragoverListener = document.addEventListener('dragover', event => {
      event.preventDefault();
      event.stopPropagation();
    });
  }

  componentWillUnmount() {
    document.removeEventListener('drop', this.dropListener);
    document.removeEventListener('dragover', this.dragoverListener);
  }

  render() {
    return <div id="holder" />;
  }
}

export default ScheduleFileUploadForm;
