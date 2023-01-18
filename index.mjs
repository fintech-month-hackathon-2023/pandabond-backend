import {ethers, utils} from 'ethers';
import dotenv from "dotenv";
dotenv.config()

const address = "0x0dC89077Ca53160dce0F45c00273ECC9b1C99d72"

const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sbt",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "activateSBT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "companyMetadata",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "deactivateSBT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isRegisteredCompany",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "tier",
          "type": "uint8"
        }
      ],
      "name": "modifyTier",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "hashedIdentity",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "tier",
          "type": "uint8"
        }
      ],
      "name": "registerCompany",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "sbtId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "registeredCompanies",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "hashedIdentity",
          "type": "bytes32"
        },
        {
          "internalType": "uint8",
          "name": "tier",
          "type": "uint8"
        }
      ],
      "name": "reissueSBT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "sbtId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "soulBoundToken",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

const delay = ms => new Promise(res => setTimeout(res, ms));

async function register(account, name, unhashed,tier) {
    const goerliAPIKey = process.env.ALCHEMY_API_KEY;
    const goerliProvider = new ethers.providers.AlchemyProvider("goerli", goerliAPIKey);
    const signer = new ethers.Wallet(process.env.PVT_KEY, goerliProvider);
    console.log("Signer: " + signer.address)
    const hashed = utils.keccak256(utils.toUtf8Bytes(unhashed));

    const contract = new ethers.Contract(address, abi, goerliProvider);
    console.log("Contract: " + contract.address)
    const contractWithSigner = contract.connect(signer);

    await contractWithSigner.registerCompany(account, name, hashed, Number(tier));

    let issued = await contractWithSigner.isRegisteredCompany(account);
    while(!issued){
        console.log("issuing...");
        await delay(5000);
        issued = await contractWithSigner.isRegisteredCompany(account);
    }
    console.log("issued!");
    

    return true;

}

export const handler = async(event) => {
    // TODO implement
    const {account, tier, unhashed, name } = event;
    const name1 = name.replace( '+', ' ' );
    let issued=true;
    if(account!=='test') {
      issued = await register(account,name1,unhashed,tier);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            "account":account,
            "name":name1,
            "unhashed":unhashed,
            "tier":tier,
            "issued":issued
        }),
    };
    return response;
};
