import {NextPage} from 'next';
import AddressPill from "components/Conversation/AddressPill";
import MessagesList from "components/Conversation/Messagelist";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Conversation, Message} from '@xmtp/xmtp-js'

import {useAccount, useSigner} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import XmtpContext from "../components/Conversation/xmtp";


const ConversationPage: NextPage = () => {
    const PEER_ADDR = '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b'
    const {client, conversations} = useContext(XmtpContext)
    const [messages, setMessages] = useState<Message[]>([]);

    const {address} = useAccount();
    const messagesEndRef = useRef(null);
    const [conv, setConv] = useState<Conversation | null>(null);

    useEffect(() => {
            if (client && conversations) {
                const existingConv = conversations.get(PEER_ADDR);
                if (existingConv) {
                    setConv(existingConv);
                } else {
                    client.conversations.newConversation(
                        PEER_ADDR
                    ).then(setConv)
                }
            }
        }
        , [client, conversations]);

    useEffect(() => {
        if (conv) {
            const msgs = [...messages];
            conv.send('Hello world 112')
                .then(() => conv.send('Hello world 2'))
                .then(() => {
                    conv.messages().then(setMessages);
                });
        }
    }, [conv]);


    if (address && conv) {
        return <div>
            <AddressPill pillAddress={address}/>
            <MessagesList messagesEndRef={messagesEndRef} messages={messages}/>
        </div>;
    } else {
        return <ConnectButton/>
    }
}


export default ConversationPage;