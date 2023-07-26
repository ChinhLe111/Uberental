import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCurrency',
  pure: false,
})
export class FormatCurrencyPipe implements PipeTransform {
  transform(money: number, unit?: string): string {
    return (money ? money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0') + (unit ? unit : '');
  }
}
