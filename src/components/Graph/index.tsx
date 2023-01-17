import { PageProps } from 'pages';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Props extends Pick<PageProps, `graphDataList`> {
  text: string;
}

export const Graph = ({ graphDataList, text }: Props) => {
  const humidityList = graphDataList.map((graphData) => Math.floor(graphData.humidity * 10) / 10);
  const blinkTotalList = graphDataList.map((graphData) => Math.floor(graphData.blinkTotal));

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `瞬き回数と湿度のグラフ~${text}間毎の推移~`,
        },
      },
    }),
    []
  );

  const data = {
    labels: humidityList,
    datasets: [
      {
        borderWidth: text === '１分' ? 1 : 5,
        label: '瞬き回数',
        data: blinkTotalList,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };
  return <Line options={options} data={data} width={1000} height={500} />;
};
