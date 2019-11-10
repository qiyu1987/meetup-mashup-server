// index.js
var app = require("express")()
var server = require("http").Server(app)
var io = require("socket.io")(server)
server.listen(3002)
var Meetup = require("meetup")
var mup = new Meetup()

// outside of our stream (!) we setup an empty object
let topicsCounter = {}
io.on("connection", socket => {
	console.log("got connection")

	mup.stream("/2/rsvps", stream => {
		stream
			.on("data", item => {
				console.log("got item " + item)

				// inside of our stream event handler (!) we retrieve the group topics
				const topicNames = item.group.group_topics.map(
					topic => topic.topic_name
				)
				if (topicNames.includes("Software Development")) {
					topicNames.forEach(name => {
						if (topicsCounter[name]) {
							topicsCounter[name]++
						} else {
							topicsCounter[name] = 1
						}
					})
				}
				const arrayOfTopics = Object.keys(topicsCounter)
				let topTenTopicsCounter = {}

				arrayOfTopics
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
					.map(topic => {
						topTenTopicsCounter[topic] = topicsCounter[topic]
					})

				console.log(topTenTopicsCounter)
				socket.emit("action", topTenTopicsCounter)
			})
			.on("error", e => {
				console.log("error! " + e)
			})
	})
})
