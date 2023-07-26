//              {
//                "inject": true,
//                "bundleName": "echart-build",
//                "input": "node_modules/echarts/dist/echarts.min.js"
//              },
// export const echarts: typeof import('echarts') = window['echarts'];
// /* eslint-disable  @typescript-eslint/no-non-null-assertion */
// export class EChart {
//   pie({ id }: { id: string }): any {
//     setTimeout(() => {
//       const element = document.getElementById(id);
//       if (element) {
//         const img =
//           'data:image/png;base64,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';
//         const datasource = [
//           { name: 'Korea', value: 1500 },
//           { name: 'Japan', value: 8000 },
//           { name: 'China', value: 5000 },
//           { name: 'United States', value: 15000 },
//           { name: 'Vietnam', value: 1000 },
//           { name: 'Global', value: 2000 },
//           { name: 'Malaysia', value: 500 },
//           { name: 'India', value: 1000 },
//         ];
//         const legenddata = ['Korea', 'Japan', 'China', 'United States', 'Vietnam', 'Global', 'Malaysia', 'India'];
//         const data = [];
//         const color = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6B7280', '#EC4899', '#8B5CF6', '#6366F1'];
//         for (let i = 0; i < datasource.length; i++) {
//           data.push(
//             {
//               value: datasource[i].value,
//               name: datasource[i].name,
//               itemStyle: {
//                 borderWidth: 5,
//                 shadowBlur: 20,
//                 borderColor: color[i],
//                 shadowColor: color[i],
//               },
//             },
//             {
//               value: 2,
//               name: '',
//               itemStyle: {
//                 label: {
//                   show: false,
//                 },
//                 labelLine: {
//                   show: false,
//                 },
//                 color: 'rgba(0, 0, 0, 0)',
//                 borderColor: 'rgba(0, 0, 0, 0)',
//                 borderWidth: 0,
//               },
//             },
//           );
//         }
//         const seriesOption = [
//           {
//             name: '',
//             type: 'pie',
//             clockwise: false,
//             radius: [105, 109],
//             emphasis: { scale: false },
//             label: {
//               show: true,
//               position: 'outside',
//               color: '#fff',
//               formatter: function (params: any) {
//                 let percent = '0';
//                 let total = 0;
//                 for (let i = 0; i < datasource.length; i++) {
//                   total += datasource[i].value;
//                 }
//                 percent = ((params.value / total) * 100).toFixed(0);
//                 if (params.name !== '') {
//                   return params.name + '\n' + '\n' + params.value + ': ' + percent + '%';
//                 } else {
//                   return '';
//                 }
//               },
//             },
//             labelLine: {
//               length: 30,
//               length2: 60,
//               show: true,
//               color: '#fff',
//             },
//             data: data,
//           },
//         ];
//
//         echarts.init(element).setOption({
//           color: color,
//           grid: {
//             top: '0',
//             left: '0',
//             bottom: '0',
//             right: '0',
//           },
//           graphic: {
//             elements: [
//               {
//                 type: 'image',
//                 z: 3,
//                 style: {
//                   image: img,
//                   width: 178,
//                   height: 178,
//                 },
//                 left: 'center',
//                 top: 'center',
//                 x: 100,
//                 y: 100,
//               },
//             ],
//           },
//           tooltip: {
//             show: false,
//           },
//           legend: {
//             icon: 'circle',
//             orient: 'horizontal',
//             data: legenddata,
//             bottom: '10px',
//             textStyle: {
//               color: '#fff',
//             },
//           },
//           toolbox: {
//             show: false,
//           },
//           series: seriesOption,
//         });
//       }
//     }, 500);
//   }
//
//   line({
//     id,
//     label,
//     series,
//     color,
//     legend,
//     grid = {},
//     xAxis = {},
//   }: {
//     id: string;
//     label: string[];
//     color: string[];
//     series: {
//       name: string;
//       type: string;
//       smooth: boolean;
//       showSymbol: boolean;
//       symbolSize: number;
//       lineStyle: {
//         width: number;
//         color: string;
//       };
//       areaStyle: {
//         color: any;
//       };
//       data: number[];
//     }[];
//     legend?: {
//       textStyle?: {
//         color?: string;
//       };
//     };
//     grid?: {
//       top?: string;
//       left?: string;
//       bottom?: string;
//       right?: string;
//     };
//     xAxis?: {
//       axisLabel?: { show?: boolean };
//       axisLine?: {
//         show?: boolean;
//         lineStyle?: { color?: string };
//       };
//       splitLine?: { show?: boolean };
//       axisTick?: {
//         show?: boolean;
//         lineStyle?: { color?: string };
//       };
//     };
//   }): any {
//     setTimeout(() => {
//       const element = document.getElementById(id);
//       if (element) {
//         echarts.init(element).setOption({
//           color,
//           legend,
//           grid: {
//             top: '0',
//             left: '0',
//             bottom: '0',
//             right: '0',
//             ...grid,
//           },
//           tooltip: {
//             trigger: 'axis',
//           },
//           xAxis: [
//             {
//               type: 'category',
//               boundaryGap: false,
//               axisLabel: { show: false },
//               axisLine: { show: false },
//               splitLine: { show: false },
//               axisTick: { show: false },
//               ...xAxis,
//               data: label,
//             },
//           ],
//           yAxis: [
//             {
//               boundaryGap: false,
//               type: 'value',
//               axisLabel: { show: false },
//               splitLine: { show: false },
//               axisLine: { show: false },
//               axisTick: { show: false },
//             },
//           ],
//           series,
//         });
//       }
//     }, 500);
//   }
//
//   bar({
//     id,
//     label,
//     series,
//     tooltip = {},
//     grid = {},
//     legend = {},
//     xAxis = {},
//   }: {
//     id: string;
//     label: string[];
//     series: {
//       name: string;
//       type: string;
//       barWidth: string;
//       itemStyle: {
//         color: string;
//         borderRadius: number;
//       };
//       data: number[];
//     }[];
//     tooltip?: {
//       backgroundColor?: string;
//       textStyle?: {
//         color?: string;
//       };
//     };
//     grid?: {
//       left?: string;
//       bottom?: string;
//       right?: string;
//     };
//     legend?: {
//       textStyle?: {
//         color?: string;
//       };
//     };
//     xAxis?: {
//       show?: boolean;
//     };
//   }): any {
//     setTimeout(() => {
//       const element = document.getElementById(id);
//       if (element) {
//         echarts.init(element).setOption({
//           tooltip: {
//             trigger: 'axis',
//             ...tooltip,
//           },
//           grid: {
//             top: '40px',
//             left: '40px',
//             bottom: '30px',
//             right: '40px',
//             ...grid,
//           },
//           legend: {
//             show: true,
//             ...legend,
//           },
//           xAxis: {
//             type: 'category',
//             boundaryGap: false,
//             axisLabel: {
//               show: true,
//             },
//             axisLine: {
//               show: true,
//               lineStyle: {
//                 color: '#000000',
//               },
//             },
//             splitLine: {
//               show: false,
//             },
//             axisTick: {
//               show: true,
//               lineStyle: {
//                 color: '#000000',
//               },
//             },
//             ...xAxis,
//             data: label,
//           },
//           yAxis: {
//             show: false,
//             type: 'value',
//           },
//           series,
//         });
//       }
//     }, 500);
//   }
//
//   barStack({ id }: { id: string }): any {
//     setTimeout(() => {
//       const element = document.getElementById(id);
//       if (element) {
//         const label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev'];
//         const data = {
//           korea: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
//           japan: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
//           china: [184, 281, 114, 190, 199, 101, 239, 216, 231, 132, 102, 244, 257],
//           unitedStates: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
//           vietnam: [150, 190, 228, 274, 212, 249, 278, 104, 219, 257, 115, 127],
//           global: [164, 285, 115, 281, 295, 124, 125, 262, 177, 160, 267, 253],
//           malaysia: [184, 281, 114, 190, 199, 101, 239, 216, 231, 132, 102, 244, 257],
//           india: [216, 169, 214, 215, 138, 162, 105, 212, 119, 124, 158, 210],
//         };
//         const values = Object.values(data);
//         const transposed = values[0].map((r, i) => values.map((c) => c[i]));
//         const total = transposed.map((row) => row.reduce((a, b) => a + b));
//
//         const color = [
//           '#2563EB',
//           '#10B981',
//           '#F59E0B',
//           '#EF4444',
//           '#6B7280',
//           '#EC4899',
//           '#8B5CF6',
//           '#6366F1',
//           'rgba(59, 130, 246, 0.5)',
//         ];
//         echarts.init(element).setOption({
//           color: color,
//           tooltip: {
//             trigger: 'axis',
//             axisPointer: {
//               type: 'shadow',
//             },
//           },
//           legend: {
//             icon: 'circle',
//             orient: 'horizontal',
//             data: ['Korea', 'Japan', 'China', 'United States', 'Vietnam', 'Global', 'Malaysia', 'India'],
//           },
//           grid: {
//             left: '20px',
//             right: '0',
//             bottom: '0',
//             containLabel: true,
//           },
//           xAxis: [
//             {
//               type: 'category',
//               axisTick: false,
//               data: label,
//             },
//           ],
//           yAxis: [
//             {
//               type: 'value',
//               axisTick: false,
//             },
//           ],
//           series: [
//             {
//               name: 'Korea',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               itemStyle: { borderRadius: [0, 0, 0, 0] },
//               data: data['korea'],
//             },
//             {
//               name: 'Japan',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               data: data['japan'],
//             },
//             {
//               name: 'China',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               itemStyle: { borderRadius: [0, 0, 0, 0] },
//               data: data['china'],
//             },
//             {
//               name: 'United States',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               itemStyle: { borderRadius: [0, 0, 0, 0] },
//               data: data['unitedStates'],
//             },
//             {
//               name: 'Vietnam',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               data: data['vietnam'],
//             },
//             {
//               name: 'Global',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               itemStyle: { borderRadius: [0, 0, 0, 0] },
//               data: data['global'],
//             },
//             {
//               name: 'Malaysia',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               data: data['malaysia'],
//             },
//             {
//               name: 'India',
//               type: 'bar',
//               stack: '2021',
//               barWidth: 20,
//               itemStyle: { borderRadius: [20, 20, 0, 0] },
//               data: data['india'],
//             },
//             {
//               name: 'Total',
//               type: 'line',
//               smooth: true,
//               showAllSymbol: false,
//               symbolSize: 0,
//               lineStyle: {
//                 width: 0,
//                 color: 'rgba(59, 130, 246, 0.5)',
//               },
//               areaStyle: {
//                 color: new echarts.graphic.LinearGradient(
//                   0,
//                   0,
//                   0,
//                   1,
//                   [
//                     { offset: 0, color: 'rgba(59, 130, 246,0.5)' },
//                     { offset: 1, color: 'rgba(59, 130, 246,0.05)' },
//                   ],
//                   false,
//                 ),
//               },
//               data: total,
//               z: 0,
//             },
//           ],
//         });
//       }
//     }, 500);
//   }
//
//   linearGradient({ hex }: { hex: string }): any {
//     return new echarts.graphic.LinearGradient(
//       0,
//       0,
//       0,
//       1,
//       [
//         { offset: 0, color: this.hexToRgba({ hex }) },
//         { offset: 1, color: this.hexToRgba({ hex, alpha: 0.1 }) },
//       ],
//       false,
//     );
//   }
//
//   hexToRgba({ hex, alpha = 1 }: { hex: string; alpha?: number }): string {
//     const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
//     hex = hex.replace(shorthandRegex, function (m, r, g, b) {
//       return r + r + g + g + b + b;
//     });
//     const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
//
//     return result
//       ? 'rgba(' +
//           parseInt(result![1], 16) +
//           ', ' +
//           parseInt(result![2], 16) +
//           ', ' +
//           parseInt(result![3], 16) +
//           ',' +
//           alpha +
//           ')'
//       : '';
//   }
// }
