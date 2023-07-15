const initialState = {
	lang: localStorage.getItem('lang'),
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case 'UPDATE_LANGUAGE':
			return { message: payload };

		default:
			return state;
	}
}
