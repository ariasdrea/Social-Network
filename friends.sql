DROP TABLE IF EXISTS friends;

CREATE TABLE friends(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- queries:
-- select to find out if there is a relationship
-- insert - when someone clicks to make a friend request( get id as sender id, id of the page it was on as receiver id)
--
-- update - when user accepts the friend rqst. have to change accepted from false to true.
--
-- delete - if the sender cancels an unaccepted friend request you can delete the row. if either party decides to end the friendship you also delete the row.

-- SELECT *
-- FROM friendships
-- WHERE (receiver_id = $1 AND sender_id = $2)
-- OR (receiver_id = $2 AND sender_id = $1)

-- <FriendButton otherUserId={this.props.match.params.id} />
