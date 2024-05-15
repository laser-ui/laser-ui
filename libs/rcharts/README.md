# @laser-ui/rcharts

Apache Echarts for React.

# Installation

```
npm install @laser-ui/rcharts
```

# Getting Started

```tsx
import type { ECharts } from 'echarts/core';

import { RCharts } from '@laser-ui/rcharts';
import { useEffect, useRef } from 'react';

export default function App() {
  const chartRef = useRef<ECharts>(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.setOption({
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ],
      });
    }

    const tid = setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.setOption(
          {
            series: [
              {
                data: [150, 230, 224, 218, 135, 147, 260].reverse(),
                type: 'line',
              },
            ],
          },
          { replaceMerge: 'series' },
        );
      }
    }, 3000);
    return () => {
      clearTimeout(tid);
    };
  }, []);

  return <RCharts ref={chartRef} style={{ width: 400, height: 400 }} />;
}
```

# API

```ts
export interface RChartsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  init?: (el: HTMLDivElement) => ECharts;
  autoResize?: boolean;
  autoResizeDebounce?: number;
}
```
