import { Component, Injector, OnInit } from '@angular/core';
import { Extender } from '../../../../../common/helpers/extender';
import { AccountApi, RaffleDraw, RaffleDrawApi, RaffleEntry, RaffleWinner, RaffleWinnerApi } from '../../../../../common/sdk';
import { DialogConfig } from '../../../../../modules/dialog/helpers/dialog-config';
import { DialogRef } from '../../../../../modules/dialog/helpers/dialog-ref';

@Component({
  selector: 'app-manage-raffle',
  templateUrl: './manage-raffle.component.html',
  styleUrls: ['./manage-raffle.component.scss']
})
export class ManageRaffleComponent extends Extender implements OnInit {

  public modalSize: string = 'lg';
  public raffle: RaffleDraw = new RaffleDraw();
  public entries: RaffleEntry[];
  public winners: RaffleEntry[] = [];
  public raffleWinners: RaffleWinner[];
  public loosers: string[];

  constructor(
    protected injector: Injector,
    private _dialogRef: DialogRef,
    private _dialogConfig: DialogConfig,
    private _raffleApi: RaffleDrawApi,
    private _accountApi: AccountApi,
    private _raffleWinnerApi: RaffleWinnerApi
  ) {
    super(injector);
  }

  public ngOnInit() {
    this.raffle = this._dialogConfig.data;
    this.raffleWinners = this.raffle.raffleWinners ? this.raffle.raffleWinners : [];
    this.getRaffleEntries();
  }

  public getWinningNumbers(): void {
    this.loading = true;
    this._raffleWinnerApi.getWinningNumbers(this.raffle)
      .subscribe((res: { raffle: RaffleDraw, raffleWinners: RaffleWinner[] }) => {
        this.raffleWinners = res.raffleWinners;
        this.winners = this.entries.filter((entry) => {
          if (!!this.raffleWinners.find((winner) => entry.entryNumber === winner.winningNumber)) {
            return entry;
          }
        });
        this.raffle = Object.assign(this.raffle, res.raffle);
        this.getLoosersEmail();
        this.loading = false;
      },
        (error) => { this.loading = false; console.log(error); });
  }

  public getRaffleEntries(): void {
    this._raffleApi.getRaffleEntries(this.raffle.id, { include: { 'account': 'contact' } })
      .subscribe((res: RaffleEntry[]) => {
        this.entries = res;
        const winningNumbers = this.raffleWinners.map((entry) => entry.winningNumber);
        this.winners = this.entries.filter((entry) => {
          if (winningNumbers.includes(entry.entryNumber)) {
            return entry;
          }
        });
      });
  }

