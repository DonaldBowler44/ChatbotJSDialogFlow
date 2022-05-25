import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { saveMessage } from '../actions/message_actions';
import Message from './sections/Messages';
import { List, Avatar, Icon } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import MoodIcon from '@mui/icons-material/Mood';
import Card from './sections/Card';


function Chatbot() {
    const dispatch = useDispatch();
    const messagesFromRedux = useSelector(state => state.message.messages)

    useEffect(() => {

        eventQuery('welcomeToMyWebsite')

    }, [])

    const textQuery = async (text) => {
        // First Need to take care of the message I sent
        let conversation = {
            who: 'user',
            content: {
                text: {
                    text: text
                }
            }
        }

    dispatch(saveMessage(conversation));
    //console.log('text I sent, conversation)

    //take care of message chatbot sent
    const textQuertVariables = {
        text
    }
    try {
        //send request to textQuert route
        const response = await Axios.post('http://localhost:5000/textQuery', textQuertVariables)

        for (let content of response.data.fulfillmentMessages) {
            conservation = {
                who: 'bot',
                content: content
            }
            dispatch(saveMessage(conversation));
        }
    } catch (error) {
        conversation = {
            who: 'bot',
            content: {
                text: {
                    text: "Error occured, please check problem."
                }
            }
        }
        dispatch(saveMessage(conversation))
    }

    }
    
    const eventQuery = async (event) => {

        //we need to manage of message chatbot sent
        const eventQueryVariables = {
            event
        }
        try {
            //sned request to textQuery ROUTE
            const response = await Axios.post('http://localhost:5000/eventQuery',eventQueryVariables)
            for (let content of response.data.fulfillmentMessages) {
                let conservation = {
                    who: 'bot',
                    content: content
                }

                dispatch(saveMessage(conservation))
            }
            
        } catch (error) {
            let conversation = {
                who: 'bot',
                content: {
                    text: {
                        text: "Error just occured, please check the problem"
                    }
                }
            }
            dispatch(saveMessage(conversation));
        }
    }

    const keyPressHandler = (e) => {
        if (e.key === "Enter") {
            if (!e.target.value) {
                return alert('you need to type something first');
            }

            //send request to text query route
            textQuery(e.target.value);

            e.target.value = "";
        } 
    }
    
    const renderCards = (cards) => {
        return cards.map((card,i) => <Card key={i} cardInfo={card.structValue} />)
    }

    const renderOneMessage = (message, i) => {
        console.log('message', message)

        // give conditions here to separate message kinds

        //template for normal text
        if (message.content && message.content.text && message.content.text.text) {
            return <Message key={i} who={message.who} text={message.content.text.text} />
        } else if (message.content && message.content.payload.fields.card) {

            const AvatarSrc = message.who === 'bot' ? <MoodIcon /> : <MoodIcon />

            return <div>
                <ListItem style={{ padding: '1rem' }}>
                   <ListItemAvatar>
                    <Avatar>
                        {AvatarSrc}
                    </Avatar>
                    </ListItemAvatar>

                    title={message.who}
                    description={renderCards(message.content.payload.fields.card.listValue.values)}

                </ListItem>
                </div>
        }

        //template for card message

    }

    const renderMessage = (returnedMessages) => {
        if (returnedMessages) {
            return returnedMessages.map((message, i) =>{
                return renderOneMessage(message, i);
            })
        } else {
            return null;
        }
    }


    return (
        <div style={{
            height: 700, width: 700,
            border: '3px solid black', borderRadius: '7px'
        }}>
        <div style={{ height: 644, width: '100%', overflow: 'auto' }}>

        {renderMessage(messagesFromRedux)}

        </div>

            <input 
             
             style={{
                    margin: 0, width: '100%', height: 50,
                    borderRadius: '4px', padding: '5px', fontSize: '1rem'
                }}
                placeholder="Send a message..."
                onKeyPress={keyPressHandler}
                type="text"
             />
             
        </div>
    )
}

export default Chatbot;