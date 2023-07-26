import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullTextSearch',
  pure: false,
})
export class FullTextSearchPipe implements PipeTransform {
  transform(value: any, query: string, field: string): any {
    return query
      ? value.reduce((prev: any, next: any) => {
          if (next[field].toUpperCase().includes(query.toUpperCase())) {
            prev.push(next);
          }
          return prev;
        }, [])
      : value;
  }
}
