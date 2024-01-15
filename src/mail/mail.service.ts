import { Injectable } from '@nestjs/common';
import Mailjet, * as mailjet from 'node-mailjet';

@Injectable()
export class MailService {
    private mailjetClient: any;

    constructor() {
        this.mailjetClient = mailjet.Client.apiConnect(
            process.env.MAILJET_API_KEY,
            process.env.MAILJET_SECRET_KEY,
            {}
        );
    }

    async sendWelcomeEmail(campaignId: number, data) {
        try {
            const request = await this.mailjetClient
                .post('send', { version: 'v3.1' }).request({
                    Messages: [
                        {
                            From: {
                                Email: 'bonnita3182@gmail.com',
                                Name: 'Bonnita',
                            },
                            To: [
                                {
                                    Email: data.email,
                                    Name: data.firstname,
                                },
                            ],
                            TemplateID: campaignId,
                            TemplateLanguage: true,
                            Subject: 'account created successfully',
                        },
                    ],
                })
            // console.log(request);
            return request.body;
        } catch (error) {
            console.error(error.statusCode);
            throw error;
        }
    }

    async forgotPassword(url: string, data: any) {
        const htmlContent = `
        <div style="margin: 0px auto; width: 100%">
    <div style="margin: 0px auto; width: 600px; background-color: rgb(44, 20, 82)">
        <div style="
        align-items: stretch;
        display: flex;
        margin: 0px auto;
        padding: 0px;
        width: 600px;
        pointer-events: auto;
      ">
            <div class="elem-9AUI_2o5Zqh-QIJRZczmU" style="display: flex; flex-basis: 100%">
                <div class="BordersWrapper-sc-1egkq30-0 kjsrEc border-drag-block border-drag-block-modal border-drag-file"
                    style="position: relative">
                    <div class="column column-1" style="
              display: flex;
              flex-direction: column;
              flex-grow: 1;
              justify-content: flex-start;
            ">
                        <div class="BordersConstructor-sc-11t70e3-0 gTptPw is-hovered is-selected">
                            <div class="BordersOverlay-sc-vft3a7-0 faRjLy"></div>
                            <div class="BordersDraggableWrapper-sc-1g6mcuq-0 kOHsrE">
                                <div class="pp-container canSelected"
                                    style="display: grid; position: relative; width: 100%">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div class="elem-eICf_k0imybXndRhg1Ig8 with-placeholder"
                                        data-testid="drop-image-eICf_k0imybXndRhg1Ig8" style="width: 100%"
                                        aria-hidden="false">
                                        <div class="BordersWrapper-sc-1egkq30-0 kjsrEc is-hovered"
                                            data-testid="drag-image-eICf_k0imybXndRhg1Ig8" draggable="true"
                                            aria-describedby="react-aria-description-68">
                                            <div style="
                          font-size: 0px;
                          justify-self: center;
                          padding: 10px 25px;
                          width: 100%;
                          word-break: break-word;
                          background-color: rgb(255, 255, 255);
                        ">
                                                <div class="StyledImage-sc-vo96so-0 fUrpKX" style="
                            align-items: center;
                            display: flex;
                            flex-direction: column;
                          ">
                                                    <div style="
                              position: relative;
                              width: 100%;
                              max-width: 500px;
                            ">
                                                        <img src="https://s1msh.mjt.lu/img2/s1msh/b57c4204-6079-443b-ba3c-b43db93e45e9/content?updatedAt=1703333470144"
                                                            style="
                                border: none;
                                border-radius: 0px;
                                display: block;
                                outline: none;
                                text-decoration: none;
                                cursor: pointer;
                                height: auto;
                                width: 100%;
                              " alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="BordersConstructor-sc-11t70e3-0 gTptPw">
                            <div class="BordersOverlay-sc-vft3a7-0 faRjLy"></div>
                            <div class="BordersDraggableWrapper-sc-1g6mcuq-0 kOHsrE">
                                <div class="pp-container canSelected"
                                    style="display: grid; position: relative; width: 100%">
                                    <div class="elem-PDypbNd4zA9GmLO44TXpN with-placeholder"
                                        data-testid="drop-divider-PDypbNd4zA9GmLO44TXpN" style="width: 100%"
                                        aria-hidden="false">
                                        <div class="BordersWrapper-sc-1egkq30-0 kjsrEc"
                                            data-testid="drag-divider-PDypbNd4zA9GmLO44TXpN" draggable="true"
                                            aria-describedby="react-aria-description-68">
                                            <div style="
                          font-size: 0px;
                          justify-self: center;
                          padding: 10px 25px;
                          width: 100%;
                          word-break: break-word;
                        ">
                                                <p class="divider" style="
                            font-size: 1px;
                            margin: 0px auto;
                            border-top: 2px solid rgb(230, 230, 230);
                            width: 100%;
                          "></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="BordersConstructor-sc-11t70e3-0 gTptPw">
                            <div class="BordersOverlay-sc-vft3a7-0 faRjLy"></div>
                            <div class="BordersDraggableWrapper-sc-1g6mcuq-0 kOHsrE">
                                <div class="pp-container canSelected"
                                    style="display: grid; position: relative; width: 100%">
                                    <div class="elem-d7u9m83aKo2knyUYkTpPt with-placeholder"
                                        data-testid="drop-text-d7u9m83aKo2knyUYkTpPt" style="width: 100%">
                                        <div class="BordersWrapper-sc-1egkq30-0 kjsrEc"
                                            data-testid="drag-text-d7u9m83aKo2knyUYkTpPt"
                                            aria-describedby="react-aria-description-68" draggable="true">
                                            <div style="
                          font-size: 0px;
                          justify-self: center;
                          padding: 0px 25px;
                          width: 100%;
                          word-break: break-word;
                        ">
                                                <div class="text pp-preset-styled" style="width: 100%">
                                                    <div style="font-size: 13px">
                                                        <div style="display: none"></div>
                                                        <div class="ck ck-reset ck-editor ck-rounded-corners"
                                                            role="application" dir="ltr" lang="en"
                                                            aria-labelledby="ck-editor__label_e27f957d7f4858a15282fc556cd1a9725">
                                                            <div class="ck ck-editor__top ck-reset_all"
                                                                role="presentation">
                                                                <div class="ck ck-sticky-panel">
                                                                    <div class="ck ck-sticky-panel__placeholder"
                                                                        style="display: none"></div>
                                                                    <div class="ck ck-sticky-panel__content">
                                                                        <div class="ck ck-toolbar ck-toolbar_grouping"
                                                                            role="toolbar" aria-label="Editor toolbar">
                                                                            <div class="ck ck-toolbar__items"></div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="ck ck-editor__main" role="presentation">
                                                                <div class="ck ck-content ck-editor__editable ck-rounded-corners ck-editor__editable_inline ck-blurred"
                                                                    lang="en" dir="ltr" role="textbox"
                                                                    aria-label="Rich Text Editor, main"
                                                                    contenteditable="true">
                                                                    <p class="text-build-content"
                                                                        data-testid="d7u9m83aKo2knyUYkTpPt">
                                                                        <span style="
                                        color: #ffffff;
                                        font-family: Arial;
                                        font-size: 18px;
                                                    ">Forgot your password ? reset your password using this
                                                    <a href="${url}" target="_blank">  link</a</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
      `;

        try {
            const request = await this.mailjetClient
                .post('send', { version: 'v3.1' }).request({
                    Messages: [
                        {
                            From: {
                                Email: 'bonnita3182@gmail.com',
                                Name: 'Bonnita',
                            },
                            To: [
                                {
                                    Email: data.email,
                                    Name: data.firstname,
                                },
                            ],
                            HTMLPart: htmlContent,
                            Subject: 'forgot password.',
                        },
                    ],
                })
            console.log("Email sent successfully")
            // console.log(request);
            return request.body;
        } catch (error) {
            console.error(error.statusCode);
            throw error;
        }


    }

