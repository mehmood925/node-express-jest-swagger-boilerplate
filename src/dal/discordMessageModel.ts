import env from 'dotenv'
import response from '../utility/response.js';
env.config();

class discordMessageModel {
    constructor() { }

    async sendMessage(params: any) {
        try {
            let _channelCredentials = params._credentialsData.find((channel: any) => channel.channelName === 'discord')
            const _tags = Object.keys(params.event.returnValues)
            const _tagValues = Object.values(params.event.returnValues)
            const _string = params.channel.text.match(/#\w+/g);
            // _tags.forEach((_tag: any, index: any) => {
            //     if (_string.includes('#' + _tag)) {
            //         params.channel.text = params.channel.text.replace('#' + _tag, _tagValues[index])
            //     }
            // });
            console.log("dis")
            await params._channel.postDiscord({
                id: _channelCredentials.webhookURL,
                text: params.channel.convertedText,
                username: _channelCredentials.username
            });
            return new response(200, '')
        }
        catch (error: any) {
            return new response(500, JSON.stringify(error.messge))
        }

    }


}
export default discordMessageModel; 