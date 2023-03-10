import { useEffect, useState } from "react";
import media from "../styles/media";
import styled from "@emotion/styled";
import themes from "../constants/themes";
import { BASE_URI_BACK } from '../utils/config';
import { CryptoState } from "../provider/CryotoProvider";
import { IAssets } from "../models/types";
import { filterCoins } from '../api/config';
import { io } from "socket.io-client";
import { numberWithCommas } from "../helpers/helper";

const TrendingCard = () => {
  const [trending, setTrending] = useState<IAssets[]>([]);
  const { currency, symbol } = CryptoState();

  useEffect(() => {
    const socket = io(BASE_URI_BACK);
    socket.on('connect', () => console.log(socket.id));

    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on('assets', (data) => setTrending(data.filter(
      (coin: IAssets) => {
        for (const item in filterCoins) {
          if (coin.name.toLowerCase().includes(filterCoins[item].name))
            return true;
        }
        return false;
      })
    ));
  });

  return (
    <Container>
      <h3>Trending Coins</h3>
      <CardContainer>
        <div className='row'>
          {trending.map((data) => (
            <>
              <div className='card'>
                <div className='card-text'>
                  <ImgBox>
                    <img
                      width='50px'
                      height='50px'
                      src={`https://messari.io/asset-images/${data.id}/32.png?v=2`}
                      alt='coin pic'
                    />
                  </ImgBox>
                  <p>
                      <span>
                        {data.symbol.toLocaleUpperCase()}
                        &nbsp;
                        <span
                          style={{
                            color:
                              data.metrics.market_data.percent_change_usd_last_24_hours >= 0
                                ? 'rgb(14, 203, 129)'
                                : 'red',
                            fontWeight: 500,
                          }}
                        >
                          {data.metrics.market_data.percent_change_usd_last_24_hours >= 0 && '+'}
                          {data.metrics.market_data.percent_change_usd_last_24_hours.toFixed(2)}%
                        </span>
                        <br />
                      </span>
                    <span style={{ fontSize: 22, fontWeight: 500 }}>
                        {symbol}{' '}
                      {numberWithCommas(data.metrics.market_data.price_usd.toFixed(2))}
                      </span>
                  </p>
                </div>
              </div>
            </>
          ))}
        </div>
      </CardContainer>
    </Container>
  );
};

export default TrendingCard;

const Container = styled.div`
  margin-top: 2rem;
`;

const ImgBox = styled.div`
  padding: 1px;
  margin: auto;
`;

const CardContainer = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }

  ::-webkit-scrollbar {
    width: 0 !important;
  }

  .row {
    margin-top: 2rem;
    align-items: stretch;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 10px;
    justify-content: center;

    &::-webkit-scrollbar {
      display: none;
    }

    &::-webkit-scrollbar {
      width: 0 !important;
    }

    a {
      text-decoration: none;
    }
  }

  .card-loader {
    border-radius: 12px;
    background: ${themes.colors.lightGrey};
    color: ${themes.colors.black};
    border: 1px solid ${themes.colors.red};
    width: 300px;
    height: 150px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  ${media.mobile} {
    .card-loader {
      border-radius: 12px;
      background: ${themes.colors.lightGrey};
      color: ${themes.colors.black};
      border: 1px solid ${themes.colors.red};
      width: 200px;
      height: 200px;
      padding: 0.75rem;
      margin-bottom: 1rem;
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }

  .card {
    border-radius: 12px;
    background: ${themes.colors.black};
    color: ${themes.colors.white};
    width: 300px;
    height: 150px;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 0;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  ${media.mobile} {
    .card {
      border-radius: 12px;
      background: black;
      color: white;
      width: 200px;
      height: 200px;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border: 0;
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;
    }
  }

  .card-text {
    text-align: center;
  }
`;
