const mailer = require('nodemailer')





const sendSampleMail = () => {

    let res = {};
    let smtpTransporter = mailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'rajeshpbooks@gmail.com',
            pass: 'Design_20'
        },
        proxy: 'http://10.34.41.52:80'
    })
    let mailOptions = {
        // from: '" nuguroho 👻" <r.nugroho@indosatooredoo.com>', // sender address
        from: "rajeshpbooks@gmail.com",
        to: 'rajeshreddyponnala@gmail.com', // list of receivers
        subject: 'Test ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>MPI Mail</b>' // html body
    };

    smtpTransporter.sendMail(mailOptions, (error, info) => {
        console.log(error)
        console.log(info)
        return { error: error, info: info }
    })
}

module.exports = { sendSampleMail }