import http from "http";
import * as Y from "yjs";
import WSSharedDoc from "./WSSharedDoc";

const CALLBACK_URL = process.env.CALLBACK_URL
  ? new URL(process.env.CALLBACK_URL)
  : null;
const CALLBACK_TIMEOUT = parseInt(process.env.CALLBACK_TIMEOUT || "5000");
const CALLBACK_OBJECTS = process.env.CALLBACK_OBJECTS
  ? JSON.parse(process.env.CALLBACK_OBJECTS)
  : {};

export const isCallbackSet = !!CALLBACK_URL;

export const callbackHandler = (
  update: Uint8Array,
  origin: any,
  doc: WSSharedDoc
) => {
  const room = doc.name;
  const dataToSend = { room, data: {} };
  const sharedObjectList = Object.keys(CALLBACK_OBJECTS);
  sharedObjectList.forEach((sharedObjectName) => {
    const sharedObjectType = CALLBACK_OBJECTS[sharedObjectName];
    dataToSend.data[sharedObjectName] = {
      type: sharedObjectType,
      content: getContent(sharedObjectName, sharedObjectType, doc).toJSON(),
    };
  });
  callbackRequest(CALLBACK_URL, CALLBACK_TIMEOUT, dataToSend);
};

const callbackRequest = (url: URL, timeout: number, data: object) => {
  const _data = JSON.stringify(data);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    timeout,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": _data.length,
    },
  };

  const req = http.request(options);
  req.on("timeout", () => {
    console.warn("Callback request timed out.");
    req.abort();
  });
  req.on("error", (e) => {
    console.error("Callback request error.", e);
    req.abort();
  });
  req.write(_data);
  req.end();
};

const getContent = (
  objName: string,
  objType: string,
  doc: WSSharedDoc
): Y.AbstractType<any> => {
  switch (objType) {
    case "Array":
      return doc.getArray(objName);
    case "Map":
      return doc.getMap(objName);
    case "Text":
      return doc.getText(objName);
    case "XmlFragment":
      return doc.getXmlFragment(objName);
    // case "XmlElement":
    //   return doc.getXmlElement(objName);
    // default:
    //   return {};
  }
};
