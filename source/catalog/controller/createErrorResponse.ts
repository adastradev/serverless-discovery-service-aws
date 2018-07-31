export default function (statusCode, message) {
    return {
        body: message || 'Incorrect id',
        headers: { 'Content-Type': 'text/plain' },
        statusCode: statusCode || 501
    };
}
