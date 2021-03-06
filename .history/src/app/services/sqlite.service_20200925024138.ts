import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Ambassador } from '../../models/ambassador.model';
import { Corporate } from '../../models/corporate.model';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  ///////PUT ALL SQL QUERIES HERE///////////
  private ambassadorQuery = `create table if not exists Ambassador(
		ID varchar(63),
		title varchar(63),
		position varchar(63),
		companytitle varchar(63),
		name varchar(127),
		irid varchar(15),
		team varchar(31),
		email varchar(127),
		contactnum varchar(31),
		imgUrl varchar(127),
		Status varchar(15),
		Rank varchar(31),
		NewDescription varchar(5000)
	);`;

  private corporateQuery = `create table if not exists Corporate(
		ID varchar(63),
		runningNum varchar(15),
		Title varchar(15),
		Name varchar(63),
		CompanyTitle varchar(63),
		ContactNumber varchar(31),
		Email varchar(127),
		Department varchar(15),
		Region varchar(63),
		Image varchar(127)
  );`;

  constructor(private sqlite: SQLite) { }

  private openSqliteDb(sqlite: SQLite) {
    return sqlite.create({
      name: 'vapp.db',
      location: 'default'
    });
  }
  private createTable(db: SQLiteObject, query: string) {
    return new Promise<SQLiteObject>((resolve, reject) => {
      try {
        db
          .executeSql(query, [])
          .then(() => {
            resolve(db);
          })
          .catch((e) => {
            reject(e);
          });
      } catch (e) {
        reject(e);
      }
    });
  }

  insertAmbassador(ambassador: Ambassador) {
    this.prepareAmbassadorTable().then(db => {
      db.executeSql(`INSERT INTO Ambassador VALUES(
        '${ambassador.ID}',
        '${ambassador.Title}',
        '${ambassador.Position}',
        '${ambassador.CompanyTitle}',
        '${ambassador.Name}',
        '${ambassador.IRID}',
        '${ambassador.Team}',
        '${ambassador.Email}',
        '${ambassador.Contact}',
        '${ambassador.Image}',
        '${ambassador.Status}',
        '${ambassador.Rank}',
        '${ambassador.Description}'
      )`, []);
    })

  }

  insertCorp(corp: Corporate) {
    console.log(corp)
    this.prepareCorporateTable().then(db => {
      db.executeSql(`INSERT INTO Corporate VALUES(
        '${corp.ID}',
        '${corp.RunningNum}',
        '${corp.Title}',
        '${corp.Name}',
        '${corp.CompanyTitle}',
        '${corp.Contact}',
        '${corp.Email}',
        '${corp.Department}',
        '${corp.Region}',
        '${corp.Image}'
      )`, []).then(() => { }, error => console.log(error));
    }, error => {
      console.log(error)
    });
  }

  async getAmbassadorsData(params?: { title?: string, id?: string }) {
    const db = await this.prepareAmbassadorTable();
    let data;
    let holder = [];
    if (params != null) {
      if (params.id != null) {
        data = await db.executeSql(`Select * from Ambassador WHERE CorporateStaffID ='${params.id}'`, []);
      } else
        data = await db.executeSql(`Select * from Ambassador WHERE title='${params.title}' AND NOT IRID='0000000'`, []);
    }
    else
      data = await db.executeSql(`Select * from Ambassador WHERE NOT IRID='0000000'`, []);

    console.log(data)
    // for (let i = 0; i < data.rows.length; i++)
    //   holder.push(data.rows.item(i))
    return data.rows;
  }

  async getCorporateHeaders() {
    const db = await this.prepareCorporateTable();
    let data
    data = await db.executeSql(`Select * from Corporate
    WHERE Department NOT IN ('NSE', 'GLAD', 'GBD', 'CL')
    Order by case
    when Department='ACEO' then 0
    when Department='ED' then 1
    when Department='CMRO' then 2 
    when Email='agatha@the-v.net' then 3 END`
      , [])
    return data.rows
  }
  async getCorporatesData() {
    const db = await this.prepareCorporateTable();
    let data
    data = await db.executeSql('Select * from Corporate', [])
    console.log(data.rows)
    return data.rows;
  }

  async getCorporateByEmail(email) {
    const db = await this.prepareCorporateTable();
    let data;
    data = await db.executeSql(`Select * from Corporate WHERE Email ='${email}' limit 1`, []);
    return data.rows;

  }

  async getAmbassadorByEmail(email) {
    const db = await this.prepareAmbassadorTable();
    let data;
    data = await db.executeSql(`Select * from Ambassador WHERE Email ='${email}' limit 1`, []);
    return data.rows;

  }

  // async getCorporateByDepartment(dep) {
  //   const db = await this.prepareCorporateTable();
  //   let data = await db.executeSql('SELECT * FROM `t_corporatestaff` where Department=', []);
  // }

  private async prepareAmbassadorTable() {
    const db = await this.openSqliteDb(this.sqlite);
    return this.createTable(db, this.ambassadorQuery);
  }
  private async prepareCorporateTable() {
    const db = await this.openSqliteDb(this.sqlite);
    return this.createTable(db, this.corporateQuery);
  }
}
