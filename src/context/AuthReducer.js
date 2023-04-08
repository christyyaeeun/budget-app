const AuthReducer = (state, action) => {
    switch (action.type) {
        case "SET_CURRENT_USER":
            return {
                ...state,
                currentUser: {
                    username: action.payload.displayName,
                    userId: action.payload.uid,
                    email: action.payload.email,
                },
            };
        case "LOGIN_START":
            return {
                currentUser: null,
                isFetching: true,
                error: false,
            };
        case "LOGIN_SUCCESS":
            return {
                currentUser: action.payload,
                isFetching: false,
                error: false,
            };
        case "LOGIN_FAILURE":
            return {
                currentUser: null,
                isFetching: false,
                error: true,
            };
        case "LOGOUT":
            return {
                currentUser: null,
                isFetching: false,
                error: false,
            };
        case "SIGNUP_START":
            return {
                currentUser: null,
                isFetching: true,
                error: false,
            };
        case "SIGNUP_SUCCESS":
            console.log(action.payload)
            return {
                currentUser: action.payload,
                isFetching: false,
                error: false,
            };
        case "SIGNUP_FAILURE":
            return {
                currentUser: null,
                isFetching: false,
                error: true,
            };
        default:
            return state;
    }
};
