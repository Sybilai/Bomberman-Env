###The concept
We have the **environment**, the **visualizer**, and your program (lets call it **AI**).
The **environment** is the "referee".
The **visualizer** is the visual representation of the game. [Check it out](http://sybilai.com/vis/bomberman/) to see how it looks like.

To create an AI capable of playing Bomberman it must be able to connect through a WebSocket to reach our environment. Through this connection there’s data being sent and received in real-time. The data that the environment provides describes the game state and the events that took place in the last frame. The data sent out by the AI describes his course of action throughout the game.

###Bomberman

The Bomberman that is now ready for an AI vs AI showdown it’s really just a simplistic version of the classic game. The gameplay consists of a grid with a predetermined width and height on which any AI can move freely and can plant and/or move bombs. When a bomb explodes and an AI is near it that AI will die. There are also immobile blocks that will serve as obstacles for the AI.

###Room

To connect to our environment, you must use the following link:
```
ws://sybilai.com:8124
```

###Steps

1. Connect to environment
1. Send event 'login'
1. Getting the state and rules of the game
1. Get every frame
1. Send at every frame decisions
1. AI's events


###Events
This are the messages you can send to the environment.

####Event: login
This can be sent only at the beginning of the game
```
{"event": "login",
 "name": "<<your ai's name>>"
 }
```

####Event: Bomb
This can be sent at any frame. This will send the position of the AI’s bomb at the current frame.
```
{
 "event": "bomb"
}
```

####Event: move
This can be sent at any frame. It contains an array which has the directions in which the AI can move. If the AI can’t comply to one of the movement the other ones will be cancelled.
```
{"event":"move", 
 "direction": [
  "up", "left", "right", "down" // you decide
  ]
}
```


For example, going up:
```
{"event":"move", 
 "direction": ["up"]
}
```


Going right:
```
{"event":"move",
 "direction": ["right"]
}
```


Going up, right and then heading down:
```
{"event":"move",
 "direction": ["up", "right", "down"]
}
```


###Environment’s events
Every event that comes out from the environment has inside of it a timestamp that represents the frame in which it was send.

####Event Login


This is the first message you’ll receive when you’ll receive and it will contain your ID inside the game.
```
{"event": "login", 
 "your_id": 2
}
```

####Event game_rules
This is an event that describes the rules of the game that do not change throughout it. The grid’s dimensions, health, speed, bomb’s and flame’s range and the players.
```
{"event":"game_rules",
 "data":{
  "sizeN":20,
  "sizeM":15,
  "bombs":{
   "life":24,
   "range":1,
   "speed":2
  },
  "flames":{
   "life":12
  },
  "players":{
   "speed":4
  },
  "currentFrame":1015,
  "framesPerSecond":10
 },
 "timestamp":1015
}
```

####Event game_state
```
{"event":"game_state",
 "matrices":[ [block, block .. block] .. [block, block .. block] ]
}
```

####Event frame
The environment will respond with this event every time there’s a change throughout the game. This event will also contain an array with 3 other types of events such as `new_entity`, `move_entity`, `destroy_entity`.

```
{"event":"frame",
 "frame": [event, event, event]
}
```

####Event new_entity
This event is sent when another entity appears.

```
{"event":"move_entity",
 "object_id": <<id>>,
 "pos":{"x": 1, "y": 0}
}
```

####Event destroy_entity

This event is sent when an entity disappears. 
```
{"event":"destroy_entity",
 "object_id": <<id>>
}
```

###Objects
####Block
```
{"content": [entity, entity, entity]}
```

####Entity
```
{"isBlocking":false,
 "mortal":true,
 "type":"player/bomb/flame/fixblock",
 "pos":{"x":10,"y":8},
 "powerups":{"canKick":true},
 "lastUpdate":0,
 "direction":"none",
 "object_id":112,
 "id":10
}
```
