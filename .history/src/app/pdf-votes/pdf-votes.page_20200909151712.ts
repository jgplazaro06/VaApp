import { Component, OnInit } from '@angular/core';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';

import { DatePicker } from '@ionic-native/date-picker/ngx'
import { DatePipe } from '@angular/common'
import { Platform, NavController, LoadingController, Events, AlertController, IonRouterOutlet } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx'
import { FileOpener } from '@ionic-native/file-opener/ngx'

import pdfMake from 'pdfmake/build/pdfMake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
// import { table } from 'console';
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

  currentPage = 1;
  resultsPerPage = 10;
  totalPages = 10;
  resultTable = [];
  viewTable = [];
  options: any;
  load: any;
  today;
  constructor(
    private http: Http,
    private datePicker: DatePicker,
    private datePipe: DatePipe,
    private navCtrl: NavController,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController,
    private file: File,
    private fileOpener: FileOpener,
    private platform: Platform
  ) {
    this.today = new Date().toISOString();

    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    });

  }
  ngOnInit() {

  }

  ionViewDidEnter() {

  }
  retrieveNominees() {
    this.loadCtrl.create({
      spinner: "crescent",
      message: "Loading..."
    }).then(loader => {
      loader.present()
      this.load = loader;
    });

    // let body = `action=${encodeURIComponent("Nomination_ShowCandidates")}` +
    // 	`&title=${encodeURIComponent("AVP")}`;

    let body = new URLSearchParams();
    body.set('action', 'Nomination_ShowCandidates');
    body.set('title', 'AVP');

    this.http.post("http://vaservice.the-v.net/site.aspx",
      body,
      this.options)
      .subscribe(
        res => {
          let result = res.json();
          for (let element in result) {
            let holder;
            holder.fromJson(result[element])

            this.resultTable.push(holder);
          }
          console.log(this.resultTable)
        },
        err => {
          console.log(err);
        }
      );

    // body = `action=${encodeURIComponent("Nomination_ShowCandidates")}` +
    // 	`&title=${encodeURIComponent("VC")}`;
    body = new URLSearchParams();
    body.set('action', 'Nomination_ShowCandidates');
    body.set('title', 'VC');

    this.http.post("http://vaservice.the-v.net/site.aspx",
      body,
      this.options)
      .subscribe(
        res => {
          let result = res.json()
          for (let element in result) {
            let holder;
            holder.fromJson(result[element]);

            this.resultTable.push(holder);
          }
          // res.forEach(element => {
          // 	let holder: Nominee = new Nominee();
          // 	holder.fromJson(element);

          // 	this.vcs.push(holder);
          // });

          this.load.dismiss();
        },
        err => {
          console.log(err);
          this.load.dismiss();
        }
      );
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

    this.loadCtrl.create({
      spinner: "crescent",
      message: "Loading..."
    }).then(loader => {
      loader.present();

      this.initViewTable(fromDate, endDate).then(result => {
        this.resultTable = result;
        this.totalPages = Math.ceil((this.resultTable.length / this.resultsPerPage))
        this.generateTableView();
        console.log(result)
        loader.dismiss();
      })
      // this.http.get("http://localhost:8080/getVotes?dateFrom=" + fromDate + "&dateEnd=" + endDate
      //   // body,
      //   // this.options
      // ).subscribe(res => {
      //   let result = res.json()
      //   this.resultTable = result;

      //   this.totalPages = Math.ceil((this.resultTable.length / this.resultsPerPage))
      //   this.generateTableView();
      //   console.log(result)
      //   loader.dismiss();

      //   this.generatePDF(result)
      // }, error => {
      //   loader.dismiss();
      //   console.log(error)
      // })

    })

  }

  async initViewTable(fromDate, endDate) {
    this.resultTable = this.resultTable.filter(item => {
      console.log(item)
      console.log(item.CreatedOn >= fromDate)

      return item.CreatedOn >= fromDate &&
        item.CreatedOn <= endDate;
    })
    console.log(this.resultTable)
    return this.resultTable
  }

  generateTableView() {
    let startIndex = (this.currentPage * this.resultsPerPage) - this.resultsPerPage;
    let endIndex = (this.currentPage * this.resultsPerPage)
    this.viewTable = this.resultTable.slice(startIndex, endIndex)

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
        {
          text: 'Tallied Votes', style: 'header',

          table: {
            headerRows: 1,
            widths: ['10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],

            body: this.generateVoteTable(votes, Object.keys(votes[0]))
          }
        },

      ]
    }

    this.pdfSrc = pdfMake.createPdf(docdef)
    if (this.platform.is('cordova')) {
      //if mobile
      this.pdfSrc.getBuffer((buff) => {
        var utf8 = new Uint8Array(buff);
        var binaryArray = utf8.buffer;
        var blob = new Blob([binaryArray], { type: 'application/pdf' });

        this.file.writeFile(this.file.dataDirectory, 'VoteTally.pdf', blob, { replace: true }).then(resp => {
          this.fileOpener.open(this.file.dataDirectory + 'VoteTally.pdf', 'application/pdf');
        })
      })
    } else {
      this.pdfSrc.download();
    }
  }

  nextPage() {
    this.currentPage++;
    this.generateTableView()
  }

  previousPage() {
    this.currentPage--;
    this.generateTableView()

  }

  firstPage() {
    this.currentPage = 1;
    this.generateTableView()

  }

  lastPage() {
    this.currentPage = this.totalPages - 1;
    this.generateTableView()

  }
}
