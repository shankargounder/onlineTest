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
  testTitle:any;
  mobileNumbers: string[] = []; // holds numbers per row

  listTest:any;
  constructor(private http: HttpClient, private _apiService: ApiService) { }

  ngOnInit(): void {
    this.getAllTest();
  }

  getAllTest() {
    this._apiService.getAllTests().subscribe((res)=>{
      this.listTest= res;
      this.mobileNumbers = new Array(this.listTest.length).fill('');
    })
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
        let Object  = {
          title: this.testTitle,
          questions : this.questions
        }
        this._apiService.createTest(Object).subscribe((res)=>{
          console.log(res);
          this.getAllTest();
        })
      }
    });
  }

  shareTest(id:any, index:any) {
    //const link = `http://localhost:4200/attend-test?id=${id}`;
    const link = `https://onlinetest-jhsq.onrender.com/attend-test?id=${id}`;
    const message = `Please click to attend the test: \n${link}`;
    const encodedMessage = encodeURIComponent(message);
    const number = this.mobileNumbers[index];
    const whatsappURL = `https://wa.me/+91${number}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
   
  }

}
