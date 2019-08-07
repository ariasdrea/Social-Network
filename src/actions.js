import axios from "./axios";

export async function getList() {
    const { data } = await axios.get("/getList");
    return {
        type: "GET_FRIENDS",
        friendsList: data
    };
}

export async function acceptFriend(id) {
    await axios.post("/accept/" + id);
    return {
        type: "ACCEPT_FRIEND",
        friend: id
    };
}

export async function deleteFriend(id) {
    await axios.post("/delete/" + id);
    return {
        type: "DELETE_FRIEND",
        friend: id
    };
}

// SOCKET IO FOR ONLINE USERS
export async function allOnlineUsers(result) {
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

export async function showMessages(result) {
    return {
        type: "SHOW_LATEST_MESSAGES",
        latestMessages: result
    };
}

export async function showMsgInstantly(result) {
    return {
        type: "SHOW_MSG_INSTANTLY",
        latestMsg: result
    };
}
