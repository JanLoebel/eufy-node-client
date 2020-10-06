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
}

commandIds = {
  [1139] = "CMD_PING",
  [1103] = "CMD_CAMERA_INFO",
  [1350] = "CMD_SET_PAYLOAD",
  [1024] = "CMD_DOWNLOAD_VIDEO",
  [1025] = "CMD_RECORD_VIEW",
  [1026] = "CMD_RECORD_PLAY_CTRL",
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
local F_p2pDataMultiPart = ProtoField.new("P2P DataMultiPart", "eufySecurity.p2pDataMultiPart", ftypes.BOOLEAN, nil, nil, nil, "TODO")
local F_p2pDataMultiPartLastMsg = ProtoField.new("P2P DataMultiPart LastMsg", "eufySecurity.p2pDataMultiPart", ftypes.BOOLEAN, nil, nil, nil, "TODO")
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
  F_p2pDataMultiPart,
  F_p2pDataMultiPartLastMsg,
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

      -- DATA information
      if (dataTypes[p2pDataType] == "DATA") then
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

    -- Multipart message
    if (buffer(2, 2):uint() == 0x0404) then
      subtree:add(F_p2pDataMultiPart, buffer(2, 2), true)
    end

    -- Last Multipart message
    if (buffer(2, 1):uint() == 0x03) then
      subtree:add(F_p2pDataMultiPartLastMsg, buffer(2, 2), true)
    end

  end
end

-- load the udp.port table
udp_table = DissectorTable.get("udp.port")
udp_table:add("20000-69999", eufySecurity_proto)
