import React, {useContext, useEffect, useState} from 'react'
import type {NextPage} from 'next'
import {Conversation} from '../components/Conversation/Conversation'
import {Client, Message} from "@xmtp/xmtp-js";
import {useAccount, useSigner} from "wagmi";


const ConversationPage: NextPage = () => {
    const recipientAddr = '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b'
    const {address, isConnected} = useAccount();
    const {data: signer} = useSigner();
    const [addr, setAddr] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (isConnected && signer) {
            console.log('isConnected', isConnected);
            console.log('signer', signer);
            signer.getAddress().then(setAddr).then(
                () => {

                    const msgs = [...messages];
                    Client.create(signer).then(xmtp =>

                        xmtp.conversations.newConversation(
                            recipientAddr
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


    return <Conversation recipientWalletAddr={recipientAddr}/>
}

export default React.memo(ConversationPage)
