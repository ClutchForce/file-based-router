//Server/ClientsHandler.js
let ITPpacket = require('./ITPResponse');
let singleton = require('./Singleton');
let path = require('path');  
let fs = require('fs');      

module.exports = {
    handleClientJoining: function (sock) {
        console.log(`\nClient-${singleton.getSequenceNumber()} is connected at timestamp: ${singleton.getTimestamp()}`);

        sock.on('data', function (data) {
            // Parse the incoming packet
            let version = parseBitPacket(data, 0, 4);
            let timestamp = parseBitPacket(data, 32, 32);
            let imageType = parseBitPacket(data, 64, 4);
            let imageNameSize = parseBitPacket(data, 68, 28);
            let imageName = data.slice(12, 12 + imageNameSize).toString();

            // Log the received packet
            console.log("\nITP packet received:");
            printPacketBit(data);

            console.log(`\nClient-${sock.remotePort} requests:
\t --ITP version: ${version}
\t --Timestamp: ${timestamp}
\t --Request type: Query
\t --Image file extension(s): ${getExtensionFromImageType(imageType)}
\t --Image file name: ${imageName}`);

            // Additional code to attach image data to responsePacket should go here
            let imageNameWithExtension = imageName + "." + getExtensionFromImageType(imageType); // Construct image file name with extension

            // Construct the path to the image file
            let imagePath = path.join(__dirname, 'images', imageNameWithExtension);


            // Check if the image file exists and the current version is 9
            if (fs.existsSync(imagePath) && version === 9) {
                // Read the image file from the filesystem
                let image = fs.readFileSync(imagePath);

                // Initialize the ITPResponse with the correct values
                let sequenceNumber = singleton.getSequenceNumber(); // Get the next sequence number
                let responseType = 1; // 'Found'
                let imageSize = image.length;
                ITPpacket.init(sequenceNumber, version, responseType, singleton.getTimestamp(), imageSize);

                // Get the header packet
                let headerPacket = ITPpacket.getPacket();

                // Create a buffer that is the sum of the header packet and the image
                let responsePacket = Buffer.concat([headerPacket, image]);

                // Send the packet with the image data back to the client
                sock.write(responsePacket);
            } else {
                // Image not found, send 'Not found' response
                ITPpacket.init(singleton.getSequenceNumber(), version, 2, singleton.getTimestamp(), 0);
                let responsePacket = ITPpacket.getPacket();
                sock.write(responsePacket);
            }

            sock.end(); // Close the connection after sending the response
        });

        sock.on('close', function () {
            console.log(`Client-${sock.remotePort} closed the connection`);
        });
    }
};

// Add a helper function to map image types to file extensions
function getExtensionFromImageType(imageType) {
    const types = { 1: 'png', 2: 'bmp', 3: 'tiff', 4: 'jpeg', 5: 'gif', 15: 'raw' };
    return types[imageType] || 'unknown';
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
        //Please fix this to no longer use the depricated function substr
        if (i > 0 && i % 4 === 0) bitString += "\n";
        bitString += " " + b.slice(-8);
    }
    console.log(bitString);
}

// Converts byte array to string
function bytesToString(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += String.fromCharCode(array[i]);
    }
    return result;
}