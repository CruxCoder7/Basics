import nodemailer from "nodemailer"

export const send_mail = async (
  to_address: string,
  email_key: string,
  transaction_id: number

): Promise<boolean> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "akashrangesh03@gmail.com",
      pass: process.env.MAIL_PASS,
    },
  })

  const mailOptions = {
    from: "akashrangesh03@gmail.com",
    to: to_address,
    subject: "Your transaction has been flagged!!!",
    html: `Your code is <b>${email_key}</b>
           <br/>
           Go to <a href="http://localhost:3000/transaction/${transaction_id}">this link</a> and type the above code to cancel your transaction.
           <br/>
           If you want to proceed, click the <b>Proceed</b> button on the page.`,
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        reject(false)
      } else {
        console.log("Email sent: " + info)
        resolve(true)
      }
    })
  })
}
