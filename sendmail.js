var spawn = require("child_process").spawn;

module.exports = function(server) {
    server.sender(true, "sendmail", (contacts, message) => {
        var sendmail,
            result,
            to = contacts.map(c => c.email).filter(e => e).join(","),
            email;

        email = `Subject:${message.title}\nTo:${to}\n\n${message.body}`;

        sendmail = spawn("sendmail", [to]);
        sendmail.stdout.on("data", (data) => result += String(data));
        sendmail.on("error", (err) => server.error(err));
        sendmail.on("close", code => {
            if (code === 0) {
                server.log("sendmail:sent to", to);
            } else {
                server.error("sendmail:failed");
                server.error(result);
            }
        });

        sendmail.stdin.write(email);
        sendmail.stdin.end();
    });
};
