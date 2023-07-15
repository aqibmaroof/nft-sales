import React, { useState } from 'react';
import './header.scss';
import { Button } from 'react-bootstrap';
import ChainSelectDialog from './blockChainSelectDialog';
import { connect } from 'react-redux';

const UnlockButton = props => {
	const [showWalletConnectDialog, setShowWalletConnectDialog] = useState(false);


	return (
		<>
			<Button
				variant="outline-primary"
				className="m-0 blockChainBtn btn-container"
				onClick={() => setShowWalletConnectDialog(true)}
				id="selectNetworkButton"
				style={{cursor:'default'}}
			>
				<img
					alt={'blockchainImg'}
					id="blockchainImg"
					className="xana-logo"
					style={{  height: 35, width:35 }}
					src={props.selectedNetworkChain?.image}
				></img>
			</Button>

			{showWalletConnectDialog ? (
				<ChainSelectDialog
					show={showWalletConnectDialog}
					hideShow={() => setShowWalletConnectDialog(false)}
					handleLogout={props.handleLogout}
				/>
			) : undefined}
		</>
	);
};

const mapStateToProps = state => {
	return {
		selectedNetworkChain: state.blockChainReducer.selectedNetworkChain,
	};
};

export default React.memo(
	connect(mapStateToProps, { })(UnlockButton)
);
