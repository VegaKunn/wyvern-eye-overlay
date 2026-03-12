import dgram from "dgram";

const CITRA_ADDRESS = "127.0.0.1";
const CITRA_PORT = 45987;
const CURRENT_REQUEST_VERSION = 1;
const RequestType = { ReadMemory: 1 };

const socket = dgram.createSocket("udp4");

function generateHeader(requestType, dataSize) {
  const requestId = Math.floor(Math.random() * 0xffffffff);
  const header = Buffer.alloc(16);
  header.writeUInt32LE(CURRENT_REQUEST_VERSION, 0);
  header.writeUInt32LE(requestId, 4);
  header.writeUInt32LE(requestType, 8);
  header.writeUInt32LE(dataSize, 12);
  return { header, requestId };
}

export async function readMemory(address, size) {
  return new Promise((resolve, reject) => {
    const { header, requestId } = generateHeader(RequestType.ReadMemory, 8);
    const data = Buffer.alloc(8);
    data.writeUInt32LE(address, 0);
    data.writeUInt32LE(size, 4);

    const packet = Buffer.concat([header, data]);

    const timeout = setTimeout(() => {
      socket.removeAllListeners("message");
      reject(new Error("Citra Timeout"));
    }, 1000);

    socket.once("message", (msg) => {
      clearTimeout(timeout);
      if (msg.length < 16) return reject(new Error("Resposta curta"));
      const replyId = msg.readUInt32LE(4);
      if (replyId !== requestId) return reject(new Error("ID trocado"));
      resolve(msg.slice(16));
    });

    socket.send(packet, CITRA_PORT, CITRA_ADDRESS);
  });
}
