// useRef is for the scroll bar
import React, { useEffect, useRef } from 'react';
import { socket } from './socket';
import { useSelector } from 'react-redux';

export default function Chat() {
    const elementRef = useRef();
    const chatMessages = useSelector(
        state => state && state.latestMessages
    );

    // this should be an array of obj
    console.log('here are my last 10 chat messages: ', chatMessages);


    // pass it once - pass an empty array
    // pass the thing that changes (newChatMsg) and makes it run again
    useEffect(() => {
        console.log('chat component mounted!');
        // elementRef.current references the chat-container
        // console.log('elementRef: ', elementRef);
        // console.log('scrolltop: ', elementRef.current.scrollTop);
        // console.log('scrollHeight: ', elementRef.current.scrollHeight);
        // console.log('clientHeight: ', elementRef.current.clientHeight);

        elementRef.current.scrollTop = elementRef.current.scrollHeight - elementRef.current.clientHeight;

    }, [chatMessages]);
    
    // SENDS MESSAGE
    const keyCheck = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            socket.emit("chatMsg", e.target.value);
            e.target.value = "";
        }
    };

    let arrOfMessages = chatMessages && chatMessages.map(item => {
        return (
            <div className="chat-div" key={item.id}>
                <img className="chat-img" src={item.profilepicurl} />
                <p className="chat-msg">
                    {item.first} says - {item.messages}
                </p>
            </div>
        );
    });


    return (
        <div>
            <p className='chat-title'>Welcome to Chat</p>
            <div className='chat-messages-container' ref={elementRef}>
                {arrOfMessages}
            </div>

            <div className='chat-input-div'>
                <textarea placeholder='Add your message here here' onKeyDown = { keyCheck }></textarea>
            </div>
        </div>
    );
}

// you're going to eventually map over the area and remove the hardcoded msg 'chat messages will go here
// latest chat msg is that they would have to manually scroll to see that msg
// let's make it so that it automatically scrolls for them.