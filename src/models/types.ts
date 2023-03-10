export interface IAssets {
  id: string;
  serial_id: number;
  symbol: string;
  name: string;
  slug: string;
  metrics: {
    market_data: {
      price_usd: number;
      percent_change_usd_last_24_hours: number;
    },
    marketcap: {
      current_marketcap_usd: number;
    }
  }
}
