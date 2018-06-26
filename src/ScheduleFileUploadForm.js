import React, { PureComponent } from 'react';

class ScheduleFileUploadForm extends PureComponent {
  componentDidMount() {
    document.addEventListener('drop', event => {
      event.preventDefault();
      event.stopPropagation();

      const file = event.dataTransfer.files[0];
      this.props.onSubmit(file);
    });

    document.addEventListener('dragover', event => {
      event.preventDefault();
      event.stopPropagation();
    });
  }

  componentWillUnmount() {
    document.removeEventListener('drop');
    document.removeEventListener('dragover');
  }

  render() {
    return <div id="holder" />;
  }
}

export default ScheduleFileUploadForm;
