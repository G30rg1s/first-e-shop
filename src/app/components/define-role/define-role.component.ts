import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-define-role',
  standalone: true,
  imports: [],
  templateUrl: './define-role.component.html',
  styleUrl: './define-role.component.css'
})
export class DefineRoleComponent implements OnInit {
  navigation : string;

 nextPage: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nextPage = params['nextPage'];
      console.log('Next Page:', this.nextPage);
 });
  }

  getNavigationLink(): string {
    return this.nextPage;
  }
}

    

    



