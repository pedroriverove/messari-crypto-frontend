import { useEffect, useState } from "react";
import Button from "../components/Button";
import ResourceItem, { ResourceItemWrapper } from "../components/ResourceItem";
import SubHeader from "../components/SubHeader";
import Table from "../components/Table";
import TrendingCard from "../components/TrendingCards";
import csvDownload from "json-to-csv-export"
import media from "../styles/media";
import styled from "@emotion/styled";
import themes from "../constants/themes";
import { BASE_URI_BACK } from '../utils/config';
import { CryptoState } from "../provider/CryotoProvider";
import { IAssets } from "../models/types";
import { filterCoins } from '../api/config';
import { io } from "socket.io-client";
import { numberWithCommas } from "../helpers/helper";

const HomePage = () => {
  const [coins, setCoins] = useState<IAssets[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { currency, symbol } = CryptoState();

  useEffect(() => {
    const socket = io(BASE_URI_BACK);
    socket.on('connect', () => console.log(socket.id));

    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 5000);
    });

    socket.on('assets', (data) => setCoins(data.filter(
      (coin: IAssets) => {
        for (const item in filterCoins) {
          if (coin.name.toLowerCase().includes(filterCoins[item].name))
            return true;
        }
      return false;
      })
    ));
  });

  const dataToConvert = {
    data: coins,
    filename: 'crypto',
    delimiter: ','
  }

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search),
    );
  };

  return (
    <>
      <div className='app'>
        <SubHeader />
        <TrendingCard />
        <InputEl>
          <input
            type='text'
            name='firstname'
            placeholder='Search for a crypto currency..'
            autoComplete='off'
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputEl>
        <Container>
          <StyledButton>
            <Button
              label="Download CSV"
              onClick={() => csvDownload(dataToConvert)}
              size="small"
              text="Download CSV"
              variant="secondary"
            >
              Download CSV
            </Button>
          </StyledButton>
          <StyledTable
            headings={[
              { content: 'Coin' },
              { content: 'Amount' },
              { content: '24h change' },
              { content: 'Market Cap' },
            ]}
          >
            {handleSearch()
              .slice((page - 1) * 10, (page - 1) * 10 + 10)
              .map((row) => (
                <Table.Row
                  key={row.id}
                >
                  <Table.Cell>
                    <div style={{ display: 'flex' }}>
                      <img
                        src={`https://messari.io/asset-images/${row.id}/32.png?v=2`}
                        alt={row.name}
                        height='40'
                        style={{ marginBottom: 10, marginRight: 5 }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      >
                        <span
                          style={{
                            textTransform: 'uppercase',
                            fontSize: 14,
                          }}
                        >
                          {row.symbol}
                        </span>
                        <span style={{ color: 'darkgrey' }}>{row.name}</span>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    {symbol} {numberWithCommas(row.metrics.market_data.price_usd.toFixed(2))}
                  </Table.Cell>
                  <Table.Cell
                    style={{
                      color:
                        row.metrics.market_data.percent_change_usd_last_24_hours >= 0
                          ? 'rgb(14, 203, 129)'
                          : 'red',
                      fontWeight: 500,
                    }}
                  >
                    {row.metrics.market_data.percent_change_usd_last_24_hours >= 0 && '+'}
                    {row.metrics.market_data.percent_change_usd_last_24_hours?.toFixed(2)}%
                  </Table.Cell>
                  <Table.Cell>
                    {symbol}{' '}
                    {numberWithCommas(row.metrics.marketcap.current_marketcap_usd.toString().slice(0, -6))}
                  </Table.Cell>
                </Table.Row>
              ))}
          </StyledTable>
          <ResourceItemWrapper>
            {handleSearch()
              .slice((page - 1) * 10, (page - 1) * 10 + 10)
              .map((row) => (
                <ResourceItem
                  key={row.id}
                  id={row.id}
                  imageUrl={`https://messari.io/asset-images/${row.id}/32.png?v=2`}
                  itemTitle={row.name}
                  subTitle={
                    <>
                      {symbol} {numberWithCommas(row.metrics.market_data.price_usd.toFixed(2))}
                    </>
                  }
                  description={
                    <div
                      style={{
                        color:
                          row.metrics.market_data.percent_change_usd_last_24_hours >= 0
                            ? 'rgb(14, 203, 129)'
                            : 'red',
                        fontWeight: 500,
                      }}
                    >
                      {' '}
                      {row.metrics.market_data.percent_change_usd_last_24_hours >= 0 && '+'}
                      {row.metrics.market_data.percent_change_usd_last_24_hours?.toFixed(2)}%
                    </div>
                  }
                />
              ))}
          </ResourceItemWrapper>
        </Container>
      </div>
    </>
  );
};

export default HomePage;

const Container = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const InputEl = styled.div`
    /* ${media.mobile} {
    display: none;
  } */

  input[type="text"] {
    width: 100%;
    padding: 14px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 2px solid ${themes.colors.grey};
    border-radius: 4px;
    box-sizing: border-box;
  }
`;

const StyledButton = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
  flex: 0 0 50%;
  display: flex;
  justify-content: flex-end;
`;

const StyledTable = styled(Table)`
  margin-top: 2rem;

  ${media.mobile} {
    display: none;
  }

  ${media.smallDesktop} {
    display: none;
  }

  table {
    min-width: 70rem;
  }
`;
