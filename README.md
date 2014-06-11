Bomberman
=============

### Concept
Pentru a crea un AI care sa joace Bomberman, acesta trebuie sa se conecteze printr-o conexiune WebSocket la environmentul nostru.
Prin aceasta conexiune se trimit/primesc date real-time. Datele trimise de environment descriu starea jocului si evenimentele care s-au intamplat
la ultimul frame. Datele trimise de AI descriu deciziile pe care doreste AI-ul sa le ia in joc.

### Bomberman
Jocul Bomberman pregatit pentru AI vs AI este o versiune simplista a jocului clasic. Acesta presupunand un grid cu dimensiune prestabilita pe care
fiecare AI se poate misca si poate planta/misca bombe. In momentul in care o bomba explodeaza, iar un AI se afla in preajma acesteia, va muri.
Pe langa exista blocuri care blocheaza trecerea AI-urilor.

### Room
Pentru a te conecta la environment, trebuie folosit urmatorul link:
```
ws://sybilai.com:8124
```

### Steps
1. Connect to environment
2. Send event 'login'
3. Getting the state and rules of the game
4. Get every frame
5. Send at every frame decissions

### AI's events
This are the messages you can send to the environment.

#### Event: login
Acesta poate fi trimis doar la inceputul jocului.
```
{"event": "login",
 "name": "<<your ai's name>>"
 }
```

#### Event: bomb
Acesta poate fi trimis la fiecare frame. Acesta va pune in frameul in care a fost trimis o bomba pe pozitia AI-ului.
```
{
 "event": "bomb"
}
```


#### Event: move
Acesta poate fi trimis la fiecare frame. Acesta contine un array care contine directiile in care ar trebui sa se miste AI-ul.
In cazul in care AI-ul nu poate indeplini una din miscari, restul miscarilor din aceeasi comanda vor fi anulate.
```
{"event":"move", 
 "direction": [
  "up", "left", "right", "down" // you decide
  ]
}
```

De exemplu pentru a se misca in sus:
```
{"event":"move", 
 "direction": ["up"]
}
```

Pentru a se misca la dreapta:
```
{"event":"move",
 "direction": ["right"]
}
```

Pentru a se misca in sus, apoi la dreapta, apoi in jos:
```
{"event":"move",
 "direction": ["up", "right", "down"]
}
```

### Environment's events
Fiecare event care vine de la Environment are in interior un timestamp care reprezinta frame-ul la care a fost trimis mesajul.


#### Event login
Acesta e primul mesaj pe care-l veti primi care va reprezenta id-ul dumneavoastra in joc.
```
{"event": "login", 
 "your_id": 2
}
```

#### Event game_rules
Acesta este un event care descrie regulile jocului care nu se schimba pe parcursul acestuia. Dimensiunea gridului, viata/viteza/rangeul bombelor/flacarilor/playerilor.

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

#### Event game_state

```
{"event":"game_state",
 "matrices":[ [block, block .. block] .. [block, block .. block] ]
}
```

#### Event frame
Environmentul va raspunde cu acest event de fiecare data cand se schimba ceva in joc. Acest event contine un array cu 3 tipuri de evenimente: `new_entity`, `move_entity`, `destroy_entity`.

```
{"event":"frame",
 "frame": [event, event, event]
}
```

#### Event new_entity
Eventul acesta este trimis in momentul in care a aparut o noua entitate.
```
{"event":"new_entity",
 "data": entity
}
```

#### Event move_entity
Eventul acesta este trimis in momentul in care a aparut o noua entitate.
```
{"event":"move_entity",
 "object_id": <<id>>,
 "pos":{"x": 1, "y": 0}
}
```

#### Event destroy_entity
Eventul acesta este trimis in momentul in care a aparut o noua entitate.
```
{"event":"destroy_entity",
 "object_id": <<id>>
}
```

### Objects

#### Block
```
{"content": [entity, entity, entity]}
```

#### Entity
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
