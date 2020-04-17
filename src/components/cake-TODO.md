V 1. connectionReply
take lobby data and display it.

V 2. connectionRefused
display sad worm, say Sorry!
This should inherit from logInConf where youcanenter == false

V 3. joinRoom
send {roomID: qE2}

V 4. youJoinedARoom (loginConf in FE change name!)
receives
{youcanenter, playersdetails, room}
This is confirmation that you have successfully entered.

V 5. quitRoom
triggered when you exit a room

6. chatbox sends with clientSentChat
   chatbox receives with serverSentChat
