import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-search-test',
  templateUrl: './search-test.component.html',
  styleUrls: ['./search-test.component.css']
})
export class SearchTestComponent implements OnInit {
  selectedFile: File | null = null;
  uploadProgress = 0;
  questions: any[] = [];
  query = '';
  reply = '';
  isLoading = false;
  testPrepare:boolean=false;
  readyToTest:boolean=false;
  testStart:boolean=false;
  takeYourTest:boolean=false;
  showGenerate:boolean=false;
  enableSolution:boolean=false;
  resultScore=0;
  constructor(private http: HttpClient, private _apiService: ApiService) { }

  ngOnInit(): void {
  }

  askAI() {
      if (!this.query) return;
      this.isLoading = true;
      this.reply = '...';
  
      this._apiService.sendQuery(this.query).subscribe(res => {
        console.log(res.reply);
        this.reply = res.reply;
        this.isLoading = false;
        this.showGenerate=true;
      });
    }

    startTest() {
      this.takeYourTest=true;
      this.showGenerate=false;
      this.isLoading = false;
      this.reply='';
    }
  
    generateTest() {
      if (!this.reply) {
        alert('No AI response to save.');
        return;
      }
      this.testPrepare=true;
      this.showGenerate=false;
      // 1. Generate PDF
      const pdf = new jsPDF();
      pdf.text('AI Response:', 10, 10);
      pdf.text(this.reply, 10, 20);
      const pdfBlob = pdf.output('blob');
  
      // 2. Upload PDF to Node.js
      const formData = new FormData();
      formData.append('file', pdfBlob, 'ai-response.pdf');
      
  
      this.http.post<any>('/upload', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.testPrepare=false;
          this.readyToTest=true;
          setTimeout(()=>{
            this.readyToTest=false;
            this.testStart=true;
          }, 2000)
          console.log(event.body.questions)
          this.questions = event.body.questions;
          if(this.questions[0].hasOwnProperty('error')) {
            this.generateTest();
          }
        }
      });
    }

    endTest() {
      this.enableSolution=true;
      this.questions.forEach((val)=>{
        if(val.answer === val.selectAnswer){
          this.resultScore++
        } 
      })
      console.log(this.resultScore)
      setTimeout(()=>{
        alert('Thank you for attending the test... we will back to search mode');
        this.isLoading = false;
        this.testPrepare=false;
        this.readyToTest=false;
        this.testStart=false;
        this.takeYourTest=false;
        this.showGenerate=false;
        this.enableSolution=false;
        this.query=''
      }, 10000)
    }

}
