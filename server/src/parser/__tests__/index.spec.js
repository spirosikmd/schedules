const DefaultParser = require('../');

describe('DefaultParser', () => {
  let parser;

  beforeEach(() => {
    Date = jest.fn(() => ({
      getMonth: jest.fn(() => 11),
      getFullYear: jest.fn(() => 2018),
    }));
    parser = new DefaultParser();
  });

  describe('parseDate', () => {
    beforeEach(() => {
      parser.toUTC = jest.fn();
    });

    it('parses future given date in the same year', () => {
      parser.parseDate('monday 31-12', 2018);
      expect(parser.toUTC).toHaveBeenCalledWith(2018, 11, 31);
    });

    it('parses future given date from next year', () => {
      parser.parseDate('tuesday 01-01', 2019);
      expect(parser.toUTC).toHaveBeenCalledWith(2019, 0, 1);
    });
  });
});
