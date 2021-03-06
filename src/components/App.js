import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Register from '../abis/Register'
import Navbar from './Navbar'
import Main from './Main'


class App extends Component {

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
    const networkData = Register.networks[networkId];
    if (networkData) {
      const register = web3.eth.Contract(Register.abi, networkData.address);
      console.log(register);
      this.setState({ profiles: register});
      this.setState({loading: false});

    } else {
      window.alert('Register Contract not deployed to detected network.')
    }
  };

  createProfile = (firstName, lastName) => {
    this.setState({loading: true});
    this.state.profiles.methods.createProfile(firstName, lastName).send({from: this.state.account, value: 10000000000000000})
        .then(receipt => {
          console.log(receipt, "Success");
          alert('Profile was added successfully')
        }).catch(err => {
      console.log(err.message, 'Error');
      if (err) {
        alert('Error. Profile was not added! Please check if profile already exists')
      }
    });
    this.setState({loading: false});
};

  getProfile = async (id) => {
    this.setState({loading: true});
    const profileDetails = await this.state.profiles.methods.getProfile(id).call();
    this.setState({profileDetails});
    this.setState({loading: false});
  };


  constructor(props) {
    super(props);
    this.state = {
      account: '',
      loading: true,
      profiles : null,
      profileDetails: null
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '500px' }}>
          { this.state.loading && <div id="loader" className="text-center mt-5"><p>Loading...</p></div>}
          <Main createProfile={this.createProfile} />

          <div className={'form-group mr-sm-2 my-5'}>
            <button className={'btn btn-secondary'} onClick={() => this.getProfile(this.state.account)}>Get Profile Details</button>
          </div>

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

export default App;