//Client/GetImage.js
let net = require("net");
let fs = require("fs");
let open = require("open");
let ITPpacket = require("./ITPRequest"); // uncomment this line after you run npm install command
const Singleton = require("../Server/Singleton");

// Parse command line arguments
function parseArgs() {
  let args = process.argv.slice(2);
  let params = {};
  for (let i = 0; i < args.length; i += 2) {
    params[args[i].substring(1)] = args[i + 1];
  }
  return params;
}

// Extract the command line arguments
const args = parseArgs();
const server = args.s.split(':');
const HOST = server[0];
const PORT = parseInt(server[1]);
const imageName = args.q;
const imageType = getImageType(imageName);
const version = parseInt(args.v);

// Initialize the ITPRequest with the parsed arguments
ITPpacket.init(version, 0, Math.floor(Math.random() * Math.pow(2, 26)) , imageType, imageName.split('.')[0]);

// Connect to the server and send the ITP request packet
let client = new net.Socket();
client.connect(PORT, HOST, function () {
  console.log('Connected to ImageDB server on ' + HOST + ':' + PORT);
  let packet = ITPpacket.getBytePacket();
  client.write(packet);
});

client.on('data', function (data) {
  //console.log(`Data received: ${data.length} bytes`); // This should be more than 12 if image data is included.

  // Print received packet in bits format
  console.log('\nITP packet header received:');
  let headerData = Buffer.alloc(12); // Allocate a new Buffer for the header
  data.copy(headerData, 0, 0, 12); // Copy the first 12 bytes of data into headerData
  printPacketBit(headerData); // Print only the header

  // Parse the response packet using helper functions
  let responseVersion = parseBitPacket(headerData, 0, 4);
  let responseType = parseBitPacket(headerData, 4, 2);
  let sequenceNumber = parseBitPacket(headerData, 6, 26);
  let timestamp = parseBitPacket(headerData, 32, 32);


  console.log(`\nServer sent:
\t--ITP version = ${responseVersion}
\t--Response Type = ${responseType === 1 ? 'Found' : responseType === 2 ? 'Not found' : 'Busy'}
\t--Sequence Number = ${sequenceNumber}
\t--Timestamp = ${timestamp}`);


  // Extract and save the image data
  let imageData = Buffer.alloc(data.length - 12); // Allocate a new Buffer for the image data
  data.copy(imageData, 0, 12); // Copy the image data from the original buffer
  
  //console.log(`IMAGE DATA Length: ${imageData.length}`); // Should not be 0

  // Save the image to a file and open it
  fs.writeFileSync(imageName, imageData);
  (async () => {
    await open(imageName, {wait: true }); // Open the image
    process.exit(1); // Exit the process

  })( );
  //open(imageName);

  client.end(); // Close the connection after receiving the data


});


client.on('close', function () {
  console.log('\nDisconnected from the server\nConnection closed\n');
  process.exit(1); // Exit the process here

});


// Utility functions (implementation needed)
function getImageType(imageName) {
  let extension = imageName.split('.').pop();
  let types = { 'png': 1, 'bmp': 2, 'tiff': 3, 'jpeg': 4, 'gif': 5, 'raw': 15 };
  return types[extension.toLowerCase()] || 0;
}

//// Some usefull methods ////
// Feel free to use them, but DO NOT change or add any code in these methods.

// Returns the integer value of the extracted bits fragment for a given packet
function parseBitPacket(packet, offset, length) {
  let number = "";
  for (var i = 0; i < length; i++) {
    // let us get the actual byte position of the offset
    let bytePosition = Math.floor((offset + i) / 8);
    let bitPosition = 7 - ((offset + i) % 8);
    let bit = (packet[bytePosition] >> bitPosition) % 2;
    number = (number << 1) | bit;
  }
  return number;
}

// Prints the entire packet in bits format
function printPacketBit(packet) {
  var bitString = "";

  for (var i = 0; i < packet.length; i++) {
    // To add leading zeros
    var b = "00000000" + packet[i].toString(2);
    // To print 4 bytes per line
    if (i > 0 && i % 4 === 0) bitString += "\n";
    bitString += " " + b.slice(-8);
  }
  console.log(bitString);
}



//Run node GetImage -s 127.0.0.1:3000 -q [imgName].[imgType] -v 9 to start the client