module.exports = function parseScheduleFileData({
  parser,
  data,
  timezone,
  person,
}) {
  if (!parser || typeof parser.parse !== 'function') {
    throw new Error('Please provide a parser with a parse function');
  }

  return parser.parse(data, timezone, person);
};