    async congratulations(data: any, username: any) {

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Placed - Confirmation</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
        
            .container {
              width: 60%;
              margin: 20px auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
        
            p {
              color: #555;
            }
        
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              font-size: 16px;
              text-decoration: none;
              background-color: #000000;
              color: #fff;
              
            }
            a{
              color: #000000;
            }
          </style>
        </head>
    <body  style="font-family: Arial; font-size: 16px; line-height: 25px; background: #EFEFEF;">
        
      <div class="container">
          <div style="display: flex;justify-content: center;">
            <img style="width: 150px;" src="images/logo.jpg" alt="">
          </div>
       <table>
       <tr >
        <td>
          <h3>Dear <strong>${username}</strong>,</h3>
        </td>
       </tr>
       <tr>
        <td>
          <p style="color: green; font-weight: 600;">Congratulations! Your order has been confirmed !!!</p>
          <p>Your stylish picks are on their way to you. Get ready to turn heads with these trendy additions to your wardrobe!</p>
          <p>Order Details:</p>
        </td>
       </tr>
       <tr>
        <td>
          <ul>
            <li>Order ID:<strong> #${data.ref_no}</strong></li>
            <li>Order Date:<strong>${data.date}</strong> </li>
            <li> Total Amount:  <strong>₹ ${data.amount}</strong></li>
          </ul>
          <br>
          <a style="color: #EE7B7B;" href="${process.env.FE_URL}/accountinfo" target="_blank">Track your order here</a> <br>
        </td>
       </tr>
       <tr>
        <td>
          <p>If you have any fashion emergencies or need assistance, reach out to <b><a target="_blank" href="mailto:bonnita3182@gmail.com">bonnita3182@gmail.com</a></b> or <b><a target="_blank" href="tel:+91-8220773182">+91-8220773182</a></b></p>
          <p>Thank you for choosing us. We can't wait to see you rocking with our Products</p>
        </td>
       </tr>
       <tr>
        <td>
           <a href="${process.env.FE_URL}" class="button">Explore More Trends</a> </td>
       </tr>
      
       </table>
      </div>
    
         
        
    </body>
</html>
    `

        try {
            const request = await this.mailjetClient
                .post('send', { version: 'v3.1' }).request({
                    Messages: [
                        {
                            From: {
                                Email: 'bonnita3182@gmail.com',
                                Name: 'Bonnita',
                            },
                            To: [
                                {
                                    Email: data.email,
                                    Name: data.firstname,
                                },
                            ],
                            HTMLPart: htmlContent,
                            Subject: 'your order has been placed successfully.',
                        },
                    ],
                })
            console.log("Email sent successfully")
            // console.log(request);
            return request.body;
        } catch (error) {
            console.error(error.statusCode);
            throw error;
        }

    }

    async newsLetter(data: any, news: any) {

        const htmlContent = `
        
 
    <body  style="font-family: Arial; font-size: 16px; line-height: 25px; background: #EFEFEF;margin: 0;
    padding: 0;
    background-color: #f5f5f5;">
          <div class="container" style="   width: 60%;
          margin: 20px auto;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        
        <h1>🌟 Your Monthly Update is Here! 🌟</h1>
        <p style="color: #555;">Hello <strong>${data.firstname}</strong>,</p>
        <p >We hope this newsletter finds you well. Here are some exciting updates and news from our world:</p>
    
    
        <h2>Featured Article: Unveiling Our Latest Collection</h2>
        <p >Explore the elegance of our newest collection that just hit the shelves. From classic styles to bold statements, we've got something for every taste.
          Upto  <strong>60% off </strong> awaits for you. Grab offers soon!!
        </p>
        <p >${news.content}</p>
    
        <h2>Upcoming Events</h2>
        <p>Don't miss out on our upcoming events! Join us for exclusive previews, discounts, and more. Mark your calendar now!</p>
    
    
    
        <p>Thank you for being a valued part of our community. We can't wait to bring you more exciting updates next month!</p>
    
         
             <a href="${process.env.FE_URL}" target="_blank" style="   display: inline-block;
             padding: 10px 20px;
             margin: 20px 0;
             font-size: 16px;
             text-decoration: none;
             background-color: #000000;
             color: #fff;" class="button">Grab Offers now</a> </td>
    
             <p style="color: #555;">Regards</p>
             <div >
              <img style="width: 150px;" src="images/logo.jpg" alt="">
            </div>
         
      </div>
    
         
        
    </body>
    `

        try {
            const request = await this.mailjetClient
                .post('send', { version: 'v3.1' }).request({
                    Messages: [
                        {
                            From: {
                                Email: 'bonnita3182@gmail.com',
                                Name: 'Bonnita',
                            },
                            To: [
                                {
                                    Email: data.email,
                                    Name: data.firstname,
                                },
                            ],
                            HTMLPart: htmlContent,
                            Subject: 'newsletter sent successfully.',
                        },
                    ],
                })
            console.log("Email sent successfully")
            // console.log(request);
            return request.body;
        } catch (error) {
            console.error(error.statusCode);
            throw error;
        }

    }

    async orderedSuccesfull(data: any) {

        const htmlContent = `
        
 
        <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">

        <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); max-width: 600px; margin: 0 auto;">
    
