import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(localeData);
dayjs.extend(updateLocale);

dayjs.updateLocale('zh-cn', {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  meridiem: (hour: number, minute: number, isLowercase: number) => {
    return hour > 12 ? 'PM' : 'AM';
  },
});

export default dayjs;
