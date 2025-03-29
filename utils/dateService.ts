import moment from 'moment-timezone';
import type { TPausePeriod, TTimer, TTimerValues } from '~/types';
import type { Ref } from 'vue';

export class DateService {
  static formatDate(inputDate: string) {
    const originalDate: Date = new Date(inputDate);
    originalDate.setHours(originalDate.getUTCHours() + 8);

    const day: string = originalDate.getUTCDate().toString().padStart(2, '0');
    const month: string = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year: number = originalDate.getUTCFullYear();
    const hours: string = originalDate.getUTCHours().toString().padStart(2, '0');
    const minutes: string = originalDate.getUTCMinutes().toString().padStart(2, '0');

    return {
      dateWithTime: `${hours}:${minutes}, ${day}.${month}.${year}`,
      date: `${day}.${month}.${year}`,
    };
  }

  static convertMomentDateToMinutes(inputDate: string) {
    if (inputDate) {
      return moment(inputDate).format('HH:mm');
    }
  }

  static minutesToTimeString(minutes: number, seconds: number = 0, includeSeconds: boolean = true): string {
    if (minutes < 0) {
      return '00:00';
    }

    const duration = moment.duration(minutes * 60 + seconds, 'seconds');

    const hours = Math.floor(duration.asHours()).toString().padStart(2, '0');
    const mins = duration.minutes().toString().padStart(2, '0');

    if (!includeSeconds) {
      return `${hours}:${mins}`;
    }

    const secs = duration.seconds().toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  }

  static calculatePassedTime(
    start: string,
    pausePeriods: TPausePeriod[],
    isActive: boolean,
    paused: boolean,
    now: moment.Moment = moment(),
  ): { minutes: number; seconds: number } {
    if (!isActive) {
      return { minutes: 0, seconds: 0 };
    }

    const elapsedTime = this.calculateElapsedTime(start, pausePeriods, paused, now);

    return {
      minutes: Math.floor(elapsedTime / 60),
      seconds: elapsedTime % 60,
    };
  }

  static calculateRemainingTime(
    start: string,
    allocatedTime: number,
    pausePeriods: TPausePeriod[],
    isActive: boolean,
    paused: boolean,
    now: moment.Moment = moment(),
  ): { minutes: number; seconds: number } {
    if (!isActive) {
      return { minutes: 0, seconds: 0 };
    }

    const totalDuration = allocatedTime * 60;
    const pauseDuration = this.calculatePauseDuration(pausePeriods);

    const elapsedTime = this.calculateElapsedTime(start, pausePeriods, paused, now);

    const remainingTime = totalDuration - pauseDuration - elapsedTime;

    if (remainingTime <= 0) {
      return { minutes: 0, seconds: 0 };
    }

    return {
      minutes: Math.floor(remainingTime / 60),
      seconds: remainingTime % 60,
    };
  }

  static calculateProgressPercentage(
    start: string,
    allocatedTime: number,
    pausePeriods: TPausePeriod[],
    isActive: boolean,
    paused: boolean,
    isInfinite: boolean,
    now: moment.Moment = moment(),
  ): number {
    if (isInfinite) {
      return 0;
    }

    const startTime: moment.Moment = moment(start);

    if (!isActive || now.isBefore(startTime)) {
      return 0;
    }

    const totalDuration = allocatedTime * 60;

    const { minutes, seconds } = this.calculatePassedTime(start, pausePeriods, isActive, paused, now);
    const passedTimeSeconds = minutes * 60 + seconds;

    const percentage = (passedTimeSeconds / totalDuration) * 100;

    return Math.round(Math.min(100, Math.max(0, percentage)));
  }

  static calculateEndTime(
    start: string,
    allocatedTime: number,
    pausePeriods: TPausePeriod[],
    now: moment.Moment = moment(),
  ): string {
    const startTime = moment(start);
    const pauseDuration = this.calculatePauseDuration(pausePeriods);
    const totalDuration = allocatedTime * 60 - pauseDuration;
    const endTime = startTime.add(totalDuration, 'seconds');

    if (now.isAfter(endTime)) {
      return now.format('HH:mm');
    }

    return endTime.format('HH:mm');
  }

  static updateTimerValues(timerValues: Ref<Record<string, TTimerValues>>, rows: TTimer[]): void {
    rows.forEach((row: TTimer): void => {
      if (!row.isActive || row.paused) {
        timerValues.value[row._id] = {
          passed: '--:--:--',
          remaining: '--:--:--',
          progress: 0,
        } as TTimerValues;
        return;
      }

      const id: string = row._id;
      const isInfinite: boolean = row.isInfinite;
      const start: string = row.startedAt;
      const allocatedTime: number = row.allocatedTime;
      const pausePeriods: TPausePeriod[] = row.pausePeriods as TPausePeriod[];
      const isActive: boolean = row.isActive;
      const paused: boolean = row.paused;

      const { minutes: passedMinutes, seconds: passedSeconds } = this.calculatePassedTime(
        start,
        pausePeriods,
        isActive,
        paused,
      );
      const passedFormatted: string = this.minutesToTimeString(passedMinutes, passedSeconds);

      let remainingFormatted: string = '--:--:--';
      if (!isInfinite) {
        const { minutes, seconds } = this.calculateRemainingTime(start, allocatedTime, pausePeriods, isActive, paused);
        remainingFormatted = this.minutesToTimeString(minutes, seconds);
      }

      let progress: number = 0;
      if (!isInfinite) {
        progress = this.calculateProgressPercentage(start, allocatedTime, pausePeriods, isActive, paused, isInfinite);
      }

      timerValues.value[id] = {
        passed: passedFormatted,
        remaining: remainingFormatted,
        progress,
      } as TTimerValues;
    });
  }

  static calculateElapsedTime(
    start: string,
    pausePeriods: TPausePeriod[],
    paused: boolean,
    now: moment.Moment = moment(),
  ): number {
    const startTime = moment(start);
    const pauseDuration = this.calculatePauseDuration(pausePeriods);
    let elapsedTime: number;

    if (paused && pausePeriods.length > 0) {
      const lastPause = pausePeriods[pausePeriods.length - 1];
      const lastPauseStart = moment(lastPause.startedAt);
      elapsedTime = lastPauseStart.diff(startTime, 'seconds') - pauseDuration;
    } else {
      elapsedTime = now.diff(startTime, 'seconds') - pauseDuration;
    }

    return Math.max(0, elapsedTime);
  }

  static calculatePauseDuration(pausePeriods: TPausePeriod[]): number {
    return pausePeriods.reduce((total, period) => {
      const pauseStart = moment(period.startedAt);
      const pauseEnd = moment(period.endedAt);
      return total + pauseEnd.diff(pauseStart, 'seconds');
    }, 0);
  }
}
