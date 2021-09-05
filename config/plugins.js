module.exports = ({ env }) => ({
    upload: {
        provider: 'aws-s3',
        providerOptions: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET'),
            region: env('AWS_REGION'),
            params: {
                Bucket: env('AWS_BUCKET_NAME'),
            },
            logger: console, // Only if you want to `stdout` logs
        },
    },
    // email: {
    //     provider: 'sendinblue',
    //     providerOptions: {
    //         sendinblue_api_key: process.env.STRAPI_API_KEY,
    //         sendinblue_default_replyto: 'hello@keeny.codes',
    //         sendinblue_default_from: 'hello@keeny.code',
    //         sendinblue_default_from_name: 'Keeny Codes',
    //     },
    // },
});
