/**
 * Get unix time of now.
 * @returns {number}
 */
export const getUnixTimeOfNow = (): number => {
  return Math.floor(new Date().getTime() / 1000 );
};

/**
 * Get unix time of after 24 hours.
 * @returns {number}
 */
export const getUnixTimeOfAfter24h = (): number => {
  return getUnixTimeOfNow() + 60 * 60 * 24;
};

export default { getUnixTimeOfNow, getUnixTimeOfAfter24h };
