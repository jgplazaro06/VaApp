import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { DatePicker } from '@ionic-native/date-picker/ngx'
import { DatePipe } from '@angular/common'
import { Platform, NavController, MenuController, Events, AlertController, IonRouterOutlet } from '@ionic/angular';

import pdfMake from 'pdfmake/build/pdfMake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-pdf-votes',
  templateUrl: './pdf-votes.page.html',
  styleUrls: ['./pdf-votes.page.scss'],
})
export class PdfVotesPage implements OnInit {

  pdfSrc = null;
  fromDate: string = '';
  endDate: string = '';
  today;
  constructor(
    private http: Http,
    private datePicker: DatePicker,
    private datePipe: DatePipe,
    private platform: Platform
  ) {
    this.today = new Date().toISOString();

  }

  ngOnInit() {
  }

  selectFromDate() {
    // var opts = {
    //   date: new Date(),
    //   mode: 'date',
    //   // androidTheme
    // }
    // let date = new Date();
    this.fromDate = this.datePipe.transform(this.fromDate, "yyyy-MM-dd")
    // this.fromDate = (new Date(this.fromDate)).toDateString();

    console.log(this.fromDate)

    // this.datePicker.show(opts).then((selectedDate) => {
    //   this.fromDate = this.datePipe.transform(selectedDate, "yyyy-MM-dd")
    //   console.log(this.fromDate + " 00:00:00")
    // })

  }

  selectEndDate() {
    // var opts = {
    //   date: new Date(),
    //   mode: 'date',
    //   // androidTheme
    // }
    // let date = new Date();
    this.endDate = this.datePipe.transform(this.endDate, "yyyy-MM-dd")
    // this.fromDate = (new Date(this.fromDate)).toDateString();

    console.log(this.endDate)

    // this.datePicker.show(opts).then((selectedDate) => {
    //   this.fromDate = this.datePipe.transform(selectedDate, "yyyy-MM-dd")
    //   console.log(this.fromDate + " 00:00:00")
    // })

  }

  getVotes() {
    let fromDate = this.fromDate + " 00:00:00";
    let endDate = this.endDate + " 00:00:00";

    console.log(fromDate)
    console.log(endDate)

    this.http.get("http://localhost:8080/getVotes?dateFrom=" + fromDate + "&dateEnd=" + endDate
      // body,
      // this.options
    ).subscribe(res => {
      let result = res.json()
      console.log(result)
      this.generatePDF(result)
    }, error => {
      console.log(error)
    })

  }

  generateVoteTable(data, cols) {
    var voteTable = [];

    voteTable.push(cols);

    data.forEach(function (rows) {
      let voteTableRow = [];

      cols.forEach(function (column) {
        voteTableRow.push(rows[column].toString())
      })
      voteTable.push(voteTableRow)
    })

    return (voteTable)
  }

  generatePDF(data) {
    console.log(data)
    let votes = data;

    var docdef = {
      content: [
        { text: 'Tallied Votes', style: 'header' },
        this.generateVoteTable(votes, Object.keys(votes[0]))
      ]
    }

    this.pdfSrc = pdfMake.createPdf(docdef)
    if (this.platform.is('cordova')) {
      //if mobile
    } else {
      this.pdfSrc.download();
    }
  }
}
