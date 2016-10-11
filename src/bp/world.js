module.exports={console:{canvas:document.getElementById('canvas'),fullscreen:true,clearBeforeDraw:true,sprites:{count:256,width:20,height:20},colors:['#000000','#333333','#666666','#999999','#cccccc','#ffffff','#b21f35','#d82735','#ff7435','#ffa135','#ffcb35','#fff735','#00753a','#009e47','#16dd36','#0052a5','#0079e7','#06a9fc','#681e7e','#7d3cb5','#bd7af6']},player:{type:"Human",name:"Stephen Colbert",life:3000,states:{"active":{c:2,f:'#ffffff'},"dead":{c:2,f:'#333333'}},state:"active",light:{color:'#ff0000',luminosity:1},odor:1.5,speed:1,sight:16},start:{area:'entryway',x:25,y:24},races:{Skeleton:{type:'Skeleton',supertype:'Undead',avgIQ:0,growth:0,density:0.5,migration:0,relations:{Human:-100,Skeleton:100,Rat:50},makeup:{'Mr. Dooty':0.1,'Mr. Skeltal':0.9},subtypes:{'Mr. Skeltal':{Entity:{name:'Mr. Skeltal',life:[10,12],states:{"active":{c:83,f:'#cccccc'},"dead":{c:83,f:'#333333'}},odor:1,size:0.9},Mover:{speed:0.75},Sensor:{see:10,hear:0,smell:0},Mob:{power:[1,2]}},'Mr. Dooty':{Entity:{name:'Mr. Dooty',life:[20,25],states:{"active":{c:83,f:'#ccccff'},"dead":{c:83,f:'#333333'}},odor:1,},Mover:{speed:[0.75,1]},Sensor:{see:10,hear:0,smell:0},Mob:{power:[4,5]}}}},Rat:{type:'Rat',supertype:'Beast',avgIQ:15,growth:0.08,density:1,migration:0.08,relations:{Human:-100,Skeleton:50,Rat:100},makeup:{'Rattus':1},subtypes:{'Rattus':{Entity:{name:'Rat',life:[3,4],states:{"active":{c:114,f:'#663300'},"dead":{c:114,f:'#333333'}},odor:2,},Mover:{speed:0.5},Sensor:{see:3,hear:10,smell:10},Mob:{power:0.2}}}},Human:{type:'Human',supertype:'Humanoid',avgIQ:100,growth:0.08,density:0.25,migration:0.25,relations:{Human:100,Skeleton:-100,Rat:-75},makeup:{'Average':1},subtypes:{Average:{Entity:{name:'Joe',life:[10,12],states:{"active":{c:2,f:'#ddddaa'},"dead":{c:2,f:'#333333'}},odor:1,},Mover:{speed:1},Sensor:{see:14,hear:7,smell:3},Mob:{power:4}}}},},areas:{rightWing:{id:'rightWing',title:"Bill Murray's Mansion - Right Wing",width:50,height:50,size:2500,fov:"pc",clock:1,base:{wall:{c:219,f:'#333333',b:'#000000',r:0.3},floor:{c:32,f:'#000000',b:'#052211',r:1},exit:{c:239,f:'#ffffff',b:'#333333',r:1}},generator:null,prefabs:[{x:0,y:0,w:50,h:50,walls:'50 50 2lkCB1 4oMv 0 36 6On7y 0 6oo 0 6 dcly 0 co rfuus zcg8 pzy x2 1aFjiU QNoc 16c8 2gN3jy 1L148T 0 1Eic 2fGQk 8NAA 3pbBm 4xAdi ianwk 5kk 2lkly3 6BaR 0 6c dCKf6 0 cMM 0 c qoH6 0 oM SuYYo 1HAMo P96 0 M 1HAMo 0 1B6 1aFjiw 1 3iAo 0 36 6Ono0 jiIQo 6oo i76 6 dclO ZAXe co rfuuc 0 pzy 0 o QNoc 0 Ny 1KZXWM 0 1Eic 0 1y 3pbyM 0 3cc 0 2lkCB1 1048575'}],exits:[{to:"leftWing",eID:0,x:0,y:1},{to:'entryway',eID:1,x:0,y:5}],footholds:[{race:'Skeleton',population:15,knowledge:0},{race:'Rat',population:50,knowledge:100}]},leftWing:{id:'leftWing',title:"Bill Murray's Mansion - Left Wing",width:50,height:50,size:2500,fov:"fog",clock:1,base:{wall:{c:219,f:'#333333',b:'#000000',r:0.3},floor:{c:32,f:'#000000',b:'#052211',r:1},exit:{c:239,f:'#ffffff',b:'#333333',r:1}},generator:null,prefabs:[{x:0,y:0,w:50,h:50,walls:'50 50 2lkCB1 4oMv 0 36 6On7y 0 6oo 0 6 dcly 0 co rfuus zcg8 pzy x2 1aFjiU QNoc 16c8 2gN3jy 1L148T 0 1Eic 2fGQk 8NAA 3pbBm 4xAdi ianwk 5kk 2lkly3 6BaR 0 6c dCKf6 0 cMM 0 c qoH6 0 oM SuYYo 1HAMo P96 0 M 1HAMo 0 1B6 1aFjiw 1 3iAo 0 36 6Ono0 jiIQo 6oo i76 6 dclO ZAXe co rfuuc 0 pzy 0 o QNoc 0 Ny 1KZXWM 0 1Eic 0 1y 3pbyM 0 3cc 0 2lkCB1 1048575'}],exits:[{to:'rightWing',eID:0,x:0,y:0},{to:'entryway',eID:0,x:2,y:0}],footholds:[{race:'Skeleton',population:15,knowledge:0},{race:'Rat',population:50,knowledge:100}]},entryway:{id:'entryway',title:"Bill Murray's Mansion - Entryway",width:50,height:50,size:2500,fov:"fog",clock:1,base:{wall:{c:219,f:'#333333',b:'#000000',r:0.3},floor:{c:32,f:'#000000',b:'#999999',r:1},exit:{c:239,f:'#ffffff',b:'#333333',r:1}},generator:null,prefabs:[{x:0,y:0,w:50,h:50,walls:'50 50 2lkCB1 4oMv 0 36 6On7y 0 6oo 0 6 dcly 0 co rfuus zcg8 pzy x2 1aFjiU QNoc 16c8 2gN3jy 1L148T 0 1Eic 2fGQk 8NAA 3pbBm 4xAdi ianwk 5kk 2lkly3 6BaR 0 6c dCKf6 0 cMM 0 c qoH6 0 oM SuYYo 1HAMo P96 0 M 1HAMo 0 1B6 1aFjiw 1 3iAo 0 36 6Ono0 jiIQo 6oo i76 6 dclO ZAXe co rfuuc 0 pzy 0 o QNoc 0 Ny 1KZXWM 0 1Eic 0 1y 3pbyM 0 3cc 0 2lkCB1 1048575'}],exits:[{to:"leftWing",eID:1,x:0,y:1},{to:"rightWing",eID:1,x:49,y:49}],footholds:[{race:'Skeleton',population:50,knowledge:0},{race:'Rat',population:150,knowledge:100},{race:'Human',population:20,knowledge:0}]},}};