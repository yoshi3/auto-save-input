import { getUnixTimeOfNow, getUnixTimeOfAfter24h } from '../../src/services/time';

describe('services/time', () => {
  it('should return unix time of now from getUnixTimeOfNow', () => {
    expect(getUnixTimeOfNow()).toEqual(Math.floor(new Date().getTime() / 1000 ));
  });
  it('should return unix time of after 24 hours from getUnixTimeOfAfter24h', () => {
    expect(getUnixTimeOfAfter24h()).toEqual(Math.floor(new Date().getTime() / 1000 ) + 60 * 60 * 24);
  });
});
