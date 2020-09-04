# eufy-node-client

Experiment to send/receive/control messages from eufy security. Currently I only have the doorbell with a station. My basic target is to be able to control the guard mode of the station and receive doorbell events if somebody is on the door.

Other repositories:
- [https://github.com/FuzzyMistborn/python-eufy-security](https://github.com/FuzzyMistborn/python-eufy-security)
- [https://github.com/fbertone/lib32100](https://github.com/fbertone/lib32100)

### Notes:
-> After sending Data like setting Guard Mode to Home, we get a control message only if the status was something else before. So Home -> Home is not returning any control packet.

### DATA
Example-Data-Packet: (Length: 152, DataType: DATA)

PacketType:   F1D0

PacketLength: 0098

DataType:     D100

SeqNo:        0000

XZYH-String:  585A 5948

C804 8400 0000 0100 FF00 0100 8CFF FFFF 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000

### Example messages:
- Guard Mode: Away with App __type: control__

F1D0 001C D102 0000 585A 5948 7F04 0800 0000 0100 FF00 0000 0000 0000 0000 0000

- Guard Mode: Home with App __type: control__

F1D0 001C D102 0001 585A 5948 7F04 0800 0000 0100 FF00 0000 0100 0000 0000 0000

- Guard Mode: Disarm with App __type: control__

F1D0 001C D102 0002 585A 5948 7F04 0800 0000 0100 FF00 0000 3F00 0000 0000 0000

- Guard Mode: Geofence with App __type: control__

F1D0 001C D102 0003 585A 5948 7F04 0800 0000 0100 FF00 0000 0100 0000 0000 0000s
