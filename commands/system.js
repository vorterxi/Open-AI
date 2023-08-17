/**
 Copyright (C) 2023.
 Licensed under the  GPL-3.0 License;
 You may not use this file except in compliance with the License.
 It is supplied in the hope that it may be useful.
 * @project_name : ᴏᴘᴇɴ ᴀⁱ ♕
 * @author : 𝐌𝐚𝐡𝐞𝐫 𝐙𝐮𝐛𝐚𝐢𝐫 ♕ <https://github.com/Mehar-Zubair>
 * @description : ᴏᴘᴇɴ ᴀⁱ ♕,A Multi-functional whatsapp bot.
 * @version 1.0.3 
 **/


const { addnote,cmd, sck1, delnote, allnotes, delallnote, tlang,fetchJson, botpic, runtime, prefix, Config ,alive  } = require('../lib')
const {TelegraPh} = require('../lib/scraper')
const util = require('util');
const fs = require('fs-extra');
const axios = require('axios')
const fetch = require('node-fetch');


//---------------------------------------------------------------------------
cmd({
    pattern: "rmbg",
    alias : ['removebg'],
    category: "misc",
    filename: __filename,
    desc: "Remove image Background."
},
async(Void, citel, text) => {
    if (!citel.quoted) return await citel.reply(`*ʀᴇᴘʟʏ ᴀɴʏ ɪᴍᴀɢᴇ ᴛᴏ ʀᴇᴍᴏᴠᴇ ʙᴀᴄᴋɢʀᴏᴜɴᴅ*`)
    let mime = citel.quoted.mtype
    if(mime !='imageMessage' ) return await citel.reply("ᴘʟᴇᴀsᴇ, ʀᴇᴘʟʏ ᴛᴏ ᴀɴ ɪᴍᴀɢᴇ/ᴠɪᴅᴇᴏ")
    let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
    let anu = await TelegraPh(media);
    try { await fs.unlinkSync(media); } catch (error) {}            
    const formData = {  image_url: anu, size: 'auto', };
    axios.post("https://api.remove.bg/v1.0/removebg", formData, { headers: { 'X-Api-Key': Config.REMOVE_BG_KEY,  }, responseType: 'arraybuffer',})
      .then(response => {
        console.log("sending removebg image...!")
        const imageData = Buffer.from(response.data, 'binary');                
        return citel.reply(imageData, {caption:Config.caption},"image")              
      })
      .catch(error => {   return citel.reply(`*ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴠᴀʟɪᴅ ʀᴇᴍᴏᴠᴇʙɢ ᴋᴇʏ*\n\n Gᴇᴛ ʀᴇᴍᴏᴠᴇʙɢ ᴀᴘɪ ᴋᴇʏ ғʀᴏᴍ ʀᴇᴍᴏᴠᴇ.ʙɢ\n ᴛʜᴇɴ ᴘᴜᴛ ɪᴛ ɪɴ ᴠᴀʀ "REMOVE_BG_KEY"`);  });
    
})
//-----------------------------------------------------------------------------
cmd({
            pattern: "addnote",
            category: "owner",
            desc: "Adds a note on db.",
            filename: __filename
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply(tlang().owner)
            if (!text) return citel.reply("ᴘʟᴇᴀsᴇ ɢɪᴠᴇ ᴍᴇ ᴀ ᴛᴇxᴛ ")
            await addnote(text)
            return citel.reply(`ɴᴇᴡ ɴᴏᴛᴇ ${text} ᴀᴅᴅᴇᴅ ɪɴ ᴍᴏɴɢᴏᴅʙ.`)

        }
    )
 
    //---------------------------------------------------------------------------
cmd({
            pattern: "qr",
            category: "owner",
            filename: __filename,
            desc: "Qr code to scan and get your session id."
        },
        async(Void, citel, text, {isCreator}) => {
            if (!isCreator) return citel.reply(tlang().owner)
            if (text) {
                let h = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${text}`)
                await Void.sendMessage(citel.chat, { image: h })
                return
            }
            let buttonMessaged = {
                image: { url: 'https://citel-x.herokuapp.com/session' },
                caption: `*sᴄᴀɴ ǫʀ ᴡɪᴛʜɪɴ 15 sᴇᴄᴏɴᴅs*\nʏᴏᴜ'ʟʟ ɢᴇᴛ sᴇssɪᴏɴ ɪᴅ ɪɴ ʏᴏᴜʀ ʟᴏɢ ɴᴜᴍʙᴇʀ.`,
                footer: ` Session`,
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: 'sɪɢᴍᴀ ᴹᴰ Session',
                        body: 'Get you Session ID',
                        thumbnail: log0,
                        mediaType: 2,
                        mediaUrl: ``,
                        sourceUrl: ``,
                    },

                },

            };
            await Void.sendMessage(citel.chat, buttonMessaged, {
                quoted: citel,

            });
            await sleep(20 * 1000)
            return citel.reply('ʏᴏᴜʀ sᴇssɪᴏɴ ɪs ᴏᴠᴇʀ ɴᴏᴡ.')


        }
    )
    //---------------------------------------------------------------------------
