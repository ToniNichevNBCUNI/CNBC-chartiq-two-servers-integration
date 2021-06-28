/* eslint-disable import/prefer-default-export, consistent-return */
const timeAgo = (() => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const thresholds = [
    { threshold: 540 * day, modifier: 365 * day, render: elapsed => `${elapsed} years ago` },
    { threshold: 320 * day, render: () => 'a year ago' },
    { threshold: 45 * day, modifier: 30 * day, render: elapsed => `${elapsed} months ago` },
    { threshold: 26 * day, render: () => 'a month ago' },
    { threshold: 36 * hour, modifier: 24 * hour, render: elapsed => `${elapsed} days ago` },
    { threshold: 22 * hour, render: () => 'a day ago' },
    { threshold: 90 * minute, modifier: 60 * minute, render: elapsed => `${elapsed} hours ago` },
    { threshold: 45 * minute, render: () => 'an hour ago' },
    { threshold: 90 * second, modifier: 60 * second, render: elapsed => `${elapsed} minutes ago` },
    { threshold: 46 * second, render: () => 'a minute ago' },
    { threshold: 0 * second, render: () => 'a few seconds ago' },
  ];
  return date => {
    const elapsed = Math.round(new Date() - date);
    const { render, modifier } = thresholds.find(({ threshold }) => elapsed >= threshold);
    return render(Math.round(elapsed / modifier));
  };
})();

export const DATE_TIME_DELIMITER = ' • ';

/**
 * Returns a boolean indicting whether a 'date' is valid
 * @type {function}
 * @param {string|Object} A string date or a Date object
 * @returns {boolean} true or false
 */
export function isValidDate(date) {
  if (date === null) {
    return false;
  }
  const newDate = new Date(date);
  return String(newDate) !== 'Invalid Date';
}

/**
 * Creates a formatted hour string from a timestamp
 * @type {function}
 * @param {Object} A Date object
 * @returns {string} A formatted hour string
 */
export function getFormattedHour(date = new Date()) {
  if (!isValidDate(date)) {
    return '';
  }
  const hour = (new Date(date).getHours() + 24) % 12 || 12;
  if (hour < 10) {
    return `0${hour}`;
  }
  return String(hour);
}


/**
 * Creates a formatted minute string from a timestamp
 * @type {function}
 * @param {Object} A Date object
 * @returns {string} A formatted minute string
 */
export function getFormattedMinutes(date = new Date()) {
  if (!isValidDate(date)) {
    return '';
  }
  const minutes = new Date(date).getMinutes();
  if (minutes < 10) {
    return `0${minutes}`;
  }
  return String(minutes);
}

/**
 * Creates a formatted time strings - day, minute, date, hour
 * @type {function}
 * @param {string}
 * @returns {string} A formatted time string
 */
export function getFormattedTimes(time = '') {
  switch (time) {
  case 'day':
    return Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  case 'date':
    return Intl.DateTimeFormat('en-US').format(new Date());
  case 'hour':
    return getFormattedHour(new Date());
  case 'minute':
    return `${getFormattedHour(new Date())}:${getFormattedMinutes(new Date())}`;
  default:
    return '';
  }
}

/**
 * Creates a formatted timestamp string Ex. '1987-12-05'
 * @type {function}
 * @param {string}
 * @returns {string} A formatted timestamp string
 */
export function getFormattedTimestampWithDashes(unformattedDateTime = '') {
  if (!isValidDate(unformattedDateTime)) {
    return '';
  }
  const formattedDateTimestamp = Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: 'numeric',
  }).format(new Date(unformattedDateTime));
  const [month, numericalDate, year] = formattedDateTimestamp.split('/');
  return `${year}-${month}-${numericalDate}`;
}

/**
 * Creates a formatted time string from a timestamp
 * @type {function}
 * @param {string} A formatted timestamp string like '2017-03-02T00:00:00.000Z'
 * @returns {string} A formatted datePublished string like 'Mon, Nov 13 2017 • 2:15 PM EST'
 */
const getDate = date => {
  let datePublished = date;
  if (!datePublished || !isValidDate(date)) {
    return null;
  }

  const isGMT = /(.*) (GMT)/.exec(datePublished);
  if (isGMT) {
    datePublished = new Date(`${isGMT[1]}Z`);
  }

  return new Date(datePublished);
};

