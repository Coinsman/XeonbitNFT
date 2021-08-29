import {pinJSONToIPFS} from './pinata.js'
//import Web3 from 'web3'
//const web3 = new Web3('ws://localhost:8546');
require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey); 


const contractABI = require('../abi/contract-abi.json')
// Contract Address of NFT belong to current 1 owner
// We need to find the way that everyone can trigger
// contract for different collections
const contractAddress = "0xcf9E9b3B172a54c4E9348e0D549aCA2aB3A41EB1";
// create mintERC721 contract bytecode
const bytecode = require ('../abi/bytecode-mint721.json')
//abi for ERC checking balance
const minABI = require('../abi/contract-minabi.json')
// Contract address of ERC20 Token
const ERC20contractAddress = "0xff795577d9ac8bd7d90ee22b6c1703490b6512fd";
const ERC20contract = new web3.eth.Contract(minABI,ERC20contractAddress);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const ethbalanceArray = await web3.eth.getBalance(addressArray[0]);
      const ercbalanceArray = await ERC20contract.methods.balanceOf(addressArray[0]).call();
      const obj = {
        status: "👆🏽 Write a message in the text-field above.",
        address: addressArray[0],
        ethbalance: web3.utils.fromWei(ethbalanceArray,'ether'),
        ercbalance: web3.utils.fromWei(ercbalanceArray,'ether'),
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async(url, name, description) => {
  //error handling
    if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) { 
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        }
    }
  
    //make metadata
    //const metadata = new Object();
    const metadata = {};
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    //pinata pin request
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    } 
    const tokenURI = pinataResponse.pinataUrl;  

    //load smart contract
    //if (contractAddress!=""){
      window.contract = await new web3.eth.Contract(contractABI, contractAddress);//loadContract();
    //}
    //else
    //{
      //initate create new smartcontract for this address
      //create new collection contract
    //}

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress, // Required except during contract publications.
        from: window.ethereum.selectedAddress, // must match user's active address.
        'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract 
    };
  
    //sign transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://kovan.etherscan.io/tx/" + txHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        const ethbalanceArray = await web3.eth.getBalance(addressArray[0]);
        const ercbalanceArray = await ERC20contract.methods.balanceOf(addressArray[0]).call();
        return {
          address: addressArray[0],
          ethbalance: web3.utils.fromWei(ethbalanceArray,'ether'),
          ercbalance: web3.utils.fromWei(ercbalanceArray,'ether'),
          status: "👆🏽 Write a message in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "😥 " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a target="_blank" rel="noreferrer" href={`https://metamask.io/download.html`}>
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};