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
            friendslist: state.friendslist.map(user => {
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

    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            onlineFriends: action.online
        };
    }

    if (action.type == "USER_WHO_JOINED") {
        // console.log("action in userwhojoined:", action);
        state = {
            ...state,
            onlineFriends: state.onlineFriends.concat(action.joinedUser)
        };
    }

    if (action.type == "USER_WHO_LEFT") {
        // console.log("action in userwholeft:", action);
        state = {
            ...state,
            onlineFriends: state.onlineFriends.filter(
                item => item.id != action.userWhoLeft
            )
        };
    }

    return state;
}
