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
