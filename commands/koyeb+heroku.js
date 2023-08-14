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

const axios = require('axios');
const { tlang,cmd } = require('../lib')
const Config = require('../config')
const { redeploy , getvar , delvar , getallvar , change_env , get_deployments} = require('../lib/koyeb')

//----------------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------------------------
cmd(
  {
    pattern: "getvar",
    desc: "get desired var from koyeb.",
    filename: __filename,
    category: "misc",
  },
  async (Void,citel,text,{isCreator}) => {
       if(!isCreator) return citel.reply(tlang().owner);
       if (Config.heroku=true){
        if (!text.split(' ')[0]) return citel.reply(`Please Give me var name, ${tlang().greet}`)
        const Heroku = require("heroku-client");
        const heroku = new Heroku({
          token: Config.HEROKU.API_KEY,
        });
        let baseURI = "/apps/" + Config.HEROKU.APP_NAME;
  let h = await heroku.get(baseURI+'/config-vars')
  for (vr in h) {
  if(text.split(' ')[0]===vr) return citel.reply('Your var.\n'+vr+': '+h[vr])	
  }
       }
       if(!text) return citel.reply('Please provide key.\n_Eg: .getvar PORT_')
       let data = await getvar(text);
       return citel.reply(data)
  })
//----------------------------------------------------------------------------------------------------------------------------------------------------
cmd(
  {
    pattern: "getallvar",
    desc: "get all vars from koyeb.",
    filename: __filename,
    category: "misc",
  },
  async (Void,citel,text,{isCreator}) => {
       if(!isCreator) return citel.reply(tlang().owner);
       if (Config.heroku=true){
        const Heroku = require("heroku-client");
			const heroku = new Heroku({
				token: Config.HEROKU.API_KEY,
			});
			let baseURI = "/apps/" + Config.HEROKU.APP_NAME;
let h = await heroku.get(baseURI+'/config-vars')
let str = '*All Your Heroku Vars*\n\n'
for (vr in h) {
str+= vr+':'+h[vr]+'\n'
}
citel.reply(str)
       }
       let data = await getallvar();
       return citel.reply(data)
  })
//----------------------------------------------------------------------------------------------------------------------------------------------------
cmd(
  {
    pattern: "setvar",
    desc: "set var in koyeb.",
    filename: __filename,
    category: "misc",
  },
  async (Void,citel,text,{isCreator}) => {
       if(!isCreator) return citel.reply(tlang().owner);
       if(!text.split(':')[1]) return citel.reply('*Wrong Format.*\nPlease provide key and value.\n_Eg: .setvar THEME:SECKTOR_')
       if (Config.heroku=true){
        const Heroku = require("heroku-client");
        const heroku = new Heroku({
          token: Config.HEROKU.API_KEY,
        });
        let baseURI = "/apps/" + Config.HEROKU.APP_NAME;
        await heroku.patch(baseURI + "/config-vars", {
          body: {
                  [text.split(':')[0]]: text.split(':')[1],
          },
        });
        await citel.reply(`🟩var ${text.split(':')[0]} : ${text.split(':')[1]} has been set Successfuly.`);
       }
       let check = await get_deployments()
       if(check==='true') return citel.reply('_Please wait..._\n_Currently 2 instances are running in Koyeb,wait to stop one of them._')
       let data = await change_env(text)
       return citel.reply(data)
  })

//----------------------------------------------------------------------------------------------------------------------------------------------------
cmd(
  {
    pattern: "delvar",
    desc: "delete var from koyeb.",
    filename: __filename,
    category: "misc",
  },
  async (Void,citel,text,{isCreator}) => {
       if(!isCreator) return citel.reply(tlang().owner);
       if(!text) return citel.reply('Please provide key.\n_Eg: .delvar PORT_')
       let check = await get_deployments()
       if(check==='true') return citel.reply('_Please wait..._\n_Currently 2 instances are running in Koyeb,wait to stop one of them._')
       let data = await delvar(text)
       return citel.reply(data)
  })


