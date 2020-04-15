import axios from "./axios";

export async function getList() {
    const { data } = await axios.get("/getList");

    console.log('IN ACTION: data from list: ', data);

    return {
        type: "GET_FRIENDS",
        friendsList: data
    };
}

export async function acceptFriend(id) {
    console.log('id in acceptfriend action:', id);
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