const DateHelper = {
  // getBeginningOfTheDay function rounds to start of day at 00:00:00
  getBeginningOfTheDay() {
    const date = new Date();
    const pastDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), '00', '00', '0', '0');
    return pastDate;
  }, // getEndOfTheDay function rounds to the next month at 00:00:00
  getEndOfTheDay() {
    const date = new Date();
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), '00', '00', '0', '0');
    return endDate;
  },
  getPastDateFromDate(date, pastDays) {
    const day = date.getDate() - pastDays;
    const pastDate = new Date(date.getFullYear(), date.getMonth(), day, '00', '0', '0', '0');
    return pastDate;
  },
  dateToDateStr(date) {
    const valueToAddLeadingZero = 9;
    const yearToUseFixedStartDate = 1985;
    const y = date.getFullYear();
    function formatWithLeadingZero(v) {
      return v > valueToAddLeadingZero ? `${  v}` : `0${  v}`;
    }

    if (y < yearToUseFixedStartDate) {
      return '19800101000000';
    }
    const m = formatWithLeadingZero(date.getMonth() + 1);
    const d = formatWithLeadingZero(date.getDate());

    const h = formatWithLeadingZero('0');
    const mm = formatWithLeadingZero('0');
    const ss = formatWithLeadingZero('0');

    return y + m + d + h + mm + ss;

  },
  dateStringToDateObject(dateStr) {
    const d = dateStr;
    const newDate = `${d[0] + d[1] + d[2] + d[3]  }/${  d[4]  }${d[5]  }/${  d[6]  }${d[7]  } ${  d[8]  }${d[9]  }:${  d[10]  }${d[11]}`;
    const dateObject = new Date(newDate);
    return dateObject;
  },
};

export default DateHelper;
