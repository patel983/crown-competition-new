import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Extender } from '../../../../../common/helpers/extender';
import {
  Account,
  AccountApi,
  Invitation,
  InvitationApi
} from '../../../../../common/sdk';

@Component({
  selector: 'app-send-invites',
  templateUrl: './send-invites.component.html',
  styleUrls: ['./send-invites.component.scss']
})
export class SendInvitesComponent extends Extender implements OnInit {
  public email: string;
  public emails: string[] = [];
  public invite: Invitation = new Invitation();
  @ViewChild('linkRef') private linkRef: ElementRef;

  constructor(
    protected injector: Injector,
    private _accountApi: AccountApi,
    private _invitationApi: InvitationApi
  ) {
    super(injector);
  }

  public ngOnInit() {
    if (this.currentUser) {
      this.invite = new Invitation({
        accountId: this.currentUser.id,
        link: this.currentUser.invitivationCode
          ? `${window.location.href}/?page=signup&id=${
          this.currentUser.id
          }&unicode=${this.currentUser.invitivationCode}`
          : null,
        code: this.currentUser.invitivationCode
      });
    }
  }

  public removeEmail(email: string): void {
    const index = this.emails.findIndex((_email) => _email === email);
    this.emails.splice(index, 1);
  }

  public copy(): void {
    const copyText: HTMLInputElement = this.linkRef
      .nativeElement as HTMLInputElement;
    copyText.select();
    document.execCommand('copy');
  }

  public getInviteLink(): void {
    this._accountApi
      .setInvitationCode({ id: this.currentUser.id })
      .subscribe((data: Account) => {
        this.currentUser.invitivationCode = data.invitivationCode;
        this.invite.link = `${window.location.origin}/?page=signup&id=${
          this.currentUser.id
          }&unicode=${this.currentUser.invitivationCode}`;
        this.invite.code = this.currentUser.invitivationCode;
        this.toastr.success('Invitation code has been set');
      });
  }

  public addInvitation(): void {
    this.emails.forEach((email) => {
      this.invite.receiverEmail = email;
      this._invitationApi.create(this.invite).subscribe();
    });

    this.send(this.emails);
  }

  private send(emails): void {
    this.loading = true;
    const emailData = {
      subject: `${this.currentUser.contact.firstName +
        ' ' +
        this.currentUser.contact.lastName} sent you an invitation!`,
      content: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>You've got a £5 Raffler Invitation</title>

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
                    Sign up with invitation link and get £5 off your next raffle
                  </td>
                </tr>
                <tr>
                  <td class="content-wrap">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td class="content-block">
                          Hey! <strong>${this.currentUser.contact.firstName +
              ' ' +
              this.currentUser.contact.lastName}</strong> thought you would like a fiver.
                        </td>
                      </tr>
                      <tr>
                        <td class="content-block">
      Join thousands of players winning cash, cars, tech & holidays daily. Why buy it, when you can win it with Raffler. 									</td>
                      </tr>
                      <tr>
                        <td class="content-block">
                          <a href="${
                  this.invite.link
                }" class="btn-primary">Claim Your £5</a>
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
    this._accountApi.sendEmail({ emails, emailData }).subscribe(() => {
      this.loading = false;
      this.toastr.success('Emails have been sent');
    });
  }
}
