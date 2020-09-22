export interface FCMEufyPushMessage {
  notification: {
    data: {
      device_sn: string;
      payload: string;
      station_sn: string;
      title: string;
      type: string;
      push_time: string;
      content: string;
      event_time: string;
    };

    from: string;
    priority: string;
  };

  persistentId: string;
}

export interface PushMessage {
  orgMsg: FCMEufyPushMessage;

  data: {
    device_sn: string;
    payload: Record<string, any>;
    station_sn: string;
    title: string;
    type: string;
    push_time: string;
    content: string;
    event_time: string;
  };
}
