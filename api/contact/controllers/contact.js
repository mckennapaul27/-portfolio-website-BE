const nodemailer = require('nodemailer');
const nodeMailerPass = process.env.nodeMailerPass;
const nodeMailerUser = process.env.nodeMailerUser;

const SibApiV3Sdk = require('sib-api-v3-sdk');
const defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.STRAPI_API_KEY;

// create new contact by passing email
const createNewContact = async ({ email, listIds, attributes }) => {
    const apiInstance = new SibApiV3Sdk.ContactsApi();
    let createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.attributes = attributes;
    createContact.listIds = listIds;
    try {
        const res = await apiInstance.createContact(createContact);
        return res;
    } catch (err) {
        console.log(err.response);
        const { status } = err.response.error;
        return status;
    }
};

const sendEmail = async ({ templateId, smtpParams, tags, email, replyTo }) => {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    let sender = {
        name: 'McKenna Codes',
        email: 'hello@mckenna.codes',
    };
    sendSmtpEmail = {
        sender: sender,
        to: [{ email }], // array of objects
        replyTo: replyTo,
        templateId,
        params: smtpParams,
    };
    try {
        const res = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(res);
        return res;
    } catch (err) {
        console.log(err.response.error);
        const { status } = err.response.error;
        return status;
    }
};

const sendNodemailerEmail = async ({ smtpParams, email }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtppro.zoho.com',
        port: 465,
        secure: true,
        auth: {
            user: nodeMailerUser,
            pass: nodeMailerPass,
        },
    });
    let mailOptions = {
        from: {
            name: 'McKenna Codes',
            address: nodeMailerUser,
        },
        to: 'hello@mckenna.codes',
        subject: `New contact form enquiry`,
        replyTo: email,
        html: `<p>Hi </p> <p>Thanks for getting in touch.</p> <p>Somebody has contacted you through the website contact form.</p> <p>Email: ${email}</p> <p>Name: ${smtpParams.name}</p> <p>Phone: ${smtpParams.phone}</p> <p>Message: ${smtpParams.message}</p>`, // html body
    };
    return transporter.sendMail(mailOptions);
};

module.exports = {
    async newsletter(ctx) {
        const { email } = ctx.request.body;
        console.log(ctx);
        const result = await createNewContact({
            email,
            listIds: [18],
            attributes: {},
        });
        console.log(result);
        if (result === 400)
            return ctx.send({
                status: 400,
                msg: 'You have already subscribed to our newsletter.',
            });
        return ctx.send({
            status: 201,
            msg: 'Thank you for subscribing to my newsletter.',
        });
    },

    async send(ctx) {
        console.log(ctx);
        const { email, name, phone, message } = ctx.request.body;
        try {
            const a = await createNewContact({
                email,
                listIds: [18],
                attributes: { NAME: name, PHONE: phone },
            });
            console.log('<<<a>>>: ', a);
            const b = await sendEmail({
                templateId: 82,
                smtpParams: { message, name, phone },
                email: email,
                replyTo: { email: 'hello@mckenna.codes' }, // have to put in obj
                tags: [],
            });
            console.log('<<<b>>>: ', b);
            const c = await sendNodemailerEmail({
                smtpParams: { message, name, phone },
                email: email,
            });
            console.log('<<<c>>>: ', c);
            return ctx.send({
                status: 200,
                msg: 'I have received your enquiry and will respond ASAP 😁',
            });
        } catch (error) {
            console.log(error);
        }
    },
};
