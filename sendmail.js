var spawn = require("child_process").spawn;

module.exports = function(server) {
    server.dispatcher("sendmail", (contact, message) => {
        var sendmail,
            result,
            email;

        email = `Subject:${message.title}\n`;
        email += `To:${contact.email}\n\n${message.body}`;

        sendmail = spawn("sendmail", [contact.email]);
        sendmail.stdout.on("data", (data) => result += String(data));
        sendmail.stderr.on("data", (data) => result += String(data));
        sendmail.on("error", (err) => server.error(err));
        sendmail.on("close", code => {
            if (code === 0) {
                server.log("sendmail:sent to", contact.email);
            } else {
                server.error("sendmail:failed");
                server.error(result);
            }
        });

        sendmail.stdin.write(email);
        sendmail.stdin.end();
    });
};
