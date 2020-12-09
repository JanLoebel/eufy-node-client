messages = {
  [0xf100] = "STUN request",
  [0xf101] = "STUN response",
  [0xf1d0] = "DATA",
  [0xf1d1] = "ACK",
  [0xf1e0] = "PING",
  [0xf1e1] = "PONG",
  [0xf1f0] = "Session END",

  -- Eufy specific ones
  [0xf126] = "LOOKUP_WITH_DSK request",
  [0xf130] = "LOCAL_LOOKUP request",
  [0xf121] = "LOOKUP response",
  [0xf140] = "LOOKUP_ADDR response",
  [0xf141] = "CHECK_CAM request / LOCAL_LOOKUP_RESP response",
  [0xf142] = "CAM_ID response",
}

dataTypes = {
  [0xd100] = "DATA",
  [0xd101] = "VIDEO",
  [0xd102] = "CONTROL",
  [0xd103] = "BINARY",
}

commandIds = {
  [1158] = "ARM_DELAY_AWAY",
  [1159] = "ARM_DELAY_CUS1",
  [1160] = "ARM_DELAY_CUS2",
  [1161] = "ARM_DELAY_CUS3",
  [1157] = "ARM_DELAY_HOME",
  [1278] = "AUTOMATION_DATA",
  [1165] = "AUTOMATION_ID_LIST",
  [1167] = "CMD_ALARM_DELAY_AWAY",
  [1168] = "CMD_ALARM_DELAY_CUSTOM1",
  [1169] = "CMD_ALARM_DELAY_CUSTOM2",
  [1170] = "CMD_ALARM_DELAY_CUSTOM3",
  [1166] = "CMD_ALARM_DELAY_HOME",
  [1017] = "CMD_AUDDEC_SWITCH",
  [1301] = "CMD_AUDIO_FRAME",
  [1049] = "CMD_BATCH_RECORD",
  [1702] = "CMD_BAT_DOORBELL_CHIME_SWITCH",
  [1703] = "CMD_BAT_DOORBELL_MECHANICAL_CHIME_SWITCH",
  [1706] = "CMD_BAT_DOORBELL_QUICK_RESPONSE",
  [1709] = "CMD_BAT_DOORBELL_SET_ELECTRONIC_RINGTONE_TIME",
  [1716] = "CMD_BAT_DOORBELL_SET_LED_ENABLE",
  [1710] = "CMD_BAT_DOORBELL_SET_NOTIFICATION_MODE",
  [1708] = "CMD_BAT_DOORBELL_SET_RINGTONE_VOLUME",
  [1707] = "CMD_BAT_DOORBELL_UPDATE_QUICK_RESPONSE",
  [1705] = "CMD_BAT_DOORBELL_VIDEO_QUALITY",
  [1704] = "CMD_BAT_DOORBELL_WDR_SWITCH",
  [1000] = "CMD_BIND_BROADCAST",
  [1001] = "CMD_BIND_SYNC_ACCOUNT_INFO",
  [1054] = "CMD_BIND_SYNC_ACCOUNT_INFO_EX",
  [1103] = "CMD_CAMERA_INFO",
  [1030] = "CMD_CHANGE_PWD",
  [1031] = "CMD_CHANGE_WIFI_PWD",
  [1018] = "CMD_CLOSE_AUDDEC",
  [1046] = "CMD_CLOSE_DEV_LED",
  [1016] = "CMD_CLOSE_EAS",
  [1014] = "CMD_CLOSE_IRCUT",
  [1012] = "CMD_CLOSE_PIR",
  [1047] = "CMD_COLLECT_RECORD",
  [1303] = "CMD_CONVERT_MP4_OK",
  [1048] = "CMD_DECOLLECT_RECORD",
  [1027] = "CMD_DELLETE_RECORD",
  [1234] = "CMD_DEL_FACE_PHOTO",
  [1232] = "CMD_DEL_USER_PHOTO",
  [1038] = "CMD_DEVS_BIND_BROADCASE",
  [1039] = "CMD_DEVS_BIND_NOTIFY",
  [1019] = "CMD_DEVS_LOCK",
  [1035] = "CMD_DEVS_SWITCH",
  [1037] = "CMD_DEVS_TO_FACTORY",
  [1040] = "CMD_DEVS_UNBIND",
  [1020] = "CMD_DEVS_UNLOCK",
  [1045] = "CMD_DEV_LED_SWITCH",
  [1252] = "CMD_DEV_PUSHMSG_MODE",
  [1251] = "CMD_DEV_RECORD_AUTOSTOP",
  [1250] = "CMD_DEV_RECORD_INTERVAL",
  [1249] = "CMD_DEV_RECORD_TIMEOUT",
  [1304] = "CMD_DOENLOAD_FINISH",
  [1701] = "CMD_DOORBELL_NOTIFY_PAYLOAD",
  [1700] = "CMD_DOORBELL_SET_PAYLOAD",
  [1506] = "CMD_DOOR_SENSOR_ALARM_ENABLE",
  [1503] = "CMD_DOOR_SENSOR_DOOR_EVT",
  [1505] = "CMD_DOOR_SENSOR_ENABLE_LED",
  [1502] = "CMD_DOOR_SENSOR_GET_DOOR_STATE",
  [1501] = "CMD_DOOR_SENSOR_GET_INFO",
  [1500] = "CMD_DOOR_SENSOR_INFO_REPORT",
  [1504] = "CMD_DOOR_SENSOR_LOW_POWER_REPORT",
  [1051] = "CMD_DOWNLOAD_CANCEL",
  [1024] = "CMD_DOWNLOAD_VIDEO",
  [1015] = "CMD_EAS_SWITCH",
  [1552] = "CMD_ENTRY_SENSOR_BAT_STATE",
  [1551] = "CMD_ENTRY_SENSOR_CHANGE_TIME",
  [1550] = "CMD_ENTRY_SENSOR_STATUS",
  [902] = "CMD_FLOODLIGHT_BROADCAST",
  [1029] = "CMD_FORMAT_SD",
  [1053] = "CMD_FORMAT_SD_PROGRESS",
  [1100] = "CMD_GATEWAYINFO",
  [1259] = "CMD_GEO_ADD_USER_INFO",
  [1261] = "CMD_GEO_DEL_USER_INFO",
  [1258] = "CMD_GEO_SET_USER_STATUS",
  [1262] = "CMD_GEO_UPDATE_LOC_SETTING",
  [1260] = "CMD_GEO_UPDATE_USER_INFO",
  [1122] = "CMD_GET_ADMIN_PWD",
  [1151] = "CMD_GET_ALARM_MODE",
  [1107] = "CMD_GET_ARMING_INFO",
  [1108] = "CMD_GET_ARMING_STATUS",
  [1109] = "CMD_GET_AUDDEC_INFO",
  [1110] = "CMD_GET_AUDDEC_SENSITIVITY",
  [1111] = "CMD_GET_AUDDE_CSTATUS",
  [1239] = "CMD_GET_AWAY_ACTION",
  [1101] = "CMD_GET_BATTERY",
  [1138] = "CMD_GET_BATTERY_TEMP",
  [1119] = "CMD_GET_CAMERA_LOCK",
  [1136] = "CMD_GET_CHARGE_STATUS",
  [1148] = "CMD_GET_CUSTOM1_ACTION",
  [1149] = "CMD_GET_CUSTOM2_ACTION",
  [1150] = "CMD_GET_CUSTOM3_ACTION",
  [1164] = "CMD_GET_DELAY_ALARM",
  [1152] = "CMD_GET_DEVICE_PING",
  [1129] = "CMD_GET_DEVS_NAME",
  [1274] = "CMD_GET_DEVS_RSSI_LIST",
  [1131] = "CMD_GET_DEV_STATUS",
  [1127] = "CMD_GET_DEV_TONE_INFO",
  [1134] = "CMD_GET_DEV_UPGRADE",
  [1118] = "CMD_GET_EAS_STATUS",
  [1124] = "CMD_GET_EXCEPTION_LOG",
  [1405] = "CMD_GET_FLOODLIGHT_WIFI_LIST",
  [1120] = "CMD_GET_GATEWAY_LOCK",
  [1225] = "CMD_GET_HOME_ACTION",
  [1176] = "CMD_GET_HUB_LAN_IP",
  [1132] = "CMD_GET_HUB_LOG",
  [1140] = "CMD_GET_HUB_LOGIG",
  [1128] = "CMD_GET_HUB_NAME",
  [1137] = "CMD_GET_HUB_POWWER_SUPPLY",
  [1126] = "CMD_GET_HUB_TONE_INFO",
  [1133] = "CMD_GET_HUB_UPGRADE",
  [1114] = "CMD_GET_IRCUTSENSITIVITY",
  [1113] = "CMD_GET_IRMODE",
  [1105] = "CMD_GET_MDETECT_PARAM",
  [1112] = "CMD_GET_MIRRORMODE",
  [1125] = "CMD_GET_NEWVESION",
  [1177] = "CMD_GET_OFF_ACTION",
  [1130] = "CMD_GET_P2P_CONN_STATUS",
  [1116] = "CMD_GET_PIRCTRL",
  [1115] = "CMD_GET_PIRINFO",
  [1117] = "CMD_GET_PIRSENSITIVITY",
  [1104] = "CMD_GET_RECORD_TIME",
  [1270] = "CMD_GET_REPEATER_CONN_TEST_RESULT",
  [1266] = "CMD_GET_REPEATER_RSSI",
  [1263] = "CMD_GET_REPEATER_SITE_LIST",
  [1163] = "CMD_GET_START_HOMEKIT",
  [1141] = "CMD_GET_SUB1G_RSSI",
  [1143] = "CMD_GET_TFCARD_FORMAT_STATUS",
  [1153] = "CMD_GET_TFCARD_REPAIR_STATUS",
  [1135] = "CMD_GET_TFCARD_STATUS",
  [1121] = "CMD_GET_UPDATE_STATUS",
  [1043] = "CMD_GET_UPGRADE_RESULT",
  [1268] = "CMD_GET_WAN_LINK_STATUS",
  [1265] = "CMD_GET_WAN_MODE",
  [1123] = "CMD_GET_WIFI_PWD",
  [1142] = "CMD_GET_WIFI_RSSI",
  [1281] = "CMD_HUB_ALARM_TONE",
  [1800] = "CMD_HUB_CLEAR_EMMC_VOLUME",
  [1282] = "CMD_HUB_NOTIFY_ALARM",
  [1283] = "CMD_HUB_NOTIFY_MODE",
  [1034] = "CMD_HUB_REBOOT",
  [1036] = "CMD_HUB_TO_FACTORY",
  [1013] = "CMD_IRCUT_SWITCH",
  [1653] = "CMD_KEYPAD_BATTERY_CAP_STATE",
  [1655] = "CMD_KEYPAD_BATTERY_CHARGER_STATE",
  [1654] = "CMD_KEYPAD_BATTERY_TEMP_STATE",
  [1657] = "CMD_KEYPAD_GET_PASSWORD",
  [1662] = "CMD_KEYPAD_GET_PASSWORD_LIST",
  [1670] = "CMD_KEYPAD_IS_PSW_SET",
  [1664] = "CMD_KEYPAD_PSW_OPEN",
  [1660] = "CMD_KEYPAD_SET_CUSTOM_MAP",
  [1650] = "CMD_KEYPAD_SET_PASSWORD",
  [1172] = "CMD_LEAVING_DELAY_AWAY",
  [1173] = "CMD_LEAVING_DELAY_CUSTOM1",
  [1174] = "CMD_LEAVING_DELAY_CUSTOM2",
  [1175] = "CMD_LEAVING_DELAY_CUSTOM3",
  [1171] = "CMD_LEAVING_DELAY_HOME",
  [1056] = "CMD_LIVEVIEW_LED_SWITCH",
  [1106] = "CMD_MDETECTINFO",
  [1601] = "CMD_MOTION_SENSOR_BAT_STATE",
  [1607] = "CMD_MOTION_SENSOR_ENABLE_LED",
  [1613] = "CMD_MOTION_SENSOR_ENTER_USER_TEST_MODE",
  [1610] = "CMD_MOTION_SENSOR_EXIT_USER_TEST_MODE",
  [1605] = "CMD_MOTION_SENSOR_PIR_EVT",
  [1611] = "CMD_MOTION_SENSOR_SET_CHIRP_TONE",
  [1609] = "CMD_MOTION_SENSOR_SET_PIR_SENSITIVITY",
  [1612] = "CMD_MOTION_SENSOR_WORK_MODE",
  [1145] = "CMD_NAS_SWITCH",
  [1146] = "CMD_NAS_TEST",
  [1351] = "CMD_NOTIFY_PAYLOAD",
  [1044] = "CMD_P2P_DISCONNECT",
  [1139] = "CMD_PING",
  [1011] = "CMD_PIR_SWITCH",
  [1041] = "CMD_RECORDDATE_SEARCH",
  [1042] = "CMD_RECORDLIST_SEARCH",
  [1366] = "CMD_RECORD_AUDIO_SWITCH",
  [1021] = "CMD_RECORD_IMG",
  [1022] = "CMD_RECORD_IMG_STOP",
  [1026] = "CMD_RECORD_PLAY_CTRL",
  [1025] = "CMD_RECORD_VIEW",
  [1058] = "CMD_REPAIR_PROGRESS",
  [1057] = "CMD_REPAIR_SD",
  [1269] = "CMD_REPEATER_RSSI_TEST",
  [1102] = "CMD_SDINFO",
  [1144] = "CMD_SDINFO_EX",
  [1507] = "CMD_SENSOR_SET_CHIRP_TONE",
  [1508] = "CMD_SENSOR_SET_CHIRP_VOLUME",
  [1242] = "CMD_SET_AI_NICKNAME",
  [1231] = "CMD_SET_AI_PHOTO",
  [1236] = "CMD_SET_AI_SWITCH",
  [1255] = "CMD_SET_ALL_ACTION",
  [1224] = "CMD_SET_ARMING",
  [1211] = "CMD_SET_ARMING_SCHEDULE",
  [1237] = "CMD_SET_AS_SERVER",
  [1212] = "CMD_SET_AUDDEC_INFO",
  [1213] = "CMD_SET_AUDDEC_SENSITIVITY",
  [1227] = "CMD_SET_AUDIOSENSITIVITY",
  [1367] = "CMD_SET_AUTO_DELETE_RECORD",
  [1206] = "CMD_SET_BITRATE",
  [1256] = "CMD_SET_CUSTOM_MODE",
  [1217] = "CMD_SET_DEVS_NAME",
  [1214] = "CMD_SET_DEVS_OSD",
  [1202] = "CMD_SET_DEVS_TONE_FILE",
  [1273] = "CMD_SET_DEV_MD_RECORD",
  [1240] = "CMD_SET_DEV_MIC_MUTE",
  [1229] = "CMD_SET_DEV_MIC_VOLUME",
  [1241] = "CMD_SET_DEV_SPEAKER_MUTE",
  [1230] = "CMD_SET_DEV_SPEAKER_VOLUME",
  [1228] = "CMD_SET_DEV_STORAGE_TYPE",
  [1401] = "CMD_SET_FLOODLIGHT_BRIGHT_VALUE",
  [1407] = "CMD_SET_FLOODLIGHT_DETECTION_AREA",
  [1404] = "CMD_SET_FLOODLIGHT_LIGHT_SCHEDULE",
  [1400] = "CMD_SET_FLOODLIGHT_MANUAL_SWITCH",
  [1402] = "CMD_SET_FLOODLIGHT_STREET_LAMP",
  [1403] = "CMD_SET_FLOODLIGHT_TOTAL_SWITCH",
  [1406] = "CMD_SET_FLOODLIGHT_WIFI_CONNECT",
  [1226] = "CMD_SET_GSSENSITIVITY",
  [1280] = "CMD_SET_HUB_ALARM_AUTO_END",
  [1279] = "CMD_SET_HUB_ALARM_CLOSE",
  [1222] = "CMD_SET_HUB_AUDEC_STATUS",
  [1220] = "CMD_SET_HUB_GS_STATUS",
  [1219] = "CMD_SET_HUB_IRCUT_STATUS",
  [1221] = "CMD_SET_HUB_MVDEC_STATUS",
  [1216] = "CMD_SET_HUB_NAME",
  [1253] = "CMD_SET_HUB_OSD",
  [1218] = "CMD_SET_HUB_PIR_STATUS",
  [1235] = "CMD_SET_HUB_SPK_VOLUME",
  [1208] = "CMD_SET_IRMODE",
  [1254] = "CMD_SET_JSON_SCHEDULE",
  [1200] = "CMD_SET_LANGUAGE",
  [1412] = "CMD_SET_LIGHT_CTRL_BRIGHT_PIR",
  [1413] = "CMD_SET_LIGHT_CTRL_BRIGHT_SCH",
  [1410] = "CMD_SET_LIGHT_CTRL_LAMP_VALUE",
  [1408] = "CMD_SET_LIGHT_CTRL_PIR_SWITCH",
  [1409] = "CMD_SET_LIGHT_CTRL_PIR_TIME",
  [1415] = "CMD_SET_LIGHT_CTRL_SUNRISE_INFO",
  [1414] = "CMD_SET_LIGHT_CTRL_SUNRISE_SWITCH",
  [1411] = "CMD_SET_LIGHT_CTRL_TRIGGER",
  [1204] = "CMD_SET_MDETECTPARAM",
  [1272] = "CMD_SET_MDSENSITIVITY",
  [1207] = "CMD_SET_MIRRORMODE",
  [1276] = "CMD_SET_MOTION_SENSITIVITY",
  [1277] = "CMD_SET_NIGHT_VISION_TYPE",
  [1248] = "CMD_SET_NOTFACE_PUSHMSG",
  [1350] = "CMD_SET_PAYLOAD",
  [1210] = "CMD_SET_PIRSENSITIVITY",
  [1209] = "CMD_SET_PIR_INFO",
  [1246] = "CMD_SET_PIR_POWERMODE",
  [1243] = "CMD_SET_PIR_TEST_MODE",
  [1233] = "CMD_SET_PRI_ACTION",
  [1203] = "CMD_SET_RECORDTIME",
  [1264] = "CMD_SET_REPEATER_PARAMS",
  [1205] = "CMD_SET_RESOLUTION",
  [1257] = "CMD_SET_SCHEDULE_DEFAULT",
  [1271] = "CMD_SET_SNOOZE_MODE",
  [1223] = "CMD_SET_STORGE_TYPE",
  [1247] = "CMD_SET_TELNET",
  [1215] = "CMD_SET_TIMEZONE",
  [1201] = "CMD_SET_TONE_FILE",
  [1238] = "CMD_SET_UPGRADE",
  [1028] = "CMD_SNAPSHOT",
  [1003] = "CMD_START_REALTIME_MEDIA",
  [1009] = "CMD_START_RECORD",
  [900] = "CMD_START_REC_BROADCASE",
  [1005] = "CMD_START_TALKBACK",
  [1007] = "CMD_START_VOICECALL",
  [1004] = "CMD_STOP_REALTIME_MEDIA",
  [1010] = "CMD_STOP_RECORD",
  [901] = "CMD_STOP_REC_BROADCASE",
  [1023] = "CMD_STOP_SHARE",
  [1006] = "CMD_STOP_TALKBACK",
  [1008] = "CMD_STOP_VOICECALL",
  [1302] = "CMD_STREAM_MSG",
  [1050] = "CMD_STRESS_TEST_OPER",
  [1033] = "CMD_TIME_SYCN",
  [1002] = "CMD_UNBIND_ACCOUNT",
  [1300] = "CMD_VIDEO_FRAME",
  [1032] = "CMD_WIFI_CONFIG",
  [1162] = "CMD_SWITCH_TIME",
  [6056] = "CMD_BATTERY_FALSE_EVENT_COUNT",
  [6024] = "CMD_INDOOR_AI_CRYING_ENABLE",
  [6023] = "CMD_INDOOR_AI_MOTION_ENABLE",
  [6022] = "CMD_INDOOR_AI_PERSON_ENABLE",
  [6026] = "CMD_INDOOR_AI_PET_ENABLE",
  [6025] = "CMD_INDOOR_AI_SOUND_ENABLE",
  [6013] = "CMD_INDOOR_CONTINUE_RECORD_SCHEDULE",
  [6042] = "CMD_INDOOR_DET_SET_ACTIVE_ZONE",
  [6040] = "CMD_INDOOR_DET_SET_MOTION_DETECT_ENABLE",
  [6045] = "CMD_INDOOR_DET_SET_MOTION_DETECT_TYPE",
  [6041] = "CMD_INDOOR_DET_SET_MOTION_SENSITIVITY_IDX",
  [6047] = "CMD_INDOOR_DET_SET_PET_ENABLE",
  [6048] = "CMD_INDOOR_DET_SET_PET_EXPEL_RESPONSOR",
  [6049] = "CMD_INDOOR_DET_SET_PET_EXPEL_RESP_IDX",
  [6043] = "CMD_INDOOR_DET_SET_SOUND_DETECT_ENABLE",
  [6046] = "CMD_INDOOR_DET_SET_SOUND_DETECT_TYPE",
  [6044] = "CMD_INDOOR_DET_SET_SOUND_SENSITIVITY_IDX",
  [6053] = "CMD_INDOOR_EVENT_COUNT",
  [6061] = "CMD_INDOOR_HK_ACTIVE_HOMEKIT",
  [6062] = "CMD_INDOOR_HK_GET_HK_BIND_STATUS",
  [6014] = "CMD_INDOOR_LED_SWITCH",
  [6050] = "CMD_INDOOR_NAS_STORAGE_TYPE",
  [6052] = "CMD_INDOOR_OWNER_STREAM_TYPE",
  [6017] = "CMD_INDOOR_PAN_CALIBRATION",
  [6016] = "CMD_INDOOR_PAN_MOTION_TRACK",
  [6015] = "CMD_INDOOR_PAN_SPEED",
  [6021] = "CMD_INDOOR_PUSH_JUMP_TYPE",
  [6020] = "CMD_INDOOR_PUSH_NOTIFY_TYPE",
  [6010] = "CMD_INDOOR_SET_CONTINUE_ENABLE",
  [6011] = "CMD_INDOOR_SET_CONTINUE_TYPE",
  [6012] = "CMD_INDOOR_SET_RECORD_AUDIO_ENABLE",
  [6054] = "CMD_INDOOR_SHOW_SDCARD",
  [6051] = "CMD_INDOOR_TFCARD_NAS_STATUS",
  [6072] = "CMD_IN_TEST_MODE",
  [1055] = "CMD_PLAY_BACK_EVENT_STOP",
  [6071] = "CMD_SET_DETECT_TYPE",
  [6070] = "CMD_SET_PIR_SENSITIVITY",
  [6001] = "CMD_SMARTLOCK_QUERY_BATTERY_LEVEL",
  [6000] = "CMD_SMARTLOCK_QUERY_STATUS",
  [2109] = "CMD_SUB1G_REP_BIND_FAILED",
  [2108] = "CMD_SUB1G_REP_CHARGE_STATE",
  [2110] = "CMD_SUB1G_REP_POWER_OFF",
  [2107] = "CMD_SUB1G_REP_RUNTIME_STATE",
  [2111] = "CMD_SUB1G_REP_UNPLUG_POWER_LINE",
}

