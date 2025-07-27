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
  mobileNumber:any;
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

    this.http.post<any>('/upload', formData, {
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

  shareTest() {
    const message = `Hey! Check this out the Test link is comming soon`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/+91${this.mobileNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
    // let data = {
    //   numbers : `+91${this.mobileNumber}`,
    //   message: messages
    // }
    // this._apiService.sendMessage(data).subscribe((res)=>{
    //   alert(res);
    // })
  }

}
