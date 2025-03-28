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
    const startTime = moment(start);

    if (!isActive) {
      return { minutes: 0, seconds: 0 };
    }

    let pauseDuration = 0;
    for (const period of pausePeriods) {
      const pauseStart = moment(period.start);
      const pauseEnd = moment(period.end);
      pauseDuration += pauseEnd.diff(pauseStart, 'seconds');
    }

    let elapsedTime: number;
    if (paused) {
      const lastPause = pausePeriods[pausePeriods.length - 1];
      if (lastPause) {
        const lastPauseStart = moment(lastPause.start);
        elapsedTime = lastPauseStart.diff(startTime, 'seconds') - pauseDuration;
      } else {
        elapsedTime = 0;
      }
    } else {
      elapsedTime = now.diff(startTime, 'seconds') - pauseDuration;
    }

    elapsedTime = Math.max(0, elapsedTime);
    return {
      minutes: Math.floor(elapsedTime / 60),
      seconds: elapsedTime % 60,
    };
  }

  static calculateRemainingTime(
    start: string,
    end: string,
    pausePeriods: TPausePeriod[],
    isActive: boolean,
    paused: boolean,
    now: moment.Moment = moment(),
  ): { minutes: number; seconds: number } {
    const startTime = moment(start);
    const endTime = moment(end);

    if (!isActive || now.isAfter(endTime)) {
      return { minutes: 0, seconds: 0 };
    }

    if (now.isBefore(startTime)) {
      const totalSeconds = endTime.diff(startTime, 'seconds');
      return {
        minutes: Math.floor(totalSeconds / 60),
        seconds: totalSeconds % 60,
      };
    }

    const totalDuration = endTime.diff(startTime, 'seconds');

    let pauseDuration = 0;
    for (const period of pausePeriods) {
      const pauseStart = moment(period.start);
      const pauseEnd = moment(period.end);
      pauseDuration += pauseEnd.diff(pauseStart, 'seconds');
    }

    let elapsedTime: number;
    if (paused) {
      const lastPause = pausePeriods[pausePeriods.length - 1];
      if (lastPause) {
        const lastPauseStart = moment(lastPause.start);
        elapsedTime = lastPauseStart.diff(startTime, 'seconds') - pauseDuration;
      } else {
        elapsedTime = 0;
      }
    } else {
      elapsedTime = now.diff(startTime, 'seconds') - pauseDuration;
    }

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
    end: string,
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
    const endTime: moment.Moment = moment(end);

    if (now.isBefore(startTime)) {
      return 0;
    }

    if (now.isAfter(endTime)) {
      return 100;
    }

    const totalDuration = endTime.diff(startTime, 'seconds');
    if (totalDuration <= 0) {
      return 0;
    }

    const { minutes, seconds } = this.calculatePassedTime(start, pausePeriods, isActive, paused, now);
    const passedTimeSeconds = minutes * 60 + seconds;

    const percentage = (passedTimeSeconds / totalDuration) * 100;

    return Math.round(Math.min(100, Math.max(0, percentage)));
  }

  static updateTimerValues(timerValues: Ref<Record<string, TTimerValues>>, rows: TTimer[]) {
    rows.forEach((row): void => {
      if (!row.isActive) {
        timerValues.value[row._id] = {
          passed: '--:--:--',
          remaining: '--:--:--',
          progress: 0,
        };
        return;
      }

      const id: string = row._id;
      const isInfinite: boolean = row.isInfinite;
      const start: string = row.start;
      const end: string = row.end;
      const pausePeriods: TPausePeriod[] = row.pausePeriods as TPausePeriod[];
      const isActive: boolean = row.isActive;
      const paused: boolean = row.paused;

      const { minutes: passedMinutes, seconds: passedSeconds } = this.calculatePassedTime(
        start,
        pausePeriods,
        isActive,
        paused,
      );
      const passedFormatted = this.minutesToTimeString(passedMinutes, passedSeconds);

      let remainingFormatted = '--:--:--';
      if (!isInfinite) {
        const { minutes, seconds } = this.calculateRemainingTime(start, end, pausePeriods, isActive, paused);
        remainingFormatted = this.minutesToTimeString(minutes, seconds);
      }

      let progress = 0;
      if (!isInfinite) {
        progress = this.calculateProgressPercentage(start, end, pausePeriods, isActive, paused, isInfinite);
      }

      timerValues.value[id] = {
        passed: passedFormatted,
        remaining: remainingFormatted,
        progress,
      };
    });
  }
}