-- helper method
local function has_value (tab, val)
  for index, value in ipairs(tab) do
      if value == val then
          return true
      end
  end
  return false
end

-- declare our protocol
eufySecurity_proto = Proto("eufySecurity", "Eufy Security")

-- declare fields
local F_fullnumtype = ProtoField.new("Full Numeric Type", "eufySecurity.fulltype", ftypes.UINT16, nil, base.DEC_HEX, nil, "Full Message Type (DEC_HEX)")
local F_numtype = ProtoField.new("Numeric Type", "eufySecurity.type", ftypes.UINT8, nil, base.DEC_HEX, nil, "Short Message Type (DEC_HEX)")
local F_strtype = ProtoField.new("Description", "eufySecurity.description", ftypes.STRING, nil, nil, nil, "Message Type Description (STRING)")
local F_known = ProtoField.new("Known type", "eufySecurity.known", ftypes.BOOLEAN, nil, nil, nil, "Message type is known (BOOLEAN)")
local F_paylen = ProtoField.new("Payload length", "eufySecurity.paylen", ftypes.UINT16, nil, base.DEC, nil, "Payload Length (DEC)")

-- extended fields for specific requests
local F_p2pDid = ProtoField.new("P2P DID", "eufySecurity.p2pdid", ftypes.STRING, nil, nil, nil, "TODO")
local F_p2pDsk = ProtoField.new("P2P DSK", "eufySecurity.p2pdsk", ftypes.STRING, nil, nil, nil, "TODO")
local F_p2pConInfo = ProtoField.new("P2P Conn Info", "eufySecurity.p2pConInfo", ftypes.STRING, nil, nil, nil, "TODO")
local F_p2pAddrPort = ProtoField.new("P2P Addr Port", "eufySecurity.p2pAddrPort", ftypes.UINT8, nil, nil, nil, "TODO")
local F_p2pAddrIp = ProtoField.new("P2P Addr Ip", "eufySecurity.p2pAddrIp", ftypes.STRING, nil, nil, nil, "TODO")
local F_p2pSeqNo = ProtoField.new("P2P SeqNo", "eufySecurity.p2pSeqNo", ftypes.UINT8, nil, nil, nil, "TODO")
local F_p2pDataType = ProtoField.new("P2P DataType", "eufySecurity.p2pDataType", ftypes.STRING, nil, nil, nil, "TODO")
local F_p2pDataCommandId = ProtoField.new("P2P Data Command Id", "eufySecurity.p2pCommandId", ftypes.STRING, nil, nil, nil, "TODO")
local F_p2pAckSeqNo = ProtoField.new("P2P Ack SeqNumbers", "eufySecurity.p2pAckSeqNos", ftypes.STRING, nil, nil, nil, "TODO")

