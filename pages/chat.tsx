import {NextPage} from 'next';
import AddressPill from "components/Conversation/AddressPill";
import MessagesList from "components/Conversation/Messagelist";
import React, {useContext, useEffect, useRef, useState} from "react";
import {Conversation, Message} from '@xmtp/xmtp-js'

import {useAccount} from "wagmi";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import XmtpContext from "../components/Conversation/xmtp";
import {ListMessagesPaginatedOptions} from "@xmtp/xmtp-js/dist/types/src/Client";
import {messageApi} from "@xmtp/proto";


const ConversationPage: NextPage = () => {
    const PEER_ADDR = '0x3Be65C389F095aaa50D0b0F3801f64Aa0258940b'
    const {client, conversations} = useContext(XmtpContext)
    const [messages, setMessages] = useState<Message[]>([]);
    const [paginator, setPaginator] = useState<AsyncGenerator<Message[]> | null>(null);

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
            conv.send('Hello Sunday 1')
                .then(() => conv.send('Hello Sunday 2'))
            // .then(() => {
            //     conv.messages().then(setMessages);
            // });
        }
    }, [conv]);

    useEffect(() => {
        console.log("conv changed", conv);
        if (conv) {
            conv.streamMessages().then(async (stream) => {
                    for await (const msg of stream) {
                        console.log('got message', msg);
                        setMessages([...messages, msg]);
                    }
                }
            )
        }
    }, [conv])

    useEffect(() => {
        nextPage().then(r => console.log('nextPage', r));
    }, [paginator]);

    const nextPage = async () => {
        if (paginator) {
            paginator.next().then((result) => {
                if (result.done) {
                    console.warn('done loading messages');
                    console.assert(result.value === undefined);
                    setPaginator(null)
                } else {
                    // const res = result as IteratorYieldResult<Message[]>;
                    setMessages([...result.value, ...messages]);
                }
            });
        }
    }

    if (address && conv) {
        return <div>
            <AddressPill pillAddress={address}/>
            <MessagesList messagesEndRef={messagesEndRef} messages={messages}/>
            <button onClick={
                async () => {
                    if (conv) {
                        const paginationOptions: ListMessagesPaginatedOptions = {
                            // startTime: Date;
                            // endTime?: Date;
                            pageSize: 50,
                            direction: messageApi.SortDirection.SORT_DIRECTION_DESCENDING,
                        }

                        if (!paginator) {
                            setPaginator(conv.messagesPaginated(paginationOptions))
                        } else {
                            await nextPage();
                        }
                    }
                }
            }> Next Page
            </button>
            <br/>
            {paginator == null && <span>Done</span>}
        </div>

    } else {
        return <ConnectButton/>
    }
}


export default ConversationPage;