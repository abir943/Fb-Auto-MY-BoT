module.exports = {
    name: "tid",
    execute(api, event, args) {
        const threadID = event.threadID;
        api.sendMessage(`Your Thread ID is: ${threadID}`, event.threadID, event.messageID);
    }
};
