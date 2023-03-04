import { Component, OnInit } from '@angular/core';
import { BlobServiceClient } from "@azure/storage-blob";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  selectedFile: any;
  blobToken ="?sp=racwdl&st=2023-03-04T00:27:22Z&se=2023-03-04T08:27:22Z&spr=https&sv=2021-12-02&sr=c&sig=TieDCaj0ioRfAeE3rBsElmKRBo097al6ftByE8I5Iw4%3D";
  blobUrl = "https://bgangularstorage.blob.core.windows.net";
  constructor() { }

  async uploadFile(file: File) {
    const blobServiceClient = new BlobServiceClient(`${this.blobUrl}${this.blobToken}`);
    const containerName = "filectr";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const response = await blockBlobClient.uploadData(file);
    console.log("File uploaded successfully!");
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
}
onSubmit(event: any) {
  event.preventDefault();
  if (this.selectedFile) {
      this.uploadFile(this.selectedFile)
      .catch((error) => {
        console.log("__________>" + JSON.stringify(error));

      });
  }
}

  ngOnInit(): void {
  }

}
