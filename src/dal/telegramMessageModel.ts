import env from 'dotenv'
import response from '../utility/response.js';
env.config();

class telegramMessageModel {
    constructor() { }

    async sendMessage(params: any) {
        try {
            console.log("teletele")
            let _channelCredentials = params._credentialsData.find((channel: any) => channel.channelName === 'telegram')
            const _tags = Object.keys(params.event.returnValues)
            const _tagValues = Object.values(params.event.returnValues)
            const _string = params.channel.text.match(/#\w+/g);
            // _tags.forEach((_tag: any, index: any) => {
            //     if (_string.includes('#' + _tag)) {
            //         params.channel.text = params.channel.text.replace('#' + _tag, _tagValues[index])
            //     }
            // });
            console.log(_channelCredentials.chatId, " tele ", _channelCredentials.botToken)
            await params._channel.postTelegram({
                botToken: _channelCredentials.botToken,
                text: params.channel.convertedText,
                chatId: _channelCredentials.chatId
            });
            return new response(200, '')
        }
        catch (error:any) {
            return new response(500, JSON.stringify(error.messge))
        }

    }


}
export default telegramMessageModel; 