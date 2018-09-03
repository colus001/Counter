import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

import { getWeb3, getContract } from './contract'

class App extends Component {
  state = {
    loading: false,
    contract: null,
    count: null,
  }

  interval = null

  componentDidMount() {
    this.initiate()
  }

  initiate = async () => {
    try {
      const web3Instance = await getWeb3()
      if (!web3Instance) return console.error('error')
      const contract = await getContract(web3Instance)
      this.setState({ contract }, this.fetchCurrentCount)
    } catch(e) {
      console.error(e)
    }
  }

  fetchCurrentCount = async () => {
    const count = await this.state.contract.count()
    this.setState({ count: count.toNumber() })
  }

  fetchCurrentCountInterval = () => {
    this.interval = setInterval(async () => {
      const rawCount = await this.state.contract.count()
      const count = rawCount.toNumber()
      if (count === this.state.count) return

      clearInterval(this.interval)
      this.setState({
        count,
        loading: false,
      })
    }, 500)
  }

  handleClick = (isAdd) => async () => {
    const method = isAdd ? 'add' : 'subtract'

    const web3Instance = await getWeb3()
    const [account] = await web3Instance.eth.getAccounts()
    if (!account) alert('Please login with MetaMask first')

    try {
      const result = await this.state.contract[method].sendTransaction({ from: account })
      if (!result) throw new Error('SendTransaction result is not true')

      this.setState({ loading: true }, this.fetchCurrentCountInterval)
    } catch(e) {
      console.error(e)
      alert('Error occured while transaction')
    }
  }

  render() {
    const { contract, loading, count } = this.state
    if (!contract) {
      return (
        <div className="App">
          <h1>Loading...</h1>
        </div>
      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Counter</h1>
        </header>
        {count >= 0 && (
          <div className="Counter">
            {loading ? 'Waiting for transaction confirm...' : `Current Count: ${count}`}
          </div>
        )}
        <button className="add" onClick={this.handleClick(true)}>
          +
        </button>
        <button onClick={this.handleClick()}>
          -
        </button>
      </div>
    );
  }
}

export default App;
