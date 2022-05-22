import React, { useEffect, useState } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

const App = () => {
	const [message, setMessage] = useState(null);
	const [state, setState] = useState({
		manager: '',
		players: [],
		balance: '',
		value: '',
	});
	const getData = async () => {
		const manager = await lottery.methods.manager().call();
		const players = await lottery.methods.getPlayers().call();
		const balance = await web3.eth.getBalance(lottery.options.address);
		setState({ ...state, manager, players, balance });
	};
	useEffect(() => {
		getData();
	}, []);
	const onSubmit = async (event) => {
		event.preventDefault();
		const accounts = await web3.eth.getAccounts();
		setMessage('Waiting on transaction success...');
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(state.value, 'ether'),
		});
		setMessage('You have been entered!');
	};
	const onClick = async () => {
		const accounts = await web3.eth.getAccounts();
		setMessage('Waiting on transaction success...');
		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});
		setMessage('A winner has been picked!');
	};
	console.log('state ==>> ', state);
	return (
		<div>
			<h2>Lottery Contract</h2>
			<p>
				This contract is managed by {state.manager} <br />
				There are currently {state.players.length} people entered, competeing to
				win {web3.utils.fromWei(state.balance)} ether!
			</p>
			<hr />
			<form onSubmit={onSubmit}>
				<h4>Want to try your luck?</h4>
				<div>
					<label>Amount of ether to enter</label>
					<input
						value={state.value}
						onChange={(event) =>
							setState({ ...state, value: event.target.value })
						}
					/>
				</div>
				<button type="submit">Enter</button>
			</form>
			<hr />
			<h4>Ready to pick a winner?</h4>
			<button onClick={onClick}>Pick a winner!</button>
			<hr />
			{message}
		</div>
	);
};

export default App;
