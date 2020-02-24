import { NativeModules } from 'react-native';

/**
 * Get native getStep with parsed Dates
 * @param startDate
 * @param endDate
 * @returns {*}
 */
const getSteps = ({ startDate, endDate }) =>
  NativeModules.Fitness.getSteps(parseDate(startDate), parseDate(endDate));

/**
 * Get native getDistance with parsed Dates
 * @param startDate
 * @param endDate
 * @returns {*}
 */
const getDistance = ({ startDate, endDate }) =>
  NativeModules.Fitness.getDistance(parseDate(startDate), parseDate(endDate));

/**
 * @deprecated Use getStatistics
 *
 * Get samples for given type
 * @param startDate
 * @param endDate
 * @param {'steps' | 'walking_distance' | 'cycling_distance'} type
 * @returns {*}
 */
const getSamples = ({ startDate, endDate, type }) =>
  NativeModules.Fitness.getSamples(parseDate(startDate), parseDate(endDate), type);

/**
 * Get samples for given type
 * @param startDate
 * @param endDate
 * @param {'steps' | 'walking_distance' | 'cycling_distance'} type
 * @returns {*}
 */
const getStatistics = ({ startDate, endDate, type }) =>
  NativeModules.Fitness.getSamples(parseDate(startDate), parseDate(endDate), type);

/**
 * Check if valid date and parse it
 * @param date: Date to parse
 */
const parseDate = (date) => {
  if(!date){
    throw Error('Date not valid');
  }
  const parsed = Date.parse(date);

  if(Number.isNaN(parsed)){
    throw Error('Date not valid');
  }

  return parsed;
};

export default {
  ...NativeModules.Fitness,
  getSteps,
  getDistance,
  getSamples,
  getStatistics,
};
