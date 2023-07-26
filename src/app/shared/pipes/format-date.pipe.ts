import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'formatDate',
  pure: false,
})
export class FormatDatePipe implements PipeTransform {
  transform(date?: string, format = 'HH:mm:ss DD/MM'): string {
    return date ? moment(date).format(format) : '';
  }
}
