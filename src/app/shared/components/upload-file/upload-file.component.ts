import { Component, OnInit } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UploadFileService } from 'src/app/shared/services/upload-file';



@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})


export class UploadFileComponent implements OnInit {
  selectedFiles: FileList;
  currentFile: File;
  fileName: String;
  progress = 0;
  message = '';
  fileInfos: Observable<any>;


  constructor(private uploadService: UploadFileService) { 

  }


    

ngOnInit() {
  this.fileInfos = this.uploadService.getFiles();
}

selectFile(event) {
  this.selectedFiles = event.target.files;
  this.fileName = this.selectedFiles.item(0).name;
  
}

upload() {
  this.progress = 0;
  this.currentFile = this.selectedFiles.item(0);
  this.uploadService.upload(this.currentFile).subscribe(
    event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        this.message = event.body.message;
        this.fileInfos = this.uploadService.getFiles();
      }
    },
    err => {
      this.progress = 0;
      this.message = 'Could not upload the file!';
      this.currentFile = undefined;
    });
  this.selectedFiles = undefined;
}



}




