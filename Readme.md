The dapp does lazy minting by asking the user to sign an off chain voucher and then sending it to a small api-based backend.
The backend, through a background job, then goes through the stored signatures and tries to execute the transaction on behalf of the user.
The contract that the dapp will interact with has to be a simple ERC721 implementation but with a special mint fuction that accepts meta transactions (signed orders)

Frontend:
-> one page form where user fill in their name, then connects their wallets and sign an order object
-> order object and signature sent via api to bakcend

Backend:
-> has to store the signature in db with order object
-> background job process that goes through the list of signed but not executed transactions
-> a wallet private key that will send the signed orders to the contract and execute the transaction
-> update the database when a transaction is executed, save errors if any

Chainend:
-> simple erc721 contract
-> has to have metatransaction/lazyminting capabilities