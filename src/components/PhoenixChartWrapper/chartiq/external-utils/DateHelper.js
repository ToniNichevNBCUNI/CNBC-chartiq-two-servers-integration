function DateHelper() {

		function getBeginningOfTheDay() {
				var _date = new Date()
				var past_date = new Date(_date.getFullYear(), _date.getMonth(), _date.getDate(), '09', 0, 0, 0)
				return past_date
		}

    function getPastDateFromDate(_date, pastDays) {
        var day = _date.getDate() - pastDays
        var past_date = new Date(_date.getFullYear(), _date.getMonth(), day, '09', 0, 0, 0)
        return past_date
    }

    function dateToDateStr(_date) {
        var y = _date.getFullYear()
        var m = formatWithLeadingZero(_date.getMonth() + 1)
        var d = formatWithLeadingZero(_date.getDate())

        var h  = formatWithLeadingZero(_date.getHours())
        var mm = formatWithLeadingZero(_date.getMinutes())
        var ss = formatWithLeadingZero(_date.getSeconds())
        var ms = formatWithLeadingZero(Math.round(_date.getMilliseconds() * 0.1))

        function formatWithLeadingZero(v) {
            return v > 9 ? "" + v : '0' + v
        }

        return y + m + d + h + mm + ss + ms
    }

		function dateStringToDateObject(dateStr) {
			var d = dateStr
	    var newDate = d[0]+d[1]+d[2]+d[3]+'-'+d[4]+d[5]+'-'+d[6]+d[7]+' '+d[8]+d[9]+':'+d[10]+d[11]
	    var dateObject = new Date(newDate)
			return dateObject
		}

    return {
        dateToDateStr: dateToDateStr,
        getPastDateFromDate: getPastDateFromDate,
				getBeginningOfTheDay: getBeginningOfTheDay
    }
}

module.exports = DateHelper;