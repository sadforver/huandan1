import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'planStatus',
})
export class planStatusPipe implements PipeTransform {
  transform(value: string, args?: any): string {
    switch (value) {
      case 'S':
        return '预约成功';
      case 'F':
        return '预约失败';
      case 'P':
        return '审核通过';
      case 'R':
        return '审核驳回';
      default:
        return '/';
    }
  }
}
