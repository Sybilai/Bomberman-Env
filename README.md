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
