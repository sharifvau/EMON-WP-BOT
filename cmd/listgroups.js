module.exports = {
  config: { name: "listgroups", aliases:["groups"], permission: 2, prefix: true, categorie: "Owner", description: "List all groups bot is in.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const all = await api.groupFetchAllParticipating();
    const arr = Object.values(all).map((g,i) => `${i+1}. ${g.subject} (${g.participants.length})`).join("\n");
    api.sendMessage(event.threadId, { text: `Groups (${Object.keys(all).length}):\n${arr}` });
  }
};
