import type { TBadgeColor, TRating, TTimer } from '~/types';

export class ClubService {
  static calculateClubOccupancy(timers: TTimer[]): number {
    const totalTimers: number = timers.length;
    const activeTimers: number = timers.filter((timer: TTimer) => timer.isActive).length;

    return Math.round((activeTimers / totalTimers) * 100);
  }

  static getOccupancyColorClass(occupancy: number = 0): string {
    if (occupancy === 0) return 'text-gray-500';
    if (occupancy < 50) return 'text-green-500';
    if (occupancy <= 75) return 'text-orange-500';
    return 'text-red-500';
  }

  static colorOfClubOpenStatus: { [key in 'true' | 'false']: TBadgeColor } = {
    true: 'success',
    false: 'error',
  };

  static calculateAverageRating(ratings: TRating[]): number {
    if (ratings.length === 0) {
      return 0;
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return totalRating / ratings.length;
  }

  static slugifyClubName(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);
  }

  static formattedPrice(value: number): string {
    const roundedPrice: number = Math.floor(value);
    return roundedPrice.toLocaleString('en-US');
  }
}
