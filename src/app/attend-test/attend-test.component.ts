import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attend-test',
  templateUrl: './attend-test.component.html',
  styleUrls: ['./attend-test.component.css']
})
export class AttendTestComponent implements OnInit {
  listTest:any;
  questions:any;
  testId: string | null = null;
  title:any;
  constructor(private _apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.testId = this.route.snapshot.queryParamMap.get('id');
    this._apiService.getAllTests().subscribe((res)=>{
      this.listTest= res;
      this.questions = this.listTest.filter((val:any)=>val._id === this.testId);
      console.log(this.questions);
      this.title = this.questions[0].title;
      this.questions = this.questions[0].questions;
      
    })
  }

}
