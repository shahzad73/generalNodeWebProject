"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */

 // Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;



var contractabi = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "mint",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "from",
          "type": "address"
        },
        {
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "burnFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "registry",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "isOwner",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "addMinter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "renounceMinter",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "spender",
          "type": "address"
        },
        {
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isMinter",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "owner",
          "type": "address"
        },
        {
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_registry",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "reason",
          "type": "uint8"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "CheckStatus",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "account",
          "type": "address"
        }
      ],
      "name": "MinterAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "account",
          "type": "address"
        }
      ],
      "name": "MinterRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "forceTransfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "_service",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ];
//var contract_address = "0x7Cf01fbAd42d2FEa2b0D697aa7Ee022801cD2154";  //Digi
var contract_address = "0xF2A6143Bf60885d2044a744943d09ca1C05EF66F";    //DIgiUSD
var web3Address = "https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8";


const swapcontractabi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"originator","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"Closed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"originator","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"Expired","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"originator","type":"address"},{"indexed":false,"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"Opened","type":"event"},{"inputs":[{"internalType":"address","name":"originator","type":"address"},{"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"close","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"originator","type":"address"},{"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"expire","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"originator","type":"address"},{"internalType":"uint256","name":"swapNumber","type":"uint256"}],"name":"getSwapData","outputs":[{"components":[{"internalType":"address","name":"executor","type":"address"},{"internalType":"address","name":"openingToken","type":"address"},{"internalType":"uint256","name":"tokensToOpen","type":"uint256"},{"internalType":"address","name":"closingToken","type":"address"},{"internalType":"uint256","name":"tokensToClose","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"}],"internalType":"struct ERC20TokenSwapper.Swap","name":"","type":"tuple"},{"internalType":"uint256","name":"swapState","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"swapNumber","type":"uint256"},{"internalType":"address","name":"_executor","type":"address"},{"internalType":"address","name":"_openingToken","type":"address"},{"internalType":"uint256","name":"_tokensToOpen","type":"uint256"},{"internalType":"address","name":"_closingToken","type":"address"},{"internalType":"uint256","name":"_tokensToClose","type":"uint256"},{"internalType":"uint256","name":"_expiry","type":"uint256"}],"name":"open","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];

var swapcontract_address = "0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9";



//https://kovan.infura.io/v3/fe41724da6f24b76a782f376b2698ee8



/**
 * Setup the orchestra
 */
function init() {
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Fortmatic is", Fortmatic);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Check that the web page is run in a secure context,
  // as otherwise MetaMask won't be available
  if(location.protocol !== 'https:') {
    // https://ethereum.stackexchange.com/a/62217/620
    const alert = document.querySelector("#alert-error-https");
    alert.style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    return;
  }

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
      }
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        // Mikko's TESTNET api key
        key: "pk_test_391E26A3B43A3350"
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
    disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
  });

  console.log("Web3Modal instance is", web3Modal);
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  const web3 = new Web3(provider);

  console.log("Web3 instance is", web3);
    
  // Get connected chain id from Ethereum node
  const chainId = await web3.eth.getChainId();
  // Load chain information over an HTTP API
  const chainData = evmChains.getChain(chainId);
  document.querySelector("#network-name").textContent = chainData.name;

  // Get list of accounts of the connected wallet
  const accounts = await web3.eth.getAccounts();
    
  
    
  // MetaMask does not give you all accounts, only the selected account
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
    

  document.querySelector("#selected-account").textContent = selectedAccount;

  // Get a handl
  const template = document.querySelector("#template-balance");
  const accountContainer = document.querySelector("#accounts");

  // Purge UI elements any previously loaded accounts
  accountContainer.innerHTML = '';

  // Go through all accounts and get their ETH balance
  const rowResolvers = accounts.map(async (address) => {
        const balance = await web3.eth.getBalance(address);
        // ethBalance is a BigNumber instance
        // https://github.com/indutny/bn.js/
        const ethBalance = web3.utils.fromWei(balance, "ether");
        const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
        // Fill in the templated row and put in the document
        const clone = template.content.cloneNode(true);
        clone.querySelector(".address").textContent = address;
        clone.querySelector(".balance").textContent = humanFriendlyBalance;
        accountContainer.appendChild(clone);
  });

  // Because rendering account does its own RPC commucation
  // with Ethereum node, we do not want to display any results
  // until data for all accounts is loaded
  await Promise.all(rowResolvers);

  // Display fully loaded UI for wallet data
  document.querySelector("#prepare").style.display = "none";
  document.querySelector("#connected").style.display = "block";
}


/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  document.querySelector("#connected").style.display = "none";
  document.querySelector("#prepare").style.display = "block";

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
  } catch(e) {
    console.log("Could not get a wallet connection", e);
    return;
  }

  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = null;
  }

  selectedAccount = null;

  // Set the UI back to the initial state
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}

/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});






