import { test, expect } from '@playwright/test';

import { formatDateAsQueryParam, utcDateToLocal } from '@/utils/fns/dates';

// Node re-reads process.env.TZ whenever it is assigned, so each test can pin its own timezone.
const TIMEZONES = ['America/New_York', 'Asia/Tokyo', 'UTC'];

for (const tz of TIMEZONES) {
  test.describe(`date helpers in ${tz}`, () => {
    let originalTz: string | undefined;
    test.beforeEach(() => {
      originalTz = process.env.TZ;
      process.env.TZ = tz;
    });
    test.afterEach(() => {
      if (originalTz === undefined) delete process.env.TZ;
      else process.env.TZ = originalTz;
    });

    test('utcDateToLocal keeps the UTC calendar date at local midnight', () => {
      // Date-only strings parse as midnight UTC (the form of query params and date bounds).
      const local = utcDateToLocal(new Date('2010-01-22'));
      expect(local.getFullYear()).toBe(2010);
      expect(local.getMonth()).toBe(0);
      expect(local.getDate()).toBe(22);
      expect(local.getHours()).toBe(0);
    });

    test('formatDateAsQueryParam formats local calendar parts as YYYY-MM-DD', () => {
      expect(formatDateAsQueryParam(new Date(2010, 0, 5))).toBe('2010-01-05');
      expect(formatDateAsQueryParam(new Date(2018, 11, 31))).toBe('2018-12-31');
    });

    test('query date round-trips: param -> picker date -> query string', () => {
      for (const param of ['2010-01-22', '2017-05-26', '2018-01-09', '2020-02-29']) {
        expect(formatDateAsQueryParam(utcDateToLocal(new Date(param)))).toBe(param);
      }
    });

    test('formatDateAsQueryParam year mode', () => {
      expect(formatDateAsQueryParam(new Date(2012, 5, 1), 'year')).toBe(2012);
      expect(formatDateAsQueryParam(2015, 'year')).toBe(2015);
    });

    test('formatDateAsQueryParam rejects numbers in date mode', () => {
      expect(() => formatDateAsQueryParam(2015)).toThrow();
    });
  });
}
