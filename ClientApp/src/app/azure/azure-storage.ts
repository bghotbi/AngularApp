
import {
  AnonymousCredential,
  BlobServiceClient,
  newPipeline,
  BlobItem
} from "@azure/storage-blob";

import { environment } from "src/environments/environment";
const account = environment.azure.blob.account;
const accountKey = environment.azure.blob.SAS;
// BlobClientServiceString
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net${accountKey}`);
const blobUrl = `https://${account}.blob.core.windows.net/bgblob/BLOBNAME${accountKey}`;

//BlobEndpoint=https://storagesample.blob.core.windows.net;
//SharedAccessSignature=sv=2015-04-05&amp;sr=b&amp;si=tutorial-policy-635959936145100803&amp;sig=9aCzs76n0E7y5BpEi2GvsSv433BZa22leDOZXX%2BXXIU%3D
// const pipeline = newPipeline (new AnonymousCredential(),{
//   retryOptions: { maxTries: 4 }, // Retry options
//   userAgentOptions: { userAgentPrefix: "AdvancedSample V1.0.0" }, // Customized telemetry string
//   keepAliveOptions: {
//       // Keep alive is enabled by default, disable keep alive by setting false
//       enable: false
//   }
//   });

// const blobServiceClient = new BlobServiceClient(environment.azure.blob.sasUrl,pipeline);


export interface BLOBItem extends BlobItem {
  url: string
};
export interface CONTENT {
  containerName: string; // desired container name
  file: File;  // file to upload
  filename: string; // filename as desired with path
}


export async function getContainers() {
  let containers = [];
  let iter = blobServiceClient.listContainers();
  let containerItem = await iter.next();
  while (!containerItem.done) {
    containers.push(containerItem.value.name);
    containerItem = await iter.next();
  }
  return containers;
}

export async function createContainer(containername:any) {
  const containerName = containername || `${new Date().getTime()}`;
  const containerClient = blobServiceClient.getContainerClient(containerName);
  try {
    const createContainerResponse = await containerClient.create();
    return `Create container ${containerName} successfully ${createContainerResponse.requestId}`;
  }
  catch (err: any) {
    return {requestId: err.details.requestId, statusCode: err.statusCode, errorCode:err.details.errorCode}
  }
}

function getBlobUrl(name: string) {
   return blobUrl.replace("BLOBNAME", name);
}

export async function listBlobs(containerName: string): Promise<BLOBItem[]> {
  try {
    const blobItems = [];
    const containerClient = blobServiceClient.getContainerClient(containerName);
    for await (const blob of containerClient.listBlobsFlat()) {
      let newItem = {...blob, url: getBlobUrl(blob.name) } as BLOBItem;
      blobItems.push(newItem);
    }
    return blobItems;

  } catch (error) {
    console.error(error);
    throw(error);
  }
}

export async function deleteBlob(containerName: string, filename:string){
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  const deleteBlob = await blockBlobClient.delete();
  return `Deleted Blob ${filename} successfully ${deleteBlob.requestId}`;
}

export async function deleteContainer(containerName:string){
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const deleteContainer = await containerClient.delete();
  return `Deleted Blob ${containerName} successfully ${deleteContainer.requestId}`;
}

export async function uploadFile(content: CONTENT) {
  const containerClient = blobServiceClient.getContainerClient(content.containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(content.filename);

  if(!containerClient.exists()){
        console.log("the container does not exit")
        await containerClient.create();
  }

  try {
    const uploadBlobResponse = await blockBlobClient.uploadBrowserData(content.file, {
      maxSingleShotSize: 4 * 1024 * 1024,
      blobHTTPHeaders: { blobContentType: content.file.type } // set mimetype
    });
    return `Upload block blob ${content.filename} successfully ${uploadBlobResponse.requestId}`;
  }
  catch(e)
  {
    console.log(e);
    return "error!"
  }
}



