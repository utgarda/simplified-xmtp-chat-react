import React, {useContext} from 'react'
import {classNames} from './helpers'
import Address from './Address'
import {useAccount} from "wagmi";

type addressPillProps = {
    pillAddress: string
}

const AddressPill = ({pillAddress}: addressPillProps): JSX.Element => {
    const {address, isConnected} = useAccount();
    const userIsSender = address === pillAddress
    return (
        <Address
            className={classNames(
                'rounded-2xl',
                'border',
                'text-md',
                'mr-2',
                'px-2',
                'py-1',
                'font-bold',
                userIsSender ? 'bg-bt-100 text-b-600' : 'bg-zinc-50',
                userIsSender ? 'border-bt-300' : 'border-gray-300'
            )}
            address={pillAddress}
        ></Address>
    )
}

export default AddressPill
