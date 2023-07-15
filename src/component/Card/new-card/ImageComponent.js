import React, { Fragment, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import './imageComponent.scss';
import './new-card.scss';
import useSound from 'use-sound';
import NewLoader from "../../Loader/loader";

const isImageUrl = require('is-image-url');

function NFTImage(props) {
	const { type, image, actualFileUrl } = props;
	const [play, { stop }] = useSound(actualFileUrl, { volume: 0.5 });

	const [isHovering, setIsHovering] = React.useState(false);
	const [loader, setLoader] = React.useState(true);

	useEffect(() => {
		// setTimeout(() => {
		// 	setLoader(false)
		// }, 4000);
		if (isImageUrl(image) && checkURL(image)) {
			setLoader(false)
		}
	}, [image])

	function handleImageLoaded() { }

	function checkURL(url) {
		return url && url.match(/\.(jpeg|jpg|gif|png|mp4|MOV|mov|MP4)$/) != null;
	}

	const imageStyle = {}; //!loaded ? { display: "none" } : {};

	function handlePlay(mouseAction = '') {
		if (mouseAction === 'leave') {
			setIsHovering(false);
			stop();
		} else if (mouseAction === 'enter') {
			setIsHovering(true);
			play();
		} else if (isHovering) {
			setIsHovering(false);
			stop();
			props.showDetail(props.nft);
		}
	}
	return (
		<Fragment key={props.id}>
			{type === '2D' ||
				type === '2D-STYLES' ||
				type === 'GIF' ||
				type === 'hot' ||
				type === 'Photo' ||
				type === 'PORTFOLIO' ||
				type === 'portfolio' ||
				type === 'audio' ? (
				<div className="loader-v">
					{loader ? <div style={{ display:'flex', justifyContent:'center', alignItems:'center',position: "absolute", width:'100%', height:'100%', top:'0px'}}><NewLoader/></div> : null}
					{isImageUrl(image) && checkURL(image) ? (
						<>
							<Card.Img
								alt="card-image"
								className="listCardImg"
								variant="top"
								src={ image +`?tr=w-400,tr=h-400` }
								style={
									isHovering && type === 'audio' ? { opacity: 0.7 } : imageStyle
								}
								onLoad={handleImageLoaded}
								onMouseEnter={() => handlePlay('enter')}
								onMouseOut={() => handlePlay('leave')}
								onClick={() => handlePlay()}
							/>
							{type === 'audio' ? (
								<span className="actionIcon">
									{/* <img src={AudioPlayIcon} alt="best nft art marketplace" /> */}
								</span>
							) : null}
							{type === 'movie' ? (
								<span className="actionIcon">
									<img src="https://ik.imagekit.io/xanalia/Images/Play.svg" alt="nft crypto" />
								</span>
							) : null}
						</>
					) : !isImageUrl(image) && checkURL(image) ? (
						<>
						</>
					) : (
						<>
							<Card.Img
								alt="audio"
								variant="top"
								src={ image + '?tr=w-400,tr=h-400'}
								style={
									isHovering && type === 'audio' ? { opacity: 0.7 } : imageStyle
								}
								onLoad={handleImageLoaded}
								onMouseEnter={() => handlePlay('enter')}
								onMouseOut={() => handlePlay('leave')}
								onClick={() => handlePlay()}
								className="listCardImg"
							/>
							{type === 'audio' ? (
								<span className="actionIcon">
								</span>
							) : null}
							{type === 'movie' ? (
								<span className="actionIcon">
									<img src="https://ik.imagekit.io/xanalia/Images/Play.svg" alt="where to buy nft art" />
								</span>
							) : null}
						</>
					)}
				</div>
			) : type === '3D' || type === 'movie' ? (
				<div className="loader-v">
					{loader ? 
					<div style={{ display:'flex', justifyContent:'center', alignItems:'center',position: "absolute", width:'100%',height:'94%'}}><NewLoader/></div>
					 : null}
					{isImageUrl(image) ? (
						<>
							<Card.Img
								variant="top"
								src={image + '?tr=w-400,tr=h-400'}
								alt="card-image"
								className="listCardImg"
							/>
							{type === 'audio' ? (
								<span className="actionIcon">
								</span>
							) : null}
							{type === 'movie' ? (
								<span className="actionIcon">
									<img src="https://ik.imagekit.io/xanalia/Images/Play.svg" alt="crypto staking" />
								</span>
							) : null}
						</>
					) : (
						<>
						</>
					)}
				</div>
			) : undefined}
		</Fragment>
	);
}

export default React.memo(NFTImage);
