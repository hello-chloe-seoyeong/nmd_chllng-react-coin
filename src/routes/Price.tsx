import { useOutletContext } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinHistory } from "../api";
import ReactApexChart from "react-apexcharts";

interface PriceProps {
  coinId: string;
}

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Price() {
  const { coinId } = useOutletContext<PriceProps>();
  const isDark = useRecoilValue(isDarkAtom);
  const { data, error, isLoading } = useQuery<IHistorical[]>({
    queryKey: ["ohlcv", coinId],
    queryFn: () => fetchCoinHistory(coinId),
  });
  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : (
        <>
          <ReactApexChart
            type="candlestick"
            height={350}
            options={{
              chart: {
                type: "candlestick",
              },
              theme: {
                mode: isDark ? "dark" : "light",
              },
              xaxis: {
                type: "datetime",
              },
            }}
            series={[
              {
                data:
                  data?.map((d) => ({
                    x: d.time_open,
                    y: [d.open, d.close, d.low, d.high],
                  })) ?? [],
              },
            ]}
          />
        </>
      )}
    </div>
  );
}

export default Price;
