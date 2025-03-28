import moment from 'moment-timezone';
import type { TPausePeriod } from '~/types';

export const countryCodes = [
  { value: '+1', label: '+1' },
  { value: '+374', label: '+374' },
  { value: '+7', label: '+7' },
];
export const phoneNumberData: Record<'+1' | '+374' | '+7', { mask: string; placeholder: string }> = {
  '+1': { mask: '(###) ##-####-###', placeholder: '(123) 456-7890' },
  '+374': { mask: '(##) ##-##-##', placeholder: '(77) 77-77-77' },
  '+7': { mask: '(###) ###-####', placeholder: '(123) 456-78-90' },
};

export const cities: Record<string, string[]> = {
  yerevan: [
    'ajapnyak',
    'arabkir',
    'kentron',
    'avan',
    'davtashen',
    'erebuni',
    'qanaqer zeytun',
    'malatia sebastia',
    'nor nork',
    'shengavit',
    'nork marash',
    'nubarashen',
  ],

  armavir: [
    'ejmiatsin',
    'argavand',
    'bagramyan',
    'merzavan',
    'metsamor',
    'mrgashat',
    'musaler',
    'nalbandyan',
    'norakert',
    'parakar',
    'ptghunk',
    'tairov',
    'aghavnatun',
    'aknalich',
    'aknashen',
    'alashkert',
    'amberd',
    'apaga',
    'aragats',
    'araks',
    'araks (sardarapat)',
    'arevashat',
    'arevik',
    'arshaluis',
    'artamet',
    'artashar',
    'aygek',
    'aygeshat',
    'bambakashat',
    'dalarik',
    'dasht',
    'dokhs',
    'gay',
    'getashen',
    'griboyedov',
    'hatsik',
    'haykashen',
    'haykavan',
    'janfida',
    'jrrarat',
    'jrashen',
    'khanjian',
    'lenughi',
    'lernagog',
    'lukashin',
    'margara',
    'myasnikyan',
  ],

  ararat: [
    'artashat',
    'masis',
    'ararat',
    'arbath',
    'argavand',
    'avshar',
    'ayntap',
    'azatashen',
    'darakert',
    'dashtavan',
    'geghanist',
    'getapnya',
    'ghukasavan',
    'hayanist',
    'hovtashat',
    'khachpar',
    'marmarashen',
    'mkhchyan',
    'nor kharberd',
    'sayat-nova',
    'surenavan',
    'taperakan',
    'vedi',
    'vosketap',
    'zorak',
    'abovyan',
    'aralez',
    'arevabuyr',
    'arevshat',
    'aygavan',
    'aygezard',
    'bagramyan',
    'bardzrashen',
    'berkanush',
    'byuravan',
    'darbnik',
    'deghdzut',
    'dimitrov',
    'ditak',
    'dvin',
    'getazat',
    'ginevet',
    'hovtashen',
    'jrashen',
    'kanachut',
    'mrgavet',
    'nor kyank',
    'nor kyurin',
    'norabats',
    'nshavan',
    'poqr vedi',
    'shahumyan',
    'sis',
    'sisavan',
    'urtsadzor',
    'vanashen',
    'verin artashat',
    'vostan',
  ],

  kotayk: [
    'abovyan',
    'aghveran',
    'akunk',
    'alapars',
    'aragyugh',
    'aramus',
    'argel',
    'arinj',
    'arzakhan',
    'arzni',
    'balahovit',
    'bjni',
    'byureghavan',
    'charentsavan',
    'dzoraghbyur',
    'garni',
    'getamej',
    'goht',
    'hrazdan',
    'jrvezh',
    'kamaris',
    'qanaqeravan',
    'qarashamb',
    'qasakh',
    'kotayk',
    'mayakovski',
    'mrgashen',
    'nor artamet',
    'nor geghi',
    'nor gyugh',
    'nor hatchen',
    'nurnus',
    'proshyan',
    'ptghni',
    'solak',
    'tsaghkadzor',
    'verin ptghni',
    'yeghvard',
    'zovk',
    'zovuni',
    'artavaz',
    'geghadir',
    'geghashen',
    'getargel',
    'hankavan',
    'hatis',
    'hatsavan',
    'jraber',
    'katnaghbyur',
    'nor yerznka',
    'tsaghnik',
    'oghjberd',
    'zoravan',
  ],

  shirak: [
    'gyumri',
    'akhuryan',
    'artik',
    'ashotsk',
    'maralik',
    'arevik',
    'arevshat',
    'azatan',
    'basen',
    'bashgyugh',
    'horom',
    'jrapi',
    'jrrarat',
    'qaraberd',
    'karnut',
    'keti',
    'lusaghbyur',
    'marmashen',
    'mayisyan',
    'mets mantash',
    'nor kyank',
    'panik',
    'shirak',
    'spandaryan',
    'vahrambakerd',
  ],

  lori: [
    'vanadzor',
    'alaverdi',
    'dsegh',
    'gyulagarak',
    'odzum',
    'spitak',
    'stepanavan',
    'tashir',
    'bazum',
    'dzoraget',
    'gargar',
    'ghursali',
    'karinj',
    'kurtan',
    'lernavan',
    'margahovit',
    'metsavan',
    'nor khachakap',
    'shirakamut',
    'toumanyan',
    'vahagnadzor',
    'vahagni',
    'vardablur',
  ],

  gegharkunik: [
    'chambarak',
    'gavar',
    'martuni',
    'noratus',
    'sevan',
    'vardenis',
    'artsvanist',
    'berdkunk',
    'ddmashen',
    'gandzak',
    'geghamasar',
    'geghamavan',
    'gegharkunik',
    'hayravank',
    'karmirgyugh',
    'ljashen',
    'nerkin getashen',
    'tsovinar',
    'vardadzor',
    'yeranos',
  ],

  syunik: ['goris', 'kajaran', 'kapan', 'meghri', 'sisian', 'shikahogh', 'tsghuk', 'yeghvard'],

  aragatsotn: [
    'agarak',
    'aghtsk',
    'aparan',
    'aragats',
    'aragatsavan',
    'aragatsotn',
    'ashtarak',
    'byurakan',
    'karbi',
    'kosh',
    'mughni',
    'ohanavan',
    'oshakan',
    'parpi',
    'talin',
    'tsaghkahovit',
    'ujan',
    'voskevaz',
    'artashavan',
    'arteni',
    'aruj',
    'ashnak',
    'bazmaghbyur',
    'davtashen',
    'gegharot',
    'nor amanos',
    'nor artik',
    'orgov',
    'saghmosavan',
    'sasunik',
    'voskehat',
    'yeghipatrush',
    'zarinja',
  ],

  tavush: [
    'achajur',
    'berd',
    'dilijan',
    'ijevan',
    'noyemberyan',
    'azatamut',
    'bagratashen',
    'berkaber',
    'choratan',
    'gandzakhar',
    'gosh',
    'haghartsin',
    'haghtanak',
    'khashtarak',
    'koghb',
    'movses',
    'nerkin karchakhbyur',
    'sevqar',
  ],

  'vayots dzor': ['jermuk', 'vayk', 'yeghnadzor', 'aghnajur', 'areni', 'getap', 'herher', 'khachik', 'malishka'],
};