/**
 * formatOffset -  helper function which adds a colon and minutes to a timezone offset, if they are not present
 * @function
 * @returns {string} A function that returns an offset timestamp in the format '2019-06-04T13:57:36+00:00'
 * To Do - this function can be removed once the timestap returned by CAPI is updated for Safari compatibility
 */

const formatOffset = (date, time) => {
  const offset = time.split(/\+|-/)[1] || '';
  const hasMinutes = offset.length > 2;
  if (!hasMinutes) {
    return `${date}T${time}:00`;
  }
  const hasFinalColon = offset.charAt(offset.length - 3) === ':';
  if (!hasFinalColon) {
    return `${date}T${time.slice(0, -2)}:${time.slice(-2)}`;
  }
  return `${date}T${time}`;
};

/**
 * formatForAllBrowsers -  add colon to a timezone offset to create valid format for Safari, Chrome, and Firefox
 * @function
 * @returns {string} A function that returns either a timezone offset formatted to work with
 * the three browers listed above, or the original timestamp if it is not an offset
 * To Do - this function can be removed once the timestap returned by CAPI is updated for Safari compatibility
 */

export const formatForAllBrowsers = timestamp => {
  if (timestamp && typeof timestamp === 'string') {
    const dateTimeArray = timestamp.split('T');
    if (dateTimeArray[1]) {
      const date = dateTimeArray[0];
      const time = dateTimeArray[1];
      const isOffset = (time.match(/\+/g) || time.match(/-/g) || []).length > 0;
      if (isOffset) {
        return formatOffset(date, time);
      }
    }
  }
  return timestamp;
};

/**
 * getEasternTimeZone - calculate the current Eastern timezone from any clientside location
 * @function
 * @returns {string} A function that returns the current Eastern timezone
 */
export function getEasternTimeZone(unformattedDateTime = '') {
  const hoursUTC = Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date(unformattedDateTime));

  const hoursET = Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date(unformattedDateTime));

  let offSet = hoursUTC[0].value - hoursET[0].value;
  if (offSet < 0) {
    offSet += 24;
  }
  if (offSet === 5) {
    return 'EST';
  }
  if (offSet === 4) {
    return 'EDT';
  }
  return 'ET';
}

/**
 * TODO: Refactor this to return date and time separately, and have one or more separate functions
 * for formatting
 *
 * GetFormattedDateTime - get a formatted date time
 * @function
 * @returns {string} A function that returns a formatted date timestamp
 */
export function getFormattedDateTime(unformattedDateTime = '') {
  try {
    const dateTime = formatForAllBrowsers(unformattedDateTime);
    if (!isValidDate(dateTime)) {
      return '';
    }
    const formattedDateTime = Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(dateTime));
    const tz = getEasternTimeZone(dateTime);
    const [date, month, day, year, time, meridiem] = formattedDateTime.replace(/,/g, '').split(' ');
    return `${date}, ${month} ${day} ${year}${DATE_TIME_DELIMITER}${time} ${meridiem} ${tz}`;
  } catch (e) {
    return '';
  }
}

/**
 *
 * dateForAddToCalendarHOC - get a formatted date time in YYYYMMDDTHHmmss format relative to the add to calendar HOC
 * @function
 * @returns {string} A function that returns a formatted date
 */
export function dateForAddToCalendarHOC(date) {
  if (date === null) {
    return null;
  }
  const eventDate = new Date(date);
  if (!isValidDate(eventDate)) {
    return null;
  }
  const month = (`0${eventDate.getMonth()+ 1}`).slice(-2);
  const day = (`0${eventDate.getDate()}`).slice(-2);
  const year = eventDate.getFullYear();
  const hours = (`0${eventDate.getHours()}`).slice(-2);
  const minutes = (`0${eventDate.getMinutes()}`).slice(-2);
  const seconds = (`0${eventDate.getSeconds()}`).slice(-2);

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

export function timestampToEpochMs(date) {
  const momentDate = getDate(date);
  if (!isValidDate(momentDate)) {
    return 0;
  }
  return momentDate.getTime();
}

export function timestampToDateTime(date) {
  const momentDate = getDate(date);
  if (!isValidDate(momentDate)) {
    return date;
  }
  // Creates a formatted date string in  ET (EST / EDT)to be rendered as the published date.
  return getFormattedDateTime(momentDate);
}

export function timestampToDate(date) {
  try {
    const momentDate = getDate(date);
    if (!isValidDate(momentDate)) {
      return date;
    }
    // Creates a formatted date string in  ET (EST / EDT)to be rendered as the published date.
    return Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(momentDate));
  } catch (e) {
    return '';
  }
}

