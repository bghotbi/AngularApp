import { Component, OnInit } from '@angular/core';
import { BlobServiceClient, AnonymousCredential, newPipeline } from "@azure/storage-blob";
import { getContainers, deleteContainer, createContainer, listBlobs, BLOBItem, CONTENT, uploadFile, deleteBlob } from '../azure/azure-storage';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {
  selectedFile: any;
  containers: any = [];
  selectedContainer: string = 'bgblob';
  listItems: BLOBItem[] = [];
  files: any= [];

  constructor() { }

  ngOnInit(): void {
     this.listFiles(this.selectedContainer);
  }

  async getContainers() {
    getContainers().then((res: Array<string>) => {
      this.containers = res;
    })
  }

  delete(value: string) {
    deleteBlob(this.selectedContainer, value).then((resp: string) => {
      this.listItems = this.listItems.filter(file => file.name !== value);
      console.log(resp);
    });
  }

  async listFiles(containerName: string) {
    this.selectedContainer = containerName;
    listBlobs(containerName).then((res: Array<BLOBItem>) => {
      this.listItems = res;
      console.log(res);
    })
  }

  deleteContainer(value: string) {
    deleteContainer(value).then((resp: string) => {
      console.log(resp);
    });
  }

  upload(file: any) {
    console.log(file.files.length);
    if (file.files.length > 0) {
      [...file.files].forEach((file: any) => {
        let content: CONTENT = {
          containerName: this.selectedContainer,
          file: file,
          filename: `temp-${Date.now()}.${file.name.split('.')[1]}`
        };
        uploadFile(content).then(() => {
          console.log("Success!");
        }).catch((e) => {
          console.log("Failed!" + e);
        })
      })
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(event: any) {
    console.log(this.selectedFile);
    event.preventDefault();
    if (this.selectedFile) {
      let content: CONTENT = {
        containerName: this.selectedContainer,
        file: this.selectedFile,
        filename: this.selectedFile.name
      };
      uploadFile(content).then(() => {
        console.log("Success!");
        let newItem = {name: content.filename} as BLOBItem;
        this.listItems.push(newItem);
      }).catch((e) => {
        console.log("Failed!" + e);
      })
    }
  }
}
