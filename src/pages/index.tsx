import { axios } from 'customAxios';
import type { GetServerSideProps, NextPage } from 'next';
import { Graph } from 'components/Graph';
import { Header } from 'components/Header';

import Styles from 'styles/home.module.scss';
import { WarningTotal } from 'components/WarningTotal.tsx';

interface ApiResponse {
  data: {
    date: Date; // 2022-11-01
    warningTotal: number; // 1
    graphDataList: {
      blinkTotal: number; // 23
      humidity: number; // 53.3
    }[];
  }[];
}

type OneDayApiResponse = ApiResponse['data'][number];

export interface PageProps extends OneDayApiResponse {
  hourGraphDataList: OneDayApiResponse['graphDataList'] | false;
}

const Home: NextPage<PageProps> = ({ date, warningTotal, graphDataList, hourGraphDataList }) => {
  return (
    <div className={Styles.home}>
      <Header />
      <div className={Styles.home__warningTotal}>
        <WarningTotal date={date} warningTotal={warningTotal} />
      </div>
      <main className={Styles.home__main}>
        <Graph graphDataList={graphDataList} text={'１分'} />
        {hourGraphDataList && <Graph graphDataList={graphDataList} text={'１時間'} />}
      </main>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await axios.get<ApiResponse>('');
  const apiResponse = res.data.data[res.data.data.length - 2];
  return {
    props: {
      ...apiResponse,
      hourGraphDataList: getHourGraphDataList(apiResponse.graphDataList),
    },
  };
};

const getHourGraphDataList = (minuteGraphDataList: PageProps['graphDataList']): PageProps['graphDataList'] | false => {
  if (minuteGraphDataList.length < 60) return false;

  const hourCount = minuteGraphDataList.length / 60;
  const hourGraphDataList = new Array(hourCount).map<PageProps['graphDataList'][number]>((_, i) => {
    return {
      blinkTotal:
        minuteGraphDataList.slice(i, hourCount * (i + 1)).reduce((prev, current) => prev + current.blinkTotal, 0) / 60,
      humidity:
        minuteGraphDataList.slice(i, hourCount * (i + 1)).reduce((prev, current) => prev + current.humidity, 0) / 60,
    };
  });
  return hourGraphDataList;
};
