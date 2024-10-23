import Web3 from "web3";
import urlFactory from "../utility/url.js";
import env from 'dotenv'
env.config();

class ethereumModel {
    constructor() { }

    async scan(params: any) {
        try {
            const _CONTRACT_ABI: any = params.abi//JSON.parse(params.abi);
            const web3 = new Web3(new urlFactory().getURI(params.chain)); //https://rpc.ankr.com/eth
          //  console.log({ web3: await web3.eth.getBlockNumber() })
            
            let latest_block = await web3.eth.getBlockNumber();
           // console.log({ latest_block })
           // console.log({ lastBlockSynced: params.lastBlockSynced })

            if (latest_block == params.lastBlockSynced) return;

            if (!params.lastBlockSynced) params.lastBlockSynced = latest_block - 1000;

            if (params.lastBlockSynced < (latest_block - 1000)) {
                params.lastBlockSynced = latest_block - 1000
            }
           // console.log({ lastBlockSynced: params.lastBlockSynced })

            var contract = new web3.eth.Contract(_CONTRACT_ABI, params.contractAddress);

            const events = await contract.getPastEvents(
                params.name, // change if your looking for a different event
                {
                    fromBlock: params.lastBlockSynced,
                    toBlock: 'latest',
                    //  filter: { from: '0xf45ef8c74abaca5185a35deac9d43139da79be1a' },
                }
            );

            //updating contract transaction in database
            //params.lastBlockSynced = latest_block;
            params.lastSynced = new Date().getTime()
          //  console.log({name: params.name, events})
            return { events, params, latest_block,  };
        }
        catch (err) {
            return err;
        }

    }


}
export default ethereumModel; 