-- add the fields to the protocol
-- (to confirm this worked, check that these fields appeared in the "Filter Expression" dialog)
eufySecurity_proto.fields = {
  F_fullnumtype,
  F_numtype,
  F_strtype,
  F_known,
  F_paylen,
  F_p2pDid,
  F_p2pDsk,
  F_p2pConInfo,
  F_p2pAddrPort,
  F_p2pAddrIp,
  F_p2pSeqNo,
  F_p2pDataType,
  F_p2pDataCommandId,
  F_p2pAckSeqNo
}

-- Cloud ips of eufy security
local cloudIps = {"54.223.148.206", "18.197.212.165", "13.251.222.7"}

function eufySecurity_proto.dissector(buffer, pinfo, tree)
  local srcIsCloud = has_value(cloudIps, tostring(pinfo.src))
  local dstIsCloud = has_value(cloudIps, tostring(pinfo.dst))
  -- local packets always start with "0xf1"
  if (buffer(0,1):uint() ~= 0xf1 and srcIsCloud == false and dstIsCloud == false) then
    -- lets wireshark know nothing was dissected
    return 0;
  end

  pinfo.cols.protocol = "eufySecurity"
  local full_type = buffer(0,2):uint()
  local num_type = buffer(1,1):uint()
  local known = false
  local str_type = "Unknown - " .. string.format("0x%x", full_type)

  if (messages[full_type]) then
    known = true
    str_type = messages[full_type]
  end
  pinfo.cols.info = str_type

  local payload_len = buffer(2,2):uint()
  local payload = buffer(4,payload_len)

  local subtree = tree:add(eufySecurity_proto,buffer(), "eufySecurity Protocol")

  subtree:add(F_fullnumtype, buffer(0,2), full_type)
  subtree:add(F_numtype, buffer(1,1), num_type)
  subtree:add(F_strtype, buffer(0,2), str_type)
  subtree:add(F_known, buffer(0,2), known)
  subtree:add(F_paylen, buffer(2,2), payload_len)

  -- specifc attributes depending on the message type
  -- TODO replace with bytes not strings!
  if (str_type == "CAM_ID response" or str_type == "LOOKUP_WITH_DSK request" or str_type == "CHECK_CAM request / LOCAL_LOOKUP_RESP response") then
    local p2pdid = buffer(4, 7):string() .. "-" .. buffer(14, 2):uint() .. "-" .. buffer(16, 6):string()
    subtree:add(F_p2pDid, buffer(4, 20), p2pdid)
  end

  if (str_type == "LOOKUP_WITH_DSK request") then
    local p2pConInfo = "Port: " .. buffer(26, 2):le_uint() .. " - IP: " .. buffer(28, 1):uint() .. "." .. buffer(29, 1):uint() .. "." .. buffer(30, 1):uint() .. "." .. buffer(31, 1):uint()
    subtree:add(F_p2pConInfo, buffer(28, 4), p2pConInfo)

    local p2pdsk = buffer(44, 20):string()
    subtree:add(F_p2pDsk, buffer(44, 20), p2pdsk)
  end

  if (str_type == "LOOKUP_ADDR response") then
    local p2pAddrPort = buffer(7, 1):uint() * 256 + buffer(6, 1):uint()
    subtree:add(F_p2pAddrPort, buffer(6, 2), p2pAddrPort)

    local p2pAddrIp = "" .. buffer(11, 1):uint() .. "." .. buffer(10, 1):uint() .. "." .. buffer(9, 1):uint() .. "." .. buffer(8, 1):uint()
    subtree:add(F_p2pAddrIp, buffer(8, 4), p2pAddrIp)
  end

  if (str_type == "ACK") then
    local seqNumbers = ""
    local p2pNumAcks = buffer(6, 2):uint()
    for i=1,p2pNumAcks do
      local idx = 6 + (i * 2)
      local seq = buffer(idx, 2):uint()
      seqNumbers = seqNumbers .. seq .. "; "
    end
    subtree:add(F_p2pAckSeqNo, buffer(6, (2 * p2pNumAcks) + 2), seqNumbers)
  end

  if (str_type == "DATA") then
    -- Seq No
    local p2pSeqNo = buffer(6, 1):uint() * 256 + buffer(7, 1):uint()
    subtree:add(F_p2pSeqNo, buffer(6, 2), p2pSeqNo)

    -- Data Type
    local p2pDataType = buffer(4, 2):uint()
    if (dataTypes[p2pDataType]) then
      subtree:add(F_p2pDataType, buffer(4, 2), dataTypes[p2pDataType])
      pinfo.cols.info:append(" - " ..  dataTypes[p2pDataType])
      
      local p2pMagicWord = buffer(8, 4):string()
      -- DATA information
      if (p2pMagicWord == "XZYH") and (dataTypes[p2pDataType] == "DATA" or dataTypes[p2pDataType] == "VIDEO") then
        -- Command Id
        local p2pDataCommandId = buffer(12, 2):le_uint()
        if (commandIds[p2pDataCommandId]) then
          subtree:add(F_p2pDataCommandId, buffer(12, 2), "" .. commandIds[p2pDataCommandId] .. " (" .. p2pDataCommandId .. ")")
          pinfo.cols.info:append(" - " .. commandIds[p2pDataCommandId])
        else
          subtree:add(F_p2pDataCommandId, buffer(12, 2), "Unknown: " .. p2pDataCommandId)
        end
      end
    else
      subtree:add(F_p2pDataType, buffer(4, 2), "Unknown DataType")
    end
  end
end

-- load the udp.port table
udp_table = DissectorTable.get("udp.port")
udp_table:add("20000-69999", eufySecurity_proto)