  public getLoosersEmail(): void {
    const winningUsers = this.winners.map((winner) => winner.account.email);
    const winningNumbers = this.raffleWinners.map((entry) => entry.winningNumber);
    this.loosers = this.entries.filter((entry) => {
      if (!winningNumbers.includes(entry.entryNumber)) {
        return entry;
      }
    }).map((entry) => entry.account.email);
    this.loosers = this.loosers.reduce((x, y) => x.includes(y) ? x : [...x, y], []);
    this.loosers.filter((email) => !winningUsers.includes(email));
    this.loading = true;
    const emailData = {
      subject: `Better luck next time!`,
      content: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Better luck next time!</title>

<style>
/* -------------------------------------
    GLOBAL
------------------------------------- */
* {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  font-size: 14px;
}

img {
  max-width: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: none;
  width: 100% !important;
  height: 100%;
  line-height: 1.6;
}

/* Let's make sure all tables have defaults */
table td {
  vertical-align: top;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
body {
  background-color: #f6f6f6;
}

.body-wrap {
  background-color: #f6f6f6;
  width: 100%;
}

.container {
  display: block !important;
  max-width: 600px !important;
  margin: 0 auto !important;
  /* makes it centered */
  clear: both !important;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  display: block;
  padding: 20px;
}

.social ul {
    overflow: auto;
    list-style-type: none;
    text-align: center;
    
}

.social li {
 	display: inline;
}

.social p {
    text-align: center;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
}

.content-wrap {
  padding: 20px;
}

.content-block {
  padding: 0 0 20px;
}

.header {
  width: 100%;
  margin-bottom: 20px;
}

.footer {
  width: 100%;
  clear: both;
  color: #999;
  padding: 20px;
}
.footer a {
  color: #999;
}
.footer p, .footer a, .footer unsubscribe, .footer td {
  font-size: 12px;
}

/* -------------------------------------
    GRID AND COLUMNS
------------------------------------- */
.column-left {
  float: left;
  width: 50%;
}

.column-right {
  float: left;
  width: 50%;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1, h2, h3 {
  font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  color: #000;
  margin: 40px 0 0;
  line-height: 1.2;
  font-weight: 400;
}

h1 {
  font-size: 32px;
  font-weight: 500;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 14px;
  font-weight: 600;
}

p, ul, ol {
  margin-bottom: 10px;
  font-weight: normal;
}
p li, ul li, ol li {
  margin-left: 5px;
  list-style-position: inside;
}

/* -------------------------------------
    LINKS & BUTTONS
------------------------------------- */
a {
  color: #348eda;
  text-decoration: underline;
}

.btn-primary {
  text-decoration: none;
  color: #FFF;
  background-color: #348eda;
  border: solid #348eda;
  border-width: 10px 20px;
  line-height: 2;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  border-radius: 5px;
  text-transform: capitalize;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
  margin-bottom: 0;
}

.first {
  margin-top: 0;
}

.padding {
  padding: 10px 0;
}

.aligncenter {
  text-align: center;
}

.alignright {
  text-align: right;
}

.alignleft {
  text-align: left;
}

.clear {
  clear: both;
}

/* -------------------------------------
    Alerts
------------------------------------- */
.alert {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  padding: 20px;
  text-align: center;
  border-radius: 3px 3px 0 0;
}
.alert a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
}
.alert.alert-warning {
  background: #ff9f00;
}
.alert.alert-bad {
  background: #d0021b;
}
.alert.alert-good {
  background: #68b90f;
}
.alert.alert-calm {
  background: #259EE6;
}

/* -------------------------------------
    INVOICE
------------------------------------- */
.invoice {
  margin: 40px auto;
  text-align: left;
  width: 80%;
}
.invoice td {
  padding: 5px 0;
}
.invoice .invoice-items {
  width: 100%;
}
.invoice .invoice-items td {
  border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
  font-weight: 700;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
  h1, h2, h3, h4 {
    font-weight: 600 !important;
    margin: 20px 0 5px !important;
  }

  h1 {
    font-size: 22px !important;
  }

  h2 {
    font-size: 18px !important;
  }

  h3 {
    font-size: 16px !important;
  }

  .container {
    width: 100% !important;
  }

  .content, .content-wrapper {
    padding: 10px !important;
  }

  .invoice {
    width: 100% !important;
  }
}
</style>

</head>

<body>

<table class="body-wrap">
	<tr>
		<td></td>
		<td class="container" width="600">
			<div class="content">
				<table class="main" width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td class="alert alert-warning">
							Better luck next time!
						</td>
					</tr>
					<tr>
						<td class="content-wrap">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td class="content-block">
										Hi ${this.currentUser.firstName}, Unfortunately you didn't win the <strong>${this.raffle.name}</strong> 
									</td>
								</tr>
								<tr>
									<td class="content-block">
Don't worry, there are a lots more raffles to win. Maybe your numbers had already been picked by someone else. Get back in the game, hit the 'Lucky Dip' button and watch our AI algorithm pick you some new numbers from the remaining batch.								</td>
								</tr>
								<tr>
									<td class="content-block">
										<a href="#" class="btn-primary">Try Lucky Dip</a>
									</td>
								</tr>
								<tr>
									<td class="content-block">
										Thanks for choosing Raffler LTD.
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<div class="footer">
					<table width="100%">
						<tr>
							<td class="aligncenter content-block"><a href="%unsubscribe_url%">Unsubscribe</a> from these alerts.</td>
<div class="social">
  <ul>
        <li><a href="#"> T&Cs</a></li>
        <li><a href="#"> Privacy Policy</a></li>
        <li><a href="#" target="_blank"> Facebook</a></li>
        <li><a href="#" target="_blank"> Twitter</a></li>
        <li><a href="#" target="_blank"> Instagram</a></li>
  </ul>
  <p>Raffler LTD | +44 (020) 1234 1234 | 101, London, E1 8UU</p>
</div>

						</tr>
					</table>
				</div></div>
		</td>
		<td></td>
	</tr>
</table>

</body>
</html>
      `
    };
    this._accountApi.sendEmail({ emails: this.loosers, emailData }).subscribe(() => {
      this.loading = false;
      this.toastr.success('Email sent');
    });
  }

  public send(entry: RaffleEntry[]): void {
    this.loading = true;
    const emailData = {
      subject: `You are the winner of ${this.raffle.name}!`,
      content: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Hooray! You've Won</title>

<style>
/* -------------------------------------
    GLOBAL
------------------------------------- */
* {
  margin: 0;
  padding: 0;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  font-size: 14px;
}

img {
  max-width: 100%;
}

body {
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: none;
  width: 100% !important;
  height: 100%;
  line-height: 1.6;
}

/* Let's make sure all tables have defaults */
table td {
  vertical-align: top;
}

/* -------------------------------------
    BODY & CONTAINER
------------------------------------- */
body {
  background-color: #f6f6f6;
}

.body-wrap {
  background-color: #f6f6f6;
  width: 100%;
}

.container {
  display: block !important;
  max-width: 600px !important;
  margin: 0 auto !important;
  /* makes it centered */
  clear: both !important;
}

.content {
  max-width: 600px;
  margin: 0 auto;
  display: block;
  padding: 20px;
}

.social ul {
    overflow: auto;
    list-style-type: none;
    text-align: center;
    
}

.social li {
 	display: inline;
}

.social p {
    text-align: center;
}

/* -------------------------------------
    HEADER, FOOTER, MAIN
------------------------------------- */
.main {
  background: #fff;
  border: 1px solid #e9e9e9;
  border-radius: 3px;
}

.content-wrap {
  padding: 20px;
}

.content-block {
  padding: 0 0 20px;
}

.header {
  width: 100%;
  margin-bottom: 20px;
}

.footer {
  width: 100%;
  clear: both;
  color: #999;
  padding: 20px;
}
.footer a {
  color: #999;
}
.footer p, .footer a, .footer unsubscribe, .footer td {
  font-size: 12px;
}

/* -------------------------------------
    GRID AND COLUMNS
------------------------------------- */
.column-left {
  float: left;
  width: 50%;
}

.column-right {
  float: left;
  width: 50%;
}

/* -------------------------------------
    TYPOGRAPHY
------------------------------------- */
h1, h2, h3 {
  font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif;
  color: #000;
  margin: 40px 0 0;
  line-height: 1.2;
  font-weight: 400;
}

h1 {
  font-size: 32px;
  font-weight: 500;
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 14px;
  font-weight: 600;
}

p, ul, ol {
  margin-bottom: 10px;
  font-weight: normal;
}
p li, ul li, ol li {
  margin-left: 5px;
  list-style-position: inside;
}

/* -------------------------------------
    LINKS & BUTTONS
------------------------------------- */
a {
  color: #348eda;
  text-decoration: underline;
}

.btn-primary {
  text-decoration: none;
  color: #FFF;
  background-color: #348eda;
  border: solid #348eda;
  border-width: 10px 20px;
  line-height: 2;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  display: inline-block;
  border-radius: 5px;
  text-transform: capitalize;
}

/* -------------------------------------
    OTHER STYLES THAT MIGHT BE USEFUL
------------------------------------- */
.last {
  margin-bottom: 0;
}

.first {
  margin-top: 0;
}

.padding {
  padding: 10px 0;
}

.aligncenter {
  text-align: center;
}

.alignright {
  text-align: right;
}

.alignleft {
  text-align: left;
}

.clear {
  clear: both;
}

/* -------------------------------------
    Alerts
------------------------------------- */
.alert {
  font-size: 16px;
  color: #fff;
  font-weight: 500;
  padding: 20px;
  text-align: center;
  border-radius: 3px 3px 0 0;
}
.alert a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
}
.alert.alert-warning {
  background: #ff9f00;
}
.alert.alert-bad {
  background: #d0021b;
}
.alert.alert-good {
  background: #68b90f;
}
.alert.alert-calm {
  background: #259EE6;
}

/* -------------------------------------
    INVOICE
------------------------------------- */
.invoice {
  margin: 40px auto;
  text-align: left;
  width: 80%;
}
.invoice td {
  padding: 5px 0;
}
.invoice .invoice-items {
  width: 100%;
}
.invoice .invoice-items td {
  border-top: #eee 1px solid;
}
.invoice .invoice-items .total td {
  border-top: 2px solid #333;
  border-bottom: 2px solid #333;
  font-weight: 700;
}

/* -------------------------------------
    RESPONSIVE AND MOBILE FRIENDLY STYLES
------------------------------------- */
@media only screen and (max-width: 640px) {
  h1, h2, h3, h4 {
    font-weight: 600 !important;
    margin: 20px 0 5px !important;
  }

  h1 {
    font-size: 22px !important;
  }

  h2 {
    font-size: 18px !important;
  }

  h3 {
    font-size: 16px !important;
  }

  .container {
    width: 100% !important;
  }

  .content, .content-wrapper {
    padding: 10px !important;
  }

  .invoice {
    width: 100% !important;
  }
}
</style>

</head>

<body>

<table class="body-wrap">
	<tr>
		<td></td>
		<td class="container" width="600">
			<div class="content">
				<table class="main" width="100%" cellpadding="0" cellspacing="0">
					<tr>
						<td class="alert alert-good">
							Hooray! You've won the ${this.raffle.name}
						</td>
					</tr>
					<tr>
						<td class="content-wrap">
							<table width="100%" cellpadding="0" cellspacing="0">
								<tr>
									<td class="content-block">
										Congratulations ${this.currentUser.firstName},<strong>You are a winner!</strong> 
									</td>
								</tr>
								<tr>
									<td class="content-block">
If you haven't already, please remember to update your profile information in order to claim your prize. Please add the following.
<p>
<li>A recent picture</li>
<li>Full name</li>
<li>Email address</li>
<li>Contact number</li>
<li>Full address</li>
<br>
We'll be in-touch shortly to arrange delivery of your prize. 
</p>
</td>
								</tr>
								<tr>
									<td class="content-block">
										<a href="#" class="btn-primary">Update Profile</a>
									</td>
								</tr>
								<tr>
									<td class="content-block">
										Thanks for choosing Raffler LTD.
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				<div class="footer">
					<table width="100%">
						<tr>
							<td class="aligncenter content-block"><a href="%unsubscribe_url%">Unsubscribe</a> from these alerts.</td>
<div class="social">
  <ul>
        <li><a href="#"> T&Cs</a></li>
        <li><a href="#"> Privacy Policy</a></li>
        <li><a href="#" target="_blank"> Facebook</a></li>
        <li><a href="#" target="_blank"> Twitter</a></li>
        <li><a href="#" target="_blank"> Instagram</a></li>
  </ul>
  <p>Raffler LTD | +44 (020) 1234 1234 | 101, London, E1 8UU</p>
</div>

						</tr>
					</table>
				</div></div>
		</td>
		<td></td>
	</tr>
</table>

</body>
</html>
      `
    };

    const emails = entry.map((_entry) => _entry.account.email);
    this._accountApi.sendEmail({ emails, emailData }).subscribe(() => {
      this.loading = false;
      this.toastr.success('Email sent');
    });
  }

  public closeModal(): void {
    this._dialogRef.close();
  }

}
