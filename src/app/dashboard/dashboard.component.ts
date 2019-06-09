import { Component, OnInit } from '@angular/core';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    tiles: Tile[] = [
        { text: 'Hotels', cols: 3, rows: 1, color: 'lightblue' },
        { text: 'Sights', cols: 1, rows: 2, color: 'lightgreen' },
        { text: 'Restaurants', cols: 1, rows: 1, color: 'lightpink' },
        { text: 'Fun facts and legends', cols: 2, rows: 1, color: '#DDBDF1' },
    ];
    constructor() { }

    ngOnInit() {
    }

}
