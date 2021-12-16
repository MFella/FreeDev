export class OfferResolver {
  private static readonly DAY_IN_SECONDS_FACTOR: number = 24 * 60 * 60 * 1000;

  static convertPeriodToDate(period: string): Array<Date> {
    switch (period) {
      case 'ANY':
        return [];
      case 'THIS_DAY':
        return [
          new Date(),
          new Date(new Date().getTime() - OfferResolver.DAY_IN_SECONDS_FACTOR),
        ];
      case 'THIS_WEEK':
        return [
          new Date(),
          new Date(
            new Date().getTime() - 7 * OfferResolver.DAY_IN_SECONDS_FACTOR,
          ),
        ];
      case 'THIS_MONTH':
        return [
          new Date(),
          new Date(
            new Date().getTime() - 30 * OfferResolver.DAY_IN_SECONDS_FACTOR,
          ),
        ];
      case 'THIS_YEAR':
        return [
          new Date(),
          new Date(
            new Date().getTime() - 365 * OfferResolver.DAY_IN_SECONDS_FACTOR,
          ),
        ];
      default:
        return [];
    }
  }

  static convertSalaryToNumber(salaries: Array<string>): Array<number> {
    if (!salaries.length || salaries.length === 1) {
      return [];
    }
    return salaries.map((salary: string) => Number(salary));
  }
}