export const clearItems = {
  items: [],
  total_items: 0,
};

export function isClubClosed(openingTime: string, closingTime: string): boolean {
  const currentTime: Date = new Date();
  const opening: Date = new Date(currentTime);
  const closing: Date = new Date(currentTime);

  opening.setHours(parseInt(openingTime.split(':')[0], 10));
  opening.setMinutes(parseInt(openingTime.split(':')[1], 10));
  opening.setSeconds(parseInt(openingTime.split(':')[2], 10));

  closing.setHours(parseInt(closingTime.split(':')[0], 10));
  closing.setMinutes(parseInt(closingTime.split(':')[1], 10));
  closing.setSeconds(parseInt(closingTime.split(':')[2], 10));

  if (openingTime !== '00:00' && closingTime !== '00:00') {
    return currentTime < opening || currentTime > closing;
  }
  return false;
}

export const calculatePercentTimer = (start: string, end: string, pausePeriods: TPausePeriod[]): number => {
  const startTime = moment(start);
  const endTime = moment(end);
  const now = moment();

  // Если таймер не активен или уже закончился
  if (now.isBefore(startTime) || now.isAfter(endTime)) {
    return 0;
  }

  // Общая продолжительность времени без учета пауз
  const totalDuration = endTime.diff(startTime);

  // Вычисление прошедшего времени
  let elapsedTime = now.diff(startTime);

  // Вычисление времени пауз
  let pauseTime = 0;
  for (const pause of pausePeriods) {
    const pauseStart = moment(pause.start);
    const pauseEnd = moment(pause.end);
    if (pauseEnd.isBefore(startTime) || pauseStart.isAfter(endTime)) {
      continue;
    }
    pauseTime += Math.min(pauseEnd.diff(pauseStart), endTime.diff(startTime));
  }

  // Корректировка прошедшего времени на время пауз
  elapsedTime -= pauseTime;

  // Вычисление процента и округление до двух знаков после запятой
  const percent = Math.min(100, (elapsedTime / totalDuration) * 100);
  return parseFloat(percent.toFixed(2)); // Округление
};

export const calculateRemainingTime = (start: string, end: string): number => {
  const now = moment();
  const startTime = moment(start);
  const endTime = moment(end);

  if (now.isBefore(startTime)) {
    return 0;
  }

  if (now.isAfter(endTime)) {
    return 0;
  }

  const totalDuration = endTime.diff(startTime);
  const elapsedDuration = now.diff(startTime);

  return totalDuration - elapsedDuration;
};
// export const getCitiesArray = (region: string) => regionCities[region] || regionCities.yerevan;

export const formattedPrice = (price: number) => {
  const roundedPrice: number = Math.floor(price);
  return roundedPrice.toLocaleString('en-US');
};
export const getCurrentTimeForTimer = (): string => {
  const date: Date = new Date();
  const hours: number = date.getHours();
  const minutes: number = date.getMinutes();
  const seconds: number = date.getSeconds();

  const formattedHours: string = hours.toString().padStart(2, '0');
  const formattedMinutes: string = minutes.toString().padStart(2, '0');
  const formattedSeconds: string = seconds.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
export const minutesToTime = (minutes: number): string => {
  const hours: number = Math.floor(minutes / 60) % 24;
  const remainingMinutes: number = minutes % 60;
  return `${hours < 10 ? '0' : ''}${hours}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`;
};
export const convertMomentDateToMinutes = (date: string) => {
  if (date) {
    return moment(date).format('HH:mm');
  }
};
