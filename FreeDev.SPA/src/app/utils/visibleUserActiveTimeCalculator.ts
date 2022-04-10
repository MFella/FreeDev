import moment from 'moment';

export class VisibleUserActiveTimeCalculator {
  private static readonly SECONDS_IN_MINUTE = 60;
  private static readonly MINUTES_IN_HOURS = 60;
  private static readonly HOURS_IN_DAY = 24;
  private static readonly AVERAGE_NUMBER_OF_DAYS_IN_MONTH = 30;
  static getClosestTimePeriod(lastActive: Date): string {
    const rightNow = moment(new Date());
    const end = moment(new Date(lastActive));
    const durationBetweenTimePeriods = moment.duration(rightNow.diff(end));
    const durationInSecods = Math.floor(durationBetweenTimePeriods.asSeconds());
    const durationInMinutes = Math.floor(
      durationBetweenTimePeriods.asMinutes()
    );
    const durationInHours = Math.floor(durationBetweenTimePeriods.asHours());
    const durationInDays = Math.floor(durationBetweenTimePeriods.asDays());

    if (durationInSecods < VisibleUserActiveTimeCalculator.SECONDS_IN_MINUTE) {
      return durationInSecods + 'second(s) ';
    }

    if (durationInMinutes < VisibleUserActiveTimeCalculator.MINUTES_IN_HOURS) {
      return durationInMinutes + 'minute(s) ';
    }

    if (durationInHours < VisibleUserActiveTimeCalculator.HOURS_IN_DAY) {
      return durationInHours + 'hour(s) ';
    }

    if (
      durationInDays <
      VisibleUserActiveTimeCalculator.AVERAGE_NUMBER_OF_DAYS_IN_MONTH
    ) {
      return durationInDays + 'day(s) ';
    }

    return '';
  }
}
