module.exports = function parseScheduleFileData({ parser, data }) {
  if (!parser || typeof parser.parse !== 'function') {
    throw new Error('Please provide a parser with a parse function');
  }

  return parser.parse(data);
};
