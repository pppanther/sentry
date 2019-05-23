import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import {t} from 'app/locale';
import LineChart from 'app/components/charts/lineChart';
import MarkPoint from 'app/components/charts/components/markPoint';

import closedSymbol from './closedSymbol';
import detectedSymbol from './detectedSymbol';

function getClosestIndex(data, needle) {
  const index = data.findIndex(([ts], i) => ts > needle);
  if (index === 0) {
    return 0;
  }

  return index !== -1 ? index - 1 : data.length - 1;
}

export default class Chart extends React.Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.number),
    detected: PropTypes.string,
    closed: PropTypes.string,
  };
  render() {
    const {data, detected, closed} = this.props;

    const chartData = data.map(([ts, val], i) => {
      return [
        ts * 1000,
        val.length ? val.reduce((acc, {count} = {count: 0}) => acc + count, 0) : 0,
      ];
    });

    const detectedTs = detected && moment.utc(detected).unix();
    const closedTs = closed && moment.utc(closed).unix();

    const closestDetectedTimestampIndex = detectedTs && getClosestIndex(data, detectedTs);
    const closestClosedTimestampIndex = closedTs && getClosestIndex(data, closedTs);

    const detectedCoordinate = chartData && chartData[closestDetectedTimestampIndex];
    const closedCoordinate =
      chartData && closedTs && chartData[closestClosedTimestampIndex];

    return (
      <LineChart
        isGroupedByDate
        series={[
          {
            seriesName: t('Events'),
            dataArray: chartData,
            markPoint: MarkPoint({
              data: [
                {
                  symbol: `image://${detectedSymbol}`,
                  name: t('Incident Started'),
                  coord: detectedCoordinate,
                },
                ...(closedTs
                  ? [
                      {
                        symbol: `image://${closedSymbol}`,
                        symbolSize: 24,
                        name: t('Incident Closed'),
                        coord: closedCoordinate,
                      },
                    ]
                  : []),
              ],
            }),
          },
        ]}
      />
    );
  }
}
