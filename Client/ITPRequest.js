//Client/ITPRequest.js
// You may need to add some statements here

module.exports = {
  init: function (version, requestType, timestamp, imageType, imageName) {

    this.version = version;
    this.requestType = requestType;
    this.timestamp = timestamp;
    this.imageType = imageType;
    this.imageName = imageName;
    this.imageNameSize = stringToBytes(imageName).length;
  },

  //--------------------------
  //getBytePacket: returns the entire packet in bytes
  //--------------------------
  getBytePacket: function () {
    let packet = Buffer.alloc(12 + this.imageNameSize); // Header is 12 bytes, image name size is variable
    // Bit operations to set the fields correctly
    storeBitPacket(packet, this.version, 0, 4);
    storeBitPacket(packet, this.requestType, 30, 2);
    storeBitPacket(packet, this.timestamp, 32, 32);
    storeBitPacket(packet, this.imageType, 64, 4);
    storeBitPacket(packet, this.imageNameSize, 68, 28);
    packet.write(this.imageName, 12); // Image name directly after the header
    return packet;
  },
};

//// Some usefull methods ////
// Feel free to use them, but DO NOT change or add any code in these methods.

// Convert a given string to byte array
function stringToBytes(str) {
  var ch,
    st,
    re = [];
  for (var i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i); // get char
    st = []; // set up "stack"
    do {
      st.push(ch & 0xff); // push byte to stack
      ch = ch >> 8; // shift value down by 1 byte
    } while (ch);
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat(st.reverse());
  }
  // return an array of bytes
  return re;
}

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
