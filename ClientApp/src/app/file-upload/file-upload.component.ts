import { Component, OnInit } from '@angular/core';
import {AzureStorageService, BLOBItem, CONTENT} from '../azure/azure.storage.service'

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
  inputEvent: any;


  constructor(private azureService: AzureStorageService) { }

  ngOnInit(): void {
     this.listFiles(this.selectedContainer);
  }

  async getContainers() {
    this.azureService.getContainers().then((res: Array<string>) => {
      this.containers = res;
    })
  }

  delete(value: string) {
    this.azureService.deleteBlob(this.selectedContainer, value).then((resp: string) => {
      this.listItems = this.listItems.filter(file => file.name !== value);
      console.log(resp);
    });
  }

  async listFiles(containerName: string) {
    this.selectedContainer = containerName;
    this.azureService.listBlobs(containerName).then((res: Array<BLOBItem>) => {
      this.listItems = res;
      console.log(res);
    })
  }

  deleteContainer(value: string) {
    this.azureService.deleteContainer(value).then((resp: string) => {
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
        this.azureService.uploadFile(content).then(() => {
          console.log("Success!");
        }).catch((e) => {
          console.log("Failed!" + e);
        })
      })
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.inputEvent = event;
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
      this.azureService.uploadFile(content).then(() => {
        console.log("Success!");
        let newItem = {name: content.filename} as BLOBItem;
        this.listItems.push(newItem);
        this.inputEvent.target.value = "";
      }).catch((e) => {
        console.log("Failed!" + e);
      })
    }
  }
}