            <h1>Your Order Has Been Placed</h1>
            <p>Thank you for choosing our services. Your order has been successfully placed.</p>
    
            <p style="margin-bottom: 10px;"><strong>Order Details:</strong></p>
            <ul style="list-style-type: none; padding: 0;">
                <li style="margin-bottom: 5px;"><strong>Order ID:</strong> ${data.order_id}</li>
                <li style="margin-bottom: 5px;"><strong>Product:</strong> ${data.product_name}</li>
                <li style="margin-bottom: 5px;"><strong>Quantity:</strong> ${data.quantity}</li>
                <li style="margin-bottom: 5px;"><strong>Total Amount:</strong> ${data.price}</li>
            </ul>
    
            <p>We will process your order and provide updates shortly.</p>
            <p>For any inquiries, please contact our customer support.</p>
    
        </div>
    
    </body>
    `

        try {
            const request = await this.mailjetClient
                .post('send', { version: 'v3.1' }).request({
                    Messages: [
                        {
                            From: {
                                Email: 'bonnita3182@gmail.com',
                                Name: 'Bonnita',
                            },
                            To: [
                                {
                                    Email: data.email,
                                    Name: data.firstname,
                                },
                            ],
                            HTMLPart: htmlContent,
                            Subject: 'your order has been sent successfully.',
                        },
                    ],
                })
            console.log("Email sent successfully")
            // console.log(request);
            return request.body;
        } catch (error) {
            console.error(error.statusCode);
            throw error;
        }

    }    

}
