import React from "react";
import Web3 from "web3";
import Navbar from "./Navbar";
import Main from "./Main";

const address = '0x006F599c0920A5b369dE668E0810e53a9F8b216D';
const abi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"lastname","type":"string"},{"indexed":false,"internalType":"string","name":"firstname","type":"string"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"uint256","name":"userId","type":"uint256"}],"name":"NewProfile","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"ProfileIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"Profiles","outputs":[{"internalType":"string","name":"lastname","type":"string"},{"internalType":"string","name":"firstname","type":"string"},{"internalType":"uint256","name":"userId","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"REGISTRATION_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"lastname","type":"string"},{"internalType":"string","name":"firstname","type":"string"}],"name":"createProfile","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getProfile","outputs":[{"components":[{"internalType":"string","name":"lastname","type":"string"},{"internalType":"string","name":"firstname","type":"string"},{"internalType":"uint256","name":"userId","type":"uint256"}],"internalType":"struct Register.Profile","name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"profileId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

class AppComponent extends React.Component {
    async UNSAFE_componentWillMount () {
        await this.loadWeb3();
        await this.loadBlockChainData();
    }

    async loadWeb3 () {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('No ethereum broswer detected. You can check out MetaMask!')
        }
    }

    async loadBlockChainData () {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({account : accounts[0]});

        const networkId = await web3.eth.net.getId();
        if (networkId === 4) {
            const register = new web3.eth.Contract(abi, address);
            this.setState({ profiles: register});
            this.setState({loading: false});

        } else {
            window.alert('Register Contract not deployed to detected network.')
        }
    }

    createProfile = (firstName, lastName) => {
        this.setState({loading: true});
        this.state.profiles.methods.createProfile(firstName, lastName).send({from: this.state.account, value: 10000000000000000})
            .then(receipt => {
                console.log(receipt, "Success");
                alert('Profile was added successfully')
            }).catch(err => {
            if (err) {
                alert(`Error. ${err.message}`)
            }
        });
        this.setState({loading: false});
    };

    getProfile = async (id) => {
        this.setState({loading: true});
        const profileDetails = await this.state.profiles.methods.getProfile(id).call();
        if (profileDetails[0] === '') {
            alert('Profile does not exist')
        } else {
            this.setState({profileDetails});
        }
        this.setState({loading: false});
    };

    constructor(props) {
        super(props);
        this.state = {
            account: '',
            profileDetails: null,
            loading: true,
            profiles: null
        }
    }

    render() {
        return (
            <div>
                <Navbar account={this.state.account} />
                <div className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
                    <Main createProfile={this.createProfile} />

                    <div className={'form-group mr-sm-2 my-5'}>
                        <button className={'btn btn-secondary'} onClick={() => this.getProfile(this.state.account)}>Get Profile Details</button>
                    </div>
                    { this.state.loading && <div id="loader" className="text-center mt-5"><p>Loading...</p></div>}
                    {this.state.profileDetails &&
                    <div>
                        <h3>Profile Details</h3>
                        <h3>First Name: {this.state.profileDetails[0]}</h3>
                        <h3>Last Name: {this.state.profileDetails[1]}</h3>
                        <h3>ID: {this.state.profileDetails[2].toString()}</h3>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

export default AppComponent;