if(Config.WORKTYPE != 'private')
cmd({
            pattern: "unban",
            category: "misc",
            filename: __filename,
            desc: "Unbans banned user (from using bot)."
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply("ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ɪs ᴏɴʟʏ ғᴏʀ ᴍʏ ᴏᴡɴᴇʀ 👑")
            try {
                let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
                if (!users) return citel.reply("ᴘʟᴇᴀsᴇ ᴍᴇɴᴛɪᴏɴ ᴀɴʏ ᴜsᴇʀ.")
                let pushnamer = Void.getName(users);
                sck1.findOne({ id: users }).then(async(usr) => {
                    if (!usr) {
                        console.log(usr.ban)
                        return citel.reply(`${pushnamer} ɪs ᴜɴʙᴀɴɴᴇᴅ.`)
                    } else {
                        console.log(usr.ban)
                        if (usr.ban !== "true") return citel.reply(`${usr.name} ɪs ᴀʟʀᴇᴀᴅʏ ᴜɴʙᴀɴɴᴇᴅ.`)
                        await sck1.updateOne({ id: users }, { ban: "false" })
                        return citel.reply(`${usr.name} ɪs ғʀᴇᴇ ᴀs ᴀ ʙɪʀᴅ ɴᴏᴡ`)
                    }
                })
            } catch {
                return citel.reply("ᴘʟᴇᴀsᴇ ᴍᴇɴᴛɪᴏɴ ᴀɴʏ ᴜsᴇʀ.")
            }


        }
    )
    //---------------------------------------------------------------------------
    cmd({
        pattern: "url",
        alias : ['createurl','tourl'],
        category: "misc",
        filename: __filename,
        desc: "image to url."
    },
    async(Void, citel, text) => {
        if (!citel.quoted) return await citel.reply(`*ʀᴇᴘʟʏ ᴛᴏ ᴀɴʏ ɪᴍᴀɢᴇ/ᴠɪᴅᴇᴏ ᴛᴏ ɢᴇᴛ ᴜʀʟ*`)
        let mime = citel.quoted.mtype
        if(mime !='videoMessage' && mime !='imageMessage' ) return await citel.reply("ʀᴇᴘʟʏ ᴛᴏ ᴀɴʏ ɪᴍᴀɢᴇ/ᴠɪᴅᴇᴏ")
        let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        let anu = await TelegraPh(media);
        await citel.reply('ʜᴇʀᴇ ɪs ᴜʀʟ ᴏғ ʏᴏᴜʀ ᴍᴇᴅɪᴀ.\n'+util.format(anu));
        return await fs.unlinkSync(media);
    })

    //---------------------------------------------------------------------------
//---------------------------------------------------------------------------
cmd({
    pattern: "trt",
    alias :['translate'],
    category: "misc",
    filename: __filename,
    desc: "Translate\'s given text in desird language."
},
async(Void, citel, text) => {
    if(!text && !citel.quoted) return await citel.reply(`*ᴘʟᴇᴀsᴇ ɢɪᴠᴇ ᴍᴇ ᴛᴇxᴛ. ᴇxᴀᴍᴘʟᴇ: ${prefix}ᴛʀᴛ ᴜʀᴅᴜ ᴡʜᴏ ᴀʀᴇ ʏᴏᴜ*`);
    const translatte = require("translatte");
    let lang = text ? text.split(" ")[0].toLowerCase() : 'en';
    if (!citel.quoted)  { text = text.replace( lang , "");  }
    else { text = citel.quoted.text; }
    var whole = await translatte(text, { from:"auto",  to: lang , });
    if ("text" in whole) { return await citel.reply('*ᴛʀᴀɴsʟᴀᴛᴇᴅ ᴛᴇxᴛ:*\n'+whole.text); }
}
)
    //---------------------------------------------------------------------------
