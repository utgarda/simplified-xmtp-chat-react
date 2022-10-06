import {NextPage} from 'next';
import AddressPill from "components/Conversation/AddressPill";
import MessagesList from "components/Conversation/Messagelist";
import React, {useEffect, useRef, useState} from "react";
import {Client, Message} from '@xmtp/xmtp-js'

import {useAccount, useSigner} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";


const ConversationPage: NextPage = () => {

    const [messages, setMessages] = useState<Message[]>([]);

    const {address, isConnected} = useAccount();
    const {data: signer} = useSigner();
    const messagesEndRef = useRef(null);
    const [addr, setAddr] = useState<string>("");

    useEffect(() => {
        if (isConnected && signer) {
            console.log('isConnected', isConnected);
            console.log('signer', signer);
            signer.getAddress().then(setAddr).then(
                () => {

                    const msgs = [...messages];
                    Client.create(signer).then(xmtp =>

                        xmtp.conversations.newConversation(
                            '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b'
                        )
                    ).then(conversation => {
                        conversation.send('Hello world 112')
                            .then(message => {
                                msgs.push(message);
                                setMessages([...msgs]);
                            })
                            .then(() => conversation.send('Hello world 2'))
                            .then(message => {
                                msgs.push(message);
                                setMessages([...msgs]);
                            })
                            .then(() => conversation.send('Hello world 3'))
                            .then(message => {
                                msgs.push(message);
                                setMessages([...msgs]);
                            })
                    });

                }
            );
        }

    }, [isConnected, signer]);


    if (addr) {
        console.log('addr', addr);
        console.log('messages', messages);
        return <div>
            <AddressPill pillAddress={addr}/>
            <MessagesList messagesEndRef={messagesEndRef} messages={messages}/>
        </div>;

    } else {
        return <ConnectButton/>
    }
}


export default ConversationPage;