async function buttonclicked() {

      //provider = await web3Modal.connect();

      const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();


   /*web3.eth.getAccounts(function(err, accounts){
      if (err != null) {
         alert(err)
      }
      else if (accounts.length === 0) {
         alert('MetaMask is locked')
      }
      else {
         alert('MetaMask is unlocked')
      }
   });*/    
    
    
      $("#StatusOfCall").html("Getting Transaction Count")
      web3.eth.getTransactionCount(accounts[0], 'pending').then(obj=> {
            $("#StatusOfCall").html("Transaction Count " + obj)          
            
                        const contract = new web3.eth.Contract(contractabi, contract_address);
          
						// creating raw tranaction
						const rawTransaction = {
							from: accounts[0],
							gasPrice: web3.utils.toHex(120 * 1e9),
							gasLimit: 93399 + 1000000,
							to: contract_address,
							value: 0x0,
                            data: contract.methods.approve("0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9", 550).encodeABI(),
							nonce: web3.utils.toHex( obj ),
						};


						web3.eth.sendTransaction( rawTransaction ).then ( obj => {
                                if (err) {
                                     alert(err.toString())
                                } else {

                                }
						});
          
      })
    
    
//        const web3 = new Web3(new Web3.providers.HttpProvider(web3Address));

/*    
        web3.eth.net.isListening().then(() => {
            const contract = new web3.eth.Contract(contractabi, contract_address);

            contract.methods.balanceOf("0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9").call().then((balance) => {
                alert(balance.toString());
            }).catch((err) => {
                reject({ code: '0', message: `${err.message}. Error calling balanceOf method in getAccountBalance` });
            });

        }).catch(() => {
            reject({ code: '0', message: 'Ethereum network connection error in getAccountBalance' });
        });
*/    
    
/*    
        web3.eth.net.isListening().then(() => {
            const contract = new web3.eth.Contract(contractabi, contract_address);
            alert("............")
            contract.methods.allowance("0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9", "0x3cb6df9845af79ab7c2af9530da0b046bacb6cf9").call().then((balance) => {
                alert(balance.toString());
            }).catch((err) => {
                alert( err )
            });

        }).catch(() => {
            alert("some error")
        });    
*/    

    
}

async function openSwapOperation() {

      const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();
    
      $("#StatusOfCall").html("Getting Transaction Count")
      web3.eth.getTransactionCount(accounts[0], 'pending').then(obj=> {
            $("#StatusOfCall").html("Transaction Count " + obj)          
            
                        const contract = new web3.eth.Contract(swapcontractabi, swapcontract_address);
          
                        const _swapNumber = web3.utils.toHex( 11564 );
                        const _executor = "0xcD063145Fcd75aca7C2c3CaD2675B4328dbd8f83";     //this is the user who will call close or other party
                        const _openingToken = "0x7Cf01fbAd42d2FEa2b0D697aa7Ee022801cD2154";
                        const _tokensToOpen = web3.utils.toHex( 100 );
                        const _closingToken = "0xF2A6143Bf60885d2044a744943d09ca1C05EF66F";
                        const _tokensToClose = web3.utils.toHex( 550 );
                        const _expiry = web3.utils.toHex( 1644733968 );
                    

                            // creating raw tranaction
                            const rawTransaction = {
                                from: accounts[0],
                                gasPrice: web3.utils.toHex(120 * 1e9),
                                gasLimit: 93399 + 1000000,
                                to: swapcontract_address,
                                value: 0x0,
                                data: contract.methods.open( _swapNumber, _executor,  _openingToken,  _tokensToOpen,  _closingToken,  _tokensToClose,  _expiry ).encodeABI(),
                                nonce: web3.utils.toHex( obj ),
                            };

						web3.eth.sendTransaction( rawTransaction ).then ( obj => {
                                if (err) {
                                     alert(err.toString())
                                } else {

                                }
						});
          
      })
    
    
    
    
    
}

async function closeSwapOperation() {
    
      const web3 = new Web3(provider);

      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();
    
      $("#StatusOfCall").html("Getting Transaction Count")
      web3.eth.getTransactionCount(accounts[0], 'pending').then(obj=> {
            $("#StatusOfCall").html("Transaction Count " + obj)          
            
                        const contract = new web3.eth.Contract(swapcontractabi, swapcontract_address);
          
                            const _executor = "0xeA1466402fC4b0a0b4959E4cd040e79a7309B3c9";
                            const _swapNumber = web3.utils.toHex( 11564 );                    
                            
                            // creating raw tranaction
                            const rawTransaction = {
                                from: accounts[0],
                                gasPrice: web3.utils.toHex(120 * 1e9),
                                gasLimit: 93399 + 1000000,
                                to: swapcontract_address,
                                value: 0x0,
                                data: contract.methods.close(_executor, _swapNumber ).encodeABI(),
                                nonce: web3.utils.toHex( obj ),
                            };

						web3.eth.sendTransaction( rawTransaction ).then ( obj => {
                                if (err) {
                                     alert(err.toString())
                                } else {

                                }
						});
          
      })
    
        
    
}