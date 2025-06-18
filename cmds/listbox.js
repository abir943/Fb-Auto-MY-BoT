module.exports = {
  name: 'listbox',
  aliases: ['listthreads', 'groups'],
  description: 'List all group chats the bot is in, sorted by member count.',
  usage: '[Prefix]listbox',
  usePrefix: true,
  author: 'Aminulsordar',
  version: '1.0.1',

  execute: async (api, event, args, prefix) => {
    const { threadID, messageID } = event;

    try {
      const inbox = await api.getThreadList(100, null, ['INBOX']);
      const groupThreads = inbox.filter(thread => thread.isGroup && thread.isSubscribed);

      const groupData = [];

      for (const thread of groupThreads) {
        try {
          const info = await api.getThreadInfo(thread.threadID);
          const memberCount = info.participantIDs?.length || info.userInfo?.length || 0;

          groupData.push({
            id: thread.threadID,
            name: thread.name || 'Unnamed Group',
            members: memberCount
          });
        } catch (err) {
          console.warn(`⚠️ Skipped group ${thread.threadID} due to error:`, err.message);
        }
      }

      const sortedGroups = groupData.sort((a, b) => b.members - a.members);

      let message = '📋 Group List (Sorted by Members):\n\n';
      sortedGroups.forEach((group, index) => {
        message += `${index + 1}. ${group.name.slice(0, 50)}\n🧩 TID: ${group.id}\n👥 Members: ${group.members}\n\n`;
      });

      api.sendMessage(message.trim(), threadID, messageID);
    } catch (error) {
      console.error('❌ Error in listbox command:', error);
      api.sendMessage('⚠️ An error occurred while fetching group list.', threadID, messageID);
    }
  }
};
