import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-pdf-test',
  templateUrl: './pdf-test.component.html',
  styleUrls: ['./pdf-test.component.css']
})
export class PdfTestComponent implements OnInit {

  selectedFile: File | null = null;
  uploadProgress = 0;
  questions: any[] = [];
  query = '';
  reply = '';
  isLoading = false;
  constructor(private http: HttpClient, private _apiService: ApiService) { }

  ngOnInit(): void {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    this.isLoading = true;
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post<any>('http://localhost:3000/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress && event.total) {
        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
      } else if (event.type === HttpEventType.Response) {
        console.log(event.body.questions)
        this.questions = event.body.questions;
        this.isLoading = false;
      }
    });
  }

}
