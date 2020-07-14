import axios from "./axios";

export async function getList() {
    const { data } = await axios.get("/getList");
    return {
        type: "GET_FRIENDS",
        friendsList: data
    };
}

export async function acceptFriend(id) {
    // console.log('id in acceptfriend action:', id);
    await axios.post(`/updateFriendStatus/${id}`, {buttonText: 'Accept Friend Request'});
    return {
        type: "ACCEPT_FRIEND",
        friend: id
    };
}

export async function deleteFriend(id) {
    await axios.post(`/updateFriendStatus/${id}`, {buttonText: 'Unfriend'});
    return {
        type: "DELETE_FRIEND",
        friend: id
    };
}

// SOCKET IO FOR ONLINE USERS
export async function allOnlineUsers(result) {
    // console.log('result in allonlineusers: ', result);
    return {
        type: "ONLINE_USERS",
        online: result
    };
}

export async function userWhoJoined(result) {
    return {
        type: "USER_WHO_JOINED",
        joinedUser: result
    };
}

export async function userWhoLeft(result) {
    return {
        type: "USER_WHO_LEFT",
        userWhoLeft: result
    };
}

export async function showMessages(tenMessages) {
    // console.log('tenMessages: ', tenMessages);
    return {
        type: "SHOW_LATEST_MESSAGES",
        latestMessages: tenMessages
    };
}

export async function showMsgInstantly(singleMsg) {
    return {
        type: "SHOW_MSG_INSTANTLY",
        latestMsg: singleMsg
    };
}
