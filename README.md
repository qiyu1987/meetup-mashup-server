# This is a Practice Project to learn WebSocket

This is backend of a project shows realtime meet-up Software Programing events and rsvps.
The front end repo can be find here. [meetup-mashup-ui](https://github.com/qiyu1987/meetup-mashup-ui)

## Stack Used
   - Node.js
   - Use [meetup](https://www.npmjs.com/package/meetup) node.js interface to connect to [meetup API](https://www.meetup.com/meetup_api/)
   - [express](https://expressjs.com/) server
   - [socket.io](https://socket.io/), socket.io-client
## Functionality
    - counting real time meet-up RSVPs per topic (within groups of 'Software Development')
    - sending top 10 topics within the connection time to connected socket-io client

## Start Scripts
 ### in root dir
    -`npm start` Start Node.js Express server
    -`npm run dev` Development Hot Reload
 ### run listener
    -`cd listener`
    -`node .`

