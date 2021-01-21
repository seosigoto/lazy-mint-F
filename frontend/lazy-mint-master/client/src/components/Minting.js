import React, {Component} from 'react'
import * as ethers from 'ethers'
import { Link, Redirect } from 'react-router-dom'
import LazyABI from './../utils/Lazy.json'
import { notify } from 'react-notify-toast'
import Spinner from './Spinner'
import { API_URL } from '../config'

export default class Minting extends Component {
  connectWalletAction = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }
  
      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
  
      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      this.setState({currentAccount: accounts[0]});
    } catch (error) {
      console.log(error);
    }
  };  

  loadContract = async () => {
    return await new ethers.Contract("0xACBD6Fab4cAbC4cA224e9319ad29Bc1D743ce109", LazyABI.abi)
  }

  checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the ethereum object', ethereum);
  
        /*
         * Check if we're authorized to access the user's wallet
         */
        const accounts = await ethereum.request({ method: 'eth_accounts' });
  
        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          this.setState({currentAccount: account});
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  mintAction = async () => {
    const tokenURI = "https://gateway.pinata.cloud/ipfs/QmYi591VSNn1wPmRDDN4BmGqGGpPdbc2GuBJGqvxYq2EHZ/2.json";

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const hash = await ethers.utils.id(tokenURI);
    const sig = await signer.signMessage(ethers.utils.arrayify(hash));
    console.log(sig);
    const nftContract = await new ethers.Contract("0xACBD6Fab4cAbC4cA224e9319ad29Bc1D743ce109", LazyABI.abi, signer);
    const tx = await nftContract.mintToken(tokenURI, sig);
    console.log(tx)
    // await tx.wait();
  };

  // A bit of state to give the user feedback while their email
  // address is being confirmed on the User model on the server.
  state = {
    confirmed: true,
    currentAccount: null
  }

  // When the component mounts the mongo id for the user is pulled  from the 
  // params in React Router. This id is then sent to the server to confirm that 
  // the user has clicked on the link in the email. The link in the email will 
  // look something like this: 
  // 
  // http://localhost:3000/confirm/5c40d7607d259400989a9d42
  // 
  // where 5c40d...a9d42 is the unique id created by Mongo
  componentDidMount = () => {
    this.checkIfWalletIsConnected();
    const confirmed = localStorage.getItem("emailConfirm");
    if (confirmed !== null && confirmed === 'true') {
      this.setState({ confirmed: true })
    } else {
      this.setState({ confirmed: false })
    }
  }

  // While the email address is being confirmed on the server a spinner is 
  // shown that gives visual feedback. Once the email has been confirmed the 
  // spinner is stopped and turned into a button that takes the user back to the 
  // <Landing > component so they can confirm another email address.
  render = () => {
    return (
      <div className='mint-nft'>
        {this.state.confirmed === true
          ? (
            this.state.currentAccount === null ?
            <button onClick={this.connectWalletAction}>
              Connect Wallet
            </button>
            :
            <button onClick={this.mintAction}>
              Mint ONE Token
            </button>
          )
          : <Redirect to="/" />
        }
      </div>
      )
    }
}