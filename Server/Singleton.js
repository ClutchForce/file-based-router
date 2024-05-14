//Server/Singleton.js
let sequenceNumber;
let timestamp;
let timer;
sequenceNumber = Math.floor(Math.random() * Math.pow(2, 26)); // Random initial sequence number
//initial the seq num
//console.log("sequenceNumber: " + sequenceNumber);
timestamp = Math.floor(Math.random() * 999) + 1; // Initialize between 1 and 999
//initial the timestamp
//console.log("timestamp: " + timestamp);

module.exports = {
    init: function () {

        //Callback function that Updates the timestamp value every 10 milliseconds
        // @since — v0.0.1
        // @param callback — The function to call when the timer elapses.
        // @param delay — The number of milliseconds to wait before calling the callback.
        // @param args — Optional arguments to pass when the callback is called.
        timer = setInterval(() => {
            timestamp = (timestamp + 1) % Math.pow(2, 32);
            //the binary rep of 2^32
        }, 10);
    },

    //--------------------------
    //getSequenceNumber: return the current sequence number + 1
    //--------------------------
    getSequenceNumber: function () {
        // Increments and returns the sequence number
        sequenceNumber = (sequenceNumber + 1) % Math.pow(2, 26);
        return parseInt(sequenceNumber);
    },

    //--------------------------
    //getTimestamp: return the current timer value as an integer
    //--------------------------
    getTimestamp: function () {
        //returns the timestamp as an integer
        return parseInt(timestamp);
    },

    // Add a cleanup function to clear the interval when the server shuts down
    cleanup: function () {
        clearInterval(timer);
    }
};
