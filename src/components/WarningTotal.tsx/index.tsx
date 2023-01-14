import { PageProps } from 'pages';
import Styles from 'styles/warningTotal.module.scss';
export const WarningTotal = ({ date, warningTotal }: Pick<PageProps, 'date' | 'warningTotal'>) => (
  <div className={Styles.warningTotal}>
    <p>日付：{String(date)}</p>
    <p className={Styles.warningTotal__count}>
      <strong>警告回数：{warningTotal}</strong>
    </p>
  </div>
);
