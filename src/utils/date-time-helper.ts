/**
 * Utility class for handling date and time data.
 */
export class DateTimeHelper {
    /**
     * Map of week day index and their corresponding weekday names
     */
    private static weekdayMap: { [dayNumber: number]: string; } = {
        0: 'Montag',
        1: 'Dienstag',
        2: 'Mittwoch',
        3: 'Donnerstag',
        4: 'Freitag',
        5: 'Samstag',
        6: 'Sonntag'
    };

    /**
     * Map of week day index and their corresponding weekday names
     */
    private static monthsMap: { [monthNumber: number]: string; } = {
        0: 'Januar',
        1: 'Februar',
        2: 'März',
        3: 'April',
        4: 'Mai',
        5: 'Juni',
        6: 'Juli',
        7: 'August',
        8: 'September',
        9: 'Oktober',
        10: 'November',
        11: 'Dezember'
    };

    /**
     * Determines the month name from date.
     * @param date The date to determine the month from
     * @return the determined month
     */
    public static getMonthName(date: Date): string {
        return DateTimeHelper.monthsMap[date.getMonth()];
    }

    /**
     * Determines the weekday name from date.
     * @param date The date to determine the weekday from
     * @return the determined weekday
     */
    public static getWeekday(date: Date): string {
        return DateTimeHelper.weekdayMap[date.getDay() - 1];
    }

    /**
     * Generates date as normalized string representation from given date.
     * @param date The date to generate the time string from.
     * @return the normalized date string
     */
    public static getDateString(date: Date): string {
        let stringParts:string[] = date.toLocaleDateString().split('.');
        stringParts[0] = DateTimeHelper.addLeadingZeroIfRequired(Number(stringParts[0])) + stringParts[0];
        stringParts[1] = DateTimeHelper.addLeadingZeroIfRequired(Number(stringParts[1])) + stringParts[1];
        return stringParts[0] + '.' + stringParts[1] + '.' + stringParts[2];
    }

    /**
     * Generates time as string representation from given date.
     * @param date The date to generate the time string from.
     * @return the time string
     */
    public static getTimeString(date: Date): string {
        return DateTimeHelper.addLeadingZeroIfRequired(date.getHours()) + date.getHours() + DateTimeHelper.addEndingZeroIfRequired(date.getHours())
            +  ':' +
            DateTimeHelper.addLeadingZeroIfRequired(date.getMinutes()) + date.getMinutes() + DateTimeHelper.addEndingZeroIfRequired(date.getMinutes());
    }

    /**
     * Get the hours from a time-string.
     * @param timeString The time-string tom parse the hours from
     * @return the parsed hours
     */
    public static getHours(timeString: string): number {
        return Number(timeString.split(':')[0]);
    }

    /**
     * Add two time-strings.
     * @param timeStringA time-string A
     * @param timeStringB time-string B which will be added to A
     * @return the sum time-string
     */
    public static addTimeStrings(timeStringA: string, timeStringB: string): string {
        let timePartsA = timeStringA.split(':');
        let timePartsB = timeStringB.split(':');
        let hours = Number(timePartsA[0]) + Number(timePartsB[0]);
        let minutes = Number(timePartsA[1]) + Number(timePartsB[1]);
        if(minutes > 60) {
            let remainderHours = Math.trunc(minutes/60);
            hours += remainderHours;
            minutes = minutes%60;
        }
        return DateTimeHelper.addLeadingZeroIfRequired(hours) + hours + ':' + DateTimeHelper.addLeadingZeroIfRequired(minutes) + minutes +
            DateTimeHelper.addEndingZeroIfRequired(minutes);
    }

    /**
     * Subtracts two time-strings.
     * @param timeStringA time-string A
     * @param timeStringB time-string B which will be subtracted from A
     * @return the difference time-string
     */
    public static subtractTimeStrings(timeStringA: string, timeStringB: string): string {
        let timePartsA = timeStringA.split(':');
        let timePartsB = timeStringB.split(':');
        let hours = Number(timePartsA[0]) - Number(timePartsB[0]);
        let minutes = Number(timePartsA[1]) - Number(timePartsB[1]);
        if(minutes < 0) {
            hours -= 1;
            minutes = 60 - Math.abs(minutes);
        }
        return DateTimeHelper.addLeadingZeroIfRequired(hours) + hours + ':' + DateTimeHelper.addLeadingZeroIfRequired(minutes) + minutes +
            DateTimeHelper.addEndingZeroIfRequired(minutes);
    }

    /**
     * Determines whether to add ending zeros to a time string or not.
     * @param time The time to potentially add an ending zero to
     * @return a zero or empty string
     */
    private static addLeadingZeroIfRequired(time: number): string {
        return time.toString().length == 1 && time !== 0 ? '0' : '';
    }

    /**
     * Determines whether to add ending zeros to a time string or not.
     * @param time The time to potentially add an ending zero to
     * @return a zero or empty string
     */
    private static addEndingZeroIfRequired(time: number): string {
        return time == 0 ? '0' : '';
    }

    /**
     * Get passed time description for a specific date timestamp.
     * @param date The date to determine the 'passed time' description from
     * @return the determined passed time description
     */
    public static getPassedTimeDescription(date: Date): string {
        let dateString = '';
        let time = (Date.now() - new Date(date).getTime())/1000/60;
        // check for minute
        if(time < 1) {
            dateString = 'gerade eben';
        } else if(time >= 1 && time < 59) {
            dateString = 'vor ' + (time < 2 ? 'einer Minute' : + Math.floor(time) + ' Minuten')
        } else {
            // check for hours
            time = Math.floor(time / 60);
            if(time >= 1 && time < 24) {
                dateString = 'vor ' + (time <= 1 ? 'einer Stunde' : time + ' Stunden')
            } else {
                // check for days
                time = Math.floor(time / 24);

                if(time >= 1 && time < 6) {
                    dateString = 'vor ' + (time <= 1 ? 'einem Tag' : time + ' Tagen')
                } else {
                    // check for weeks
                    let days = time;

                    if(days >= 7 && days <= 30) {
                        let weeks = Math.floor(days / 7);
                        dateString = 'vor ' + (weeks <= 1 ? 'einer Woche' : weeks + ' Wochen')
                    } else {
                        // check for months
                        time = Math.floor(days / 30);
                        days = days%30;
                        if(time >= 1 && time <= 12) {
                            let passedWeeks = Math.floor(days / 7);
                            dateString = 'vor ' + (time <= 1 ? 'einem Monat' : time + ' Monaten');
                            // dateString +=  (passedWeeks < 1 ? '' : (passedWeeks < 2 ? ' und einer Woche' : ' und ' + passedWeeks + ' Wochen'));
                        } else {
                            // check for years
                            time = Math.floor(time /12);
                            dateString = 'vor ' + (time <= 1 ? 'einem Jahr' : time + ' Jahren');
                        }
                    }
                }
            }
        }
        return dateString;
    }
}