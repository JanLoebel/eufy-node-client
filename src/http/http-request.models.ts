export interface HistoryRecordRequest {
  device_sn: string;
  end_time: number;
  id: number;
  num: number;
  offset: number;
  pullup: boolean;
  shared: boolean;
  start_time: number;
  storage: number;
}

export interface StreamRequest {
  device_sn: string;
  station_sn: string;
  proto?: number;
}