cmd({
            pattern: "shell",
            category: "owner",
            filename: __filename,
            desc: "Runs command in Heroku(server) shell."
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply(tlang().owner)
            const { exec } = require("child_process")
            exec(text, (err, stdout) => {
                if (err) return citel.reply(`----${tlang().title}----\n\n` + err)
                if (stdout) {
                    return citel.reply(`----${tlang().title}----\n\n` + stdout)
                }
            })
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "eval",
            category: "owner",
            filename: __filename,
            desc: "Runs js code on node server."
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return
            try {
                let resultTest = eval('const a = async()=>{\n' + text + '\n}\na()');
                if (typeof resultTest === "object")
                    citel.reply(JSON.stringify(resultTest));
                else citel.reply(resultTest.toString());
            } catch (err) {
                return  citel.reply(err.toString());
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "delnote",
            category: "owner",
            filename: __filename,
            desc: "Deletes note from db."
        },
        async(Void, citel, text,{ isCreator }) => {
            const { tlang } = require('../lib/scraper')
            if (!isCreator) return citel.reply(tlang().owner)
            await delnote(text.split(" ")[0])
             return citel.reply(`Id: ${text.split(" ")[0]}\'s ɴᴏᴛᴇ ʜᴀs ʙᴇᴇɴ ᴅᴇʟᴇᴛᴇᴅ ғʀᴏᴍ ᴍᴏɴɢᴏᴅʙ.`)

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "delallnotes",
            category: "owner",
            filename: __filename,
            desc: "Deletes all notes from db."
        },
        async(Void, citel, text, isCreator) => {
            const { tlang } = require('../lib/scraper')
            if (!isCreator) return citel.reply(tlang().owner)
            await delallnote()
             return citel.reply(`ᴀʟʟ ɴᴏᴛᴇs ᴅᴇʟᴇᴛᴇᴅ ғʀᴏᴍ ᴍᴏɴɢᴏᴅʙ.`)

        }
    )
    //---------------------------------------------------------------------------
if(Config.WORKTYPE != 'private')
cmd({
            pattern: "ban",
            category: "owner",
            filename: __filename,
            desc: "Bans user from using bot."
        },
        async(Void, citel, text,{ isCreator}) => {
            if (!isCreator) return citel.reply(tlang().owner)
            try {
                let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
                if (!users) return citel.reply(`ᴘʟᴇᴀsᴇ ᴍᴇɴᴛɪᴏɴ ᴀɴʏ ᴜsᴇʀ. ${tlang().greet}.`)
                let pushnamer = Void.getName(users);
                sck1.findOne({ id: users }).then(async(usr) => {
                    if (!usr) {
                        await new sck1({ id: users, ban: "true" }).save()
                        return citel.reply(`ʙᴀɴɴᴇᴅ ${usr.name} ғʀᴏᴍ ᴜsɪɴɢ ᴄᴏᴍᴍᴀɴᴅs.`)
                    } else {
                        if (usr.ban == "true") return citel.reply(`${pushnamer} ɪs ᴀʟʀᴇᴀᴅʏ ʙᴀɴɴᴇᴅ ғʀᴏᴍ ᴜsɪɴɢ ᴄᴏᴍᴍᴀɴᴅs`)
                        await sck1.updateOne({ id: users }, { ban: "true" })
                        return citel.reply(`sᴜᴄᴄᴇssғᴜʟʟʏ ʙᴀɴɴᴇᴅ ${usr.name} ғʀᴏᴍ ᴜsɪɴɢ ᴄᴏᴍᴍᴀɴᴅs.`)
                    }
                })
            } catch (e) {
                console.log(e)
                return citel.reply("ᴘʟᴇᴀsᴇ ᴍᴇɴᴛɪᴏɴ ᴀɴʏ ᴜsᴇʀ. ")
            }


        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "alive",
            category: "general",
            filename: __filename,
            desc: "is bot alive??"
        },
        async(Void, citel, text, isAdmins) => {
            let alivemessage = Config.ALIVE_MESSAGE || `*ᴀ ʙᴏᴛ ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴍᴀʜᴇʀ ᴢᴜʙᴀɪʀ*`
            const alivtxt = `┏━━⟪⟪ 🅼♥︎❚❚♥︎🆉 ⟫━⦿\n┃✗ *•ʜᴇʟʟᴏ• ${citel.pushName}*
┃✗ *•ᴛʜɪs ɪs•*  ${Config.botname}
${alivemessage}

┃✗ •ᴘʀᴇғɪx• *${prefix}*
┃✗ *•ᴜᴘᴛɪᴍᴇ•* ${runtime(process.uptime())}
┃✗ *•ᴠᴇʀsɪᴏɴ•* sɪɢᴍᴀ
┃✗ *•ʙʀᴀɴᴄʜ•* ${Config.BRANCH}
┃✗ •ᴅᴇᴠᴇʟᴏᴘᴇʀ• ᴍ ᴢᴜʙᴀɪʀ ♕
┗━━━━━━━━━━⦿
`;
            let aliveMessage = {
                image: {
                    url: await botpic(),
                },
                caption: alivtxt,
                footer: tlang().footer,
                headerType: 4,
            };
             return Void.sendMessage(citel.chat, aliveMessage, {
                quoted: citel,
            });

        

        }
    )
    //---------------------------------------------------------------------------
cmd({
        pattern: "allnotes",
        category: "owner",
        filename: __filename,
        desc: "Shows list of all notes."
    },
    async(Void, citel, text,{ isCreator }) => {
        const { tlang } = require('../lib')
        if (!isCreator) return citel.reply(tlang().owner)
        const note_store = new Array()
        let leadtext = `ᴀʟʟ ᴀᴠᴀɪʟᴀʙʟᴇ ɴᴏᴛᴇs ᴀʀᴇ:-\n\n`
        leadtext += await allnotes()
        return citel.reply(leadtext)

    }
)
