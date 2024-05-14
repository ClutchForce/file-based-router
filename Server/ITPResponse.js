//Server/ITPResponse.js
// You may need to add some statements here

module.exports = {

    init: function (sequenceNumber, version, responseType, timestamp, imageSize) {
        this.sequenceNumber = sequenceNumber;
        this.version = version;
        this.responseType = responseType;
        this.timestamp = timestamp;
        this.imageSize = imageSize;
    },

    //--------------------------
    //getpacket: returns the entire packet
    //--------------------------
    getPacket: function () {
        let header = Buffer.alloc(12);
        //print size of image
        //console.log("Image size: " + this.imageSize);
        
        storeBitPacket(header, this.version, 0, 4);
        storeBitPacket(header, this.responseType, 4, 2);
        storeBitPacket(header, this.sequenceNumber, 6, 26);
        storeBitPacket(header, this.timestamp, 32, 32);
        storeBitPacket(header, this.imageSize, 64, 32);

        return header;
      }
};

//// Some usefull methods ////
// Feel free to use them, but DO NOT change or add any code in these methods.

// Store integer value into specific bit poistion the packet
function storeBitPacket(packet, value, offset, length) {
    // let us get the actual byte position of the offset
    let lastBitPosition = offset + length - 1;

    let number = value.toString(2);
    let j = number.length - 1;
    for (var i = 0; i < number.length; i++) {
        let bytePosition = Math.floor(lastBitPosition / 8);
        let bitPosition = 7 - (lastBitPosition % 8);
        if (number.charAt(j--) == "0") {
            packet[bytePosition] &= ~(1 << bitPosition);
        } else {
            packet[bytePosition] |= 1 << bitPosition;
        }
        lastBitPosition--;
    }
}