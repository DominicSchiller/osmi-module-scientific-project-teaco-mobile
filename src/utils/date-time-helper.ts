/**
 * Utility class for handling date and time data.
 */
export class DateTimeHelper {
    /**
     * Get passed time description for a specific date timestamp.
     * @param date The date to determine the 'passed time' description from
     */
    public static getPassedTimeDescription(date: Date): string {
        let dateString = "";
        let time = (Date.now() - new Date(date).getTime())/1000/60;
        // check for minute
        if(time < 1) {
            dateString = "gerade eben";
        } else if(time >= 1 && time < 59) {
            dateString = "vor " + (time < 2 ? "einer Minute" : + Math.floor(time) + " Minuten")
        } else {
            // check for hours
            time = Math.floor(time / 60);
            if(time >= 1 && time < 24) {
                dateString = "vor " + (time <= 1 ? "einer Stunde" : time + " Stunden")
            } else {
                // check for days
                time = Math.floor(time / 24);

                if(time >= 1 && time < 6) {
                    dateString = "vor " + (time <= 1 ? "einem Tag" : time + " Tagen")
                } else {
                    // check for weeks
                    let days = time;

                    if(days >= 7 && days <= 30) {
                        let weeks = days / 7;
                        dateString = "vor " + (weeks <= 1 ? "einer Woche" : weeks + " Wochen")
                    } else {
                        // check for months
                        time = Math.floor(days / 30);
                        days = days%30;
                        if(time >= 1 && time <= 12) {
                            let passedWeeks = Math.floor(days / 7);
                            dateString = "vor " + (time <= 1 ? "einem Monat" : time + " Monaten");
                            // dateString +=  (passedWeeks < 1 ? "" : (passedWeeks < 2 ? " und einer Woche" : " und " + passedWeeks + " Wochen"));
                        } else {
                            // check for years
                            time = Math.floor(time /12);
                            console.log(time);
                            dateString = "vor " + (time <= 1 ? "einem Jahr" : time + " Jahren");
                        }
                    }
                }
            }
        }
        return dateString;
    }
}