export function timestampToMomentAgo(date) {
  const momentDate = getDate(date);
  if (!isValidDate(momentDate)) {
    return '';
  }
  return momentDate ? timeAgo(momentDate) : '';
}

// Instead the correctly formatted timestamp string '2017-03-02T00:00:00.000Z',
// CAPI sends the timestamp as '2017-03-02T00:00:00+0000'.
// Note the ending in '+0000' instead of '.000Z'.
// In Safari, new Date('2017-03-02T00:00:00+0000') returns 'Invalid date' object.
// To guard against this, timestampToDateWithFallback(date) tests the date and if not valid,
// calls timestampToDate(date) with occurence of '+0000' replaced with '.000Z'.
export function fixDateStringFormat(dateString) {
  if (dateString && typeof dateString === 'string') {
    return dateString.replace('+0000', '.000Z');
  }
  return dateString;
}

// timestampToDate with fallback to fix incorrect timestamp
export function timestampToDateWithFallback(date) {
  const testDate = getDate(date);
  if (!isValidDate(testDate)) {
    return timestampToDate(fixDateStringFormat(date));
  }
  return timestampToDate(date);
}

// timestampToDateTimeWithFallback with fallback to fix incorrect timestamp
export function timestampToDateTimeWithFallback(date) {
  const testDate = getDate(date);
  if (!isValidDate(testDate)) {
    return timestampToDateTime(fixDateStringFormat(date));
  }
  return timestampToDateTime(date);
}

export function formatTimeFor24Hours(publishTime) {
  if (!publishTime) {
    return '';
  }
  const publishTimeFromNow = Date.now() - timestampToEpochMs(publishTime);
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const TWENTY_FOUR_HOURS = 24 * ONE_HOUR;
  if (ONE_MINUTE > publishTimeFromNow) {
    return 'Moments Ago';
  }
  if (ONE_HOUR > publishTimeFromNow) {
    return `${Math.round(publishTimeFromNow / ONE_MINUTE)} Min Ago`;
  }
  if (TWENTY_FOUR_HOURS > publishTimeFromNow) {
    const hourValue = Math.round(publishTimeFromNow / ONE_HOUR);
    const hourString = hourValue === 1 ? 'Hour' : 'Hours';
    return `${hourValue} ${hourString} Ago`;
  }
  if (publishTimeFromNow > TWENTY_FOUR_HOURS) {
    return timestampToDateWithFallback(publishTime);
  }

  return '';
}

export function toSixHourFormat(datePublished) {
  if (!datePublished) {
    return '';
  }
  const formattedDatePublished = formatForAllBrowsers(datePublished);
  const publishTimeFromNow = Date.now() - timestampToEpochMs(formattedDatePublished);
  const ONE_MINUTE = 60 * 1000;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const SIX_HOURS = 6 * ONE_HOUR;

  if (ONE_MINUTE > publishTimeFromNow) {
    return 'Moments Ago';
  }
  if (ONE_HOUR > publishTimeFromNow) {
    return `${Math.round(publishTimeFromNow / ONE_MINUTE)} Min Ago`;
  }
  if (SIX_HOURS > publishTimeFromNow) {
    const hourValue = Math.round(publishTimeFromNow / ONE_HOUR);
    if (hourValue === 1) {
      return 'An Hour Ago';
    }
    return `${hourValue} Hours Ago`;
  }

  return null;
}

export function dateToHourMinAMPM(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const strTime = `${hours % 12 || 12}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
  return strTime;
}

export const minutesAgo = (dateTimestamp) => {
  const differenceInMinutes = (Date.now() - new Date(dateTimestamp).getTime()) / 1000 / 60;
  return Math.floor(differenceInMinutes);
};

export const weekdays = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tues',
  3: 'Wed',
  4: 'Thurs',
  5: 'Fri',
  6: 'Sat'
};

export const months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

export const OrdinalMap = {
  1: 'st',
  2: 'nd',
  3: 'rd'
};
