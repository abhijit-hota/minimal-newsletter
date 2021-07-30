import React, { useRef, useState } from 'react';
import { CheckIcon, LoadingIcon, MailIcon, PlaneIcon } from './icons';
import logo from './assets/fake-logo.png';

const VALID_EMAIL_PATTERN = /[a-z0-9_]+@\w+.\w+/;
const SUBMITTING = 'SUBMITTING';
const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';

const subscribe = async (email) => {
	const res = await fetch('http://localhost:5000/subscribe', {
		method: 'POST',
		body: JSON.stringify({ email }),
		headers: {
			'content-type': 'application/json',
		},
	});
	if (!res.ok) {
		const err = Error(await res.text());
		err.code = res.status;
		err.name = res.statusText;
		throw err;
	}
};

function App() {
	const [errorMessage, setErrorMessage] = useState(' ');
	const [submitState, setSubmitState] = useState('');
	const emailInput = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitState(SUBMITTING);

		try {
			const { value: email } = emailInput.current;
			const isEmailValid = VALID_EMAIL_PATTERN.test(email);
			if (isEmailValid) {
				await subscribe(email);

				// The request gets completed too soon when running locally
				// I've used setTimeout for simulating the delay
				setTimeout(() => {
					setSubmitState(SUCCESS);
					setErrorMessage('');
				}, 1000);
			} else {
				throw Error('Please input a valid E-Mail');
			}
		} catch (error) {
			console.error(error);
			setSubmitState(ERROR);
			setErrorMessage(error.message);
			emailInput.current.focus();
		}
	};
	return (
		<div className="sm:bg-bg flex flex-col h-96 pt-12 items-center sm:shadow-2xl rounded-2xl p-4">
			<img src={logo} className="w-32" />
			<h1 className="text-3xl text-gray-500 mt-6">
				The <span className="text-brand-blue">Lorem Ipsum</span> newsletter
			</h1>
			<h2 className="text-gray-400 mb-6">The only newsletter you'll ever need</h2>
			<form className="flex flex-col sm:flex-row w-full items-center sm:items-stretch">
				<div class="relative text-gray-400 focus-within:text-gray-600 w-full sm:w-auto">
					<div className="absolute inset-y-0 left-0 sm:pl-7 pl-3 flex items-center pointer-events-none">
						<MailIcon />
					</div>
					<input
						name="email"
						ref={emailInput}
						type="text"
						className={`py-3 sm:mx-4 bg-white placeholder-gray-400 text-gray-900 rounded-lg appearance-none pl-12 focus:outline-none focus:ring ${
							submitState === ERROR ? 'ring-red-400' : ''
						} shadow w-full sm:w-auto`}
						placeholder="Your E-Mail"
						onChange={() => {
							if (errorMessage !== '') {
								setErrorMessage('');
							}
							if (submitState !== '') {
								setSubmitState('');
							}
						}}
						required
					/>
				</div>
				<button
					className={`p-2 m-6 sm:m-0 rounded-lg hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring shadow w-48 sm:w-36 ${
						submitState === SUCCESS ? 'bg-green-600' : 'bg-blue-600'
					}`}
					type="submit"
					onClick={handleSubmit}>
					<span className="flex justify-center items-center w-full text-gray-50">
						{submitState === SUBMITTING ? (
							<LoadingIcon />
						) : submitState === SUCCESS ? (
							<>
								Subscribed <CheckIcon />
							</>
						) : (
							<>
								Subscribe <PlaneIcon />
							</>
						)}
					</span>
				</button>
			</form>
			<span className="text-red-600 mt-3 pl-4 self-start">{errorMessage}</span>
		</div>
	);
}

export default App;
