import { Injectable } from '@angular/core';
import { AppSettingsService } from '../services/app.settings.service';
import {
  BlobServiceClient,
  BlobItem
} from "@azure/storage-blob";

export interface BLOBItem extends BlobItem {
  url: string
};
export interface CONTENT {
  containerName: string; // desired container name
  file: File;  // file to upload
  filename: string; // filename as desired with path
}

@Injectable({
  providedIn: 'root'
})
export class AzureStorageService {

  constructor(private appSettingsService: AppSettingsService) { }

  account = this.appSettingsService.get("blobAccount");
  accountKey = this.appSettingsService.get("blobSas");
  accountReadOnlyKey = this.appSettingsService.get("blobSasReadOnly");
  blobUrl = `https://${this.account}.blob.core.windows.net/bgblob/BLOBNAME${this.accountReadOnlyKey}`;

  private blobServiceClient = new BlobServiceClient(`https://${this.account}.blob.core.windows.net${this.accountKey}`);

  async getContainers() {
    let containers = [];
    let iter = this.blobServiceClient.listContainers();
    let containerItem = await iter.next();
    while (!containerItem.done) {
      containers.push(containerItem.value.name);
      containerItem = await iter.next();
    }
    return containers;
  }

  async createContainer(containername:any) {
    const containerName = containername || `${new Date().getTime()}`;
    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    try {
      const createContainerResponse = await containerClient.create();
      return `Create container ${containerName} successfully ${createContainerResponse.requestId}`;
    }
    catch (err: any) {
      return {requestId: err.details.requestId, statusCode: err.statusCode, errorCode:err.details.errorCode}
    }
  }

  getBlobUrl(name: string) {
     return this.blobUrl.replace("BLOBNAME", name);
  }

  async listBlobs(containerName: string): Promise<BLOBItem[]> {
    try {
      const blobItems = [];
      const containerClient = this.blobServiceClient.getContainerClient(containerName);
      for await (const blob of containerClient.listBlobsFlat()) {
        let newItem = {...blob, url: this.getBlobUrl(blob.name) } as BLOBItem;
        blobItems.push(newItem);
      }
      return blobItems;

    } catch (error) {
      console.error(error);
      throw(error);
    }
  }

  async deleteBlob(containerName: string, filename:string){
    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    const deleteBlob = await blockBlobClient.delete();
    return `Deleted Blob ${filename} successfully ${deleteBlob.requestId}`;
  }

  async deleteContainer(containerName:string){
    const containerClient = this.blobServiceClient.getContainerClient(containerName);
    const deleteContainer = await containerClient.delete();
    return `Deleted Blob ${containerName} successfully ${deleteContainer.requestId}`;
  }

  async uploadFile(content: CONTENT) {
    const containerClient = this.blobServiceClient.getContainerClient(content.containerName);
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
}
