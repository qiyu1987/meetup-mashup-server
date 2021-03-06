// index.js
var app = require("express")()
var server = app.listen(3002)
var io = require("socket.io")(server)
// setUp connection to Meetup API through meetup
var Meetup = require("meetup")
var mup = new Meetup()

// outside of our stream (!) we setup an empty object
let topicsCounter = {}
let topTenTopics = []
// stream to work with events 
mup.stream("/2/rsvps", stream => {
	stream
		.on("data", item => {
			// console.log('got item',item)
			// inside of our stream event handler (!) we retrieve the group topics
			const topicNames = item.group.group_topics.map(topic => topic.topic_name)
			if (topicNames.includes("Software Development")) {
				topicNames.forEach(name => {
					if (topicsCounter[name]) {
						topicsCounter[name]++
					} else {
						topicsCounter[name] = 1
					}
				})
				// console.log(topicsCounter)
			}
			const arrayOfTopics = Object.keys(topicsCounter)
			const topTenTopics = arrayOfTopics
				.sort((topicA, topicB) => {
					if (topicsCounter[topicA] > topicsCounter[topicB]) {
						return -1
					} else if (topicsCounter[topicB] > topicsCounter[topicA]) {
						return 1
					} else {
						return 0
					}
				})
				.slice(0, 9)
				.map(topic => ({
					topic,
					count: topicsCounter[topic]
				}))

			console.log(topTenTopics)
			io.emit("action", topTenTopics)
		})
		.on("error", e => {
			console.log("error! " + e)
		})
})
io.on("connection", socket => {
	console.log("got connection")
	socket.emit("action", topTenTopics)
})
