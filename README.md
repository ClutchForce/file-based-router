# Remote Image Viewer

This Node.js application facilitates client-server communication to remotely view images. The server manages image requests and sends image data back to clients, which then display the images using their default image viewer.

## 📖 Description

The purpose of this application is to demonstrate the capabilities of socket programming within the Node.js environment, specifically focusing on asynchronous handling of client requests for images. The server provides an image upon request, and the client displays this image using the default system image viewer.

## ✨ Features

- **Asynchronous Server**: Handles multiple client requests simultaneously without blocking.
- **Custom Protocol Implementation**: Utilizes a custom Image Transport Protocol (ITP) for image delivery.
- **Dynamic Image Loading**: Server dynamically loads and sends images based on client requests.
- **Real-Time Client-Server Interaction**: Clients can request images in real-time, and the server responds immediately.

## 🛠 Install Guide

Before starting, ensure Node.js is installed on your system. Node.js can be downloaded from [Node.js official website](http://nodejs.org/).

### Required Packages

After installing Node.js, some third-party modules are required:

```
npm install open --save
```

This command installs the `open` package, which is used to open files with the default application on your system.

## 🔧 Set Up and Run

### Server Setup

1. **Clone the Repository**: Get the source code on your machine.
   ```
   git clone <repository-url>
   ```
2. **Navigate to the Server Directory**: Change directory to the server folder.
   ```
   cd path/to/server
   ```
3. **Start the Server**: Run the server using Node.js.
   ```
   node ImageDB.js
   ```
   Note the IP and port displayed in the console for client connections.

### Client Setup

1. **Navigate to the Client Directory**: Change directory to the client folder.
   ```
   cd path/to/client
   ```
2. **Run the Client**: Use the following command to request an image from the server.
   ```
   node GetImage -s <serverIP>:<port> -q <image name> -v 9
   ```

   Replace `<serverIP>:<port>` with the actual server IP and port, and `<image name>` with the name of the image you wish to retrieve.

## 📝 Conclusion

This application serves as a practical example of how Node.js can be utilized for networked applications involving client-server interactions. It demonstrates the handling of real-time data exchange and provides a foundation for more complex applications involving streaming data and asynchronous communications.

### Further Development

Future improvements could include the implementation of more sophisticated image handling capabilities, support for different file types, and enhanced security features for network communication.
