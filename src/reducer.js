export default function reducer(state = {}, action) {
    if (action.type == "GET_FRIENDS") {
        state = {
            ...state,
            friendslist: action.friendsList
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendslist:
            state.friendslist.map(user => {
                if (user.id == action.friend) {
                    user["accepted"] = true;
                    return user;
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "DELETE_FRIEND") {
        state = {
            ...state,
            friendslist: state.friendslist.filter(
                user => user.id != action.friend
            )
        };
    }

    return state;
}
