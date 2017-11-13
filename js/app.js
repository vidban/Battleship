var model = {

	turns: 0,

	numShips: 0,

	shipsSunk: 0,

	lcArray: [],

	allShips: [{ name: "Battleship", long: 5, level: ["hard"],  location: [], hit: [0,0,0,0,0]},
				 { name: "Destroyer", long: 5, level: ["hard"], location: [], hit: [0,0,0,0,0]}, 
				 { name: "Battleship", long: 3, level: ["easy"],  location: [], hit: [0,0,0]}, 
				 { name: "Submarine", long: 3, level: ["easy","hard"], location: [], hit: [0,0,0]}, 
				 { name: "Submarine", long: 3, level: ["hard"], location: [], hit: [0,0,0]}, 
				 { name: "Smallship", long: 2, level: ["easy","hard"], location: [], hit: [0,0]}],


	makeGrid: function(level) {
		var sinfo = document.getElementById('startscr');

		view.hideClass(sinfo);

		var chosenGrid = level;

		model.grid = level;


		var tinfo = document.getElementById('board');
		var tableString = "";

		//make grid
		if (chosenGrid>0) {
			var gridRow= ['A','B','C','D','E','F','G','H','I','J'];
			
			for (var x = 0; x <= chosenGrid; x++){
				tableString+= "<tr>"
				if (x==0){
					//adds the first row with labels
					for (var z= 0; z<=chosenGrid; z++){
						if (z==0){
							tableString+="<th></th>";
						}else{
							tableString+="<th>"+ z +"</th>";
						}							
					}
				}else{
					//adds following rows with row heading and id's
					//based on position for each cell
					tableString+="<th>" + gridRow[x-1] + "</th>";
					for (var y= 1; y<=chosenGrid; y++){
						tableString+="<td id='" + ""+x+y +"' class='cell'></td>";
					}
					
				}
				tableString += "</tr>";					
			}

			//update view by showing grid
			view.showGrid(tinfo,tableString);

			//modify height and width of grid cells based on dimensions
			//of grid
			var trw = $('tr').outerWidth();
			var cw = Math.floor(trw / chosenGrid);
			$('td').width(cw+'px');
			var tw = $('td').width();
			$('td').height(tw+'px');

			var stinfo = document.getElementById('start');
			view.removeClass(stinfo);

		}

		// show ships in legend based on chosen gridsize
		switch (chosenGrid){
			case 5:
				view.showShips(1);
				break;
			case 10:
				view.showShips(2);
				break;
		}
	},

	placeShips: function(lvl){
		var sh = this.allShips;
		var locArray = [];
		//iterate through the allShips object
		for (var i=0; i<sh.length; i++){
			// check whether the ship is requred for that level
			if (sh[i].level.indexOf(lvl)>=0){
				// to decide which direction the ship will be 
				do {
				//creates random location for ship on the grid
					var lngth = sh[i].long;
					var locs=[];
					var cont = true;
					var dir = ['vertical', 'horizontal'];
					var dloc = dir[Math.floor(Math.random()*dir.length)];
					var locc = Math.floor((Math.random()*(this.grid - (lngth-1)) + 1));
					var locr = Math.floor((Math.random()*(this.grid - (lngth-1)) + 1));

					if (dloc =='horizontal'){
						var f = locc.toString();
						for (var x=0; x<lngth; x++){
							locs.push(f + (locr+x));
						}
					} else {
						var f = locr.toString();
						for (var x=0; x<lngth; x++){
						locs.push((locc+x)+f);
						}
					}
				//checks whether the location overlaps another ships loc
					console.log('new location is ' + locs);
					//adds locations coords of ship if its the first one 
					//to be added
					if (locArray.length == 0){
						locArray = locs;
						sh[i].location = locs;
						this.numShips+=1;
					} else {
						//checks whether any of the location coords are same
						//as those of other ship and if so, changes them
						console.log('checking ships for duplicates');
						for (l in locs){
							if (cont){
								console.log(locs[l]);
								if (locArray.indexOf(locs[l]) >= 0){
									console.log('found!');
									cont = false;
								} 
							}
						}
						if (cont) {
							//adds location coords of next ship
							sh[i].location = locs;
							locArray+= ","+locs;
							this.numShips+=1;
						}
					}
				console.log(locArray);
				} while (!cont);
			}
		this.lcArray = locArray;
		}
	},

	checkHitMiss: function(cid,msg) {

					var cidInfo = document.getElementById(cid);
					var isHit = false;
					var message;
					this.turns+=1;
					for (var i=0; i<this.allShips.length; i++){
						var idx = this.allShips[i].location.indexOf(cid);
						if (idx >= 0){
							message = "Its a Hit!";
							isHit = true;
							this.allShips[i].hit[idx]='hit';
							if (this.allShips[i].hit.indexOf(0)==-1){
								var name = this.allShips[i].name;
								message = "You've sunk the " + name;
								this.shipsSunk+= 1;
								view.showShipSunk(i);
								if (this.shipsSunk === this.numShips){
									message = "You Sunk all the enemy ships in " + this.turns + " tries."
								}
							}
							view.showHit(cidInfo,msg,message);
						} 
					}
					if (!isHit){
						message = "You Missed!";
						view.showMiss(cidInfo,msg,message);
					}
				},

	checkShips: function(sloc){

	}

};

var view = {

	hideClass: function(name){
				name.className+= 'hide';
			},

	removeClass: function(name){
				name.classList.remove('hide');
			},

	showGrid: function(where, withWhat){
				where.innerHTML = withWhat; 
			},

	showShips: function(level) {
			var linfo = document.getElementById('legend');
			this.removeClass(linfo);

			var ships = ['smallship-easy2.jpg', 'smallship-medium2.jpg', 'smallship-hard2.jpg', 'submarine-easy3.jpg', 'submarine-medium3.jpg', 'submarine-hard3.jpg', 'battleship-easy3.jpg', 'battleship-hard5.jpg', 'battleship-medium5.jpg'];

			switch (level) {
				case 1:
					linfo.innerHTML+= '<img src="images/scaledbattleship.jpg" alt="Battleship" id="2">' + '<p>3 units long</p>' + '<img src="images/scaledsubmarine.jpg" alt="Submarine" id="3">' + '<p>3 units long</p>' + '<img src="images/scaledsmallship.jpg" alt="Small Ship" id="6">' + '<p>2 units long</p>' ;
					model.placeShips('easy');
					console.log(model.allShips);
					break;
				case 2:
					linfo.innerHTML+= '<img src="images/scaledbattleship.jpg" alt="Battleship" id="0">' + '<p>5 units long</p>'+ '<img src="images/scaleddestroyer.jpg" alt="Destroyer" id="1">' + '<p>5 units long</p>'+ '<img src="images/scaledsubmarine.jpg" alt="Submarine" id="3">' + '<p>3 units long</p>'+ '<img src="images/scaledsubmarine.jpg" alt="Submarine" id="4">' + '<p>3 units long</p>' + '<img src="images/scaledsmallship.jpg" alt="Small Ship" id="5">' + '<p>2 units long</p>';
					$('section').css('padding', '0px 2px 0px 2px');
					model.placeShips('hard');
					console.log(model.allShips);
					break;

			}

		},

	showHit: function(cid,msg,message){
				msg.innerHTML = message;
				$(cid).css({"background-image": "url('images/explosion-easy.jpg')", "background-repeat": "no-repeat", "background-position": "center", "background-color": "white"} );
			},

	showMiss: function(cid,msg,message){
				msg.innerHTML = message;
				$(cid).css("background-color", "blue");
			},

	showShipSunk: function(i){
		console.log($('#' + i));
		$('#'+i).css("-webkit-filter", "grayscale(100%");
	}

};

var controller = {
	// starts game on pressing play and passes the button object as 
	//argument
	startGame: function(self){
				var msg = self;
				msg.innerHTML = "Select a cell";
				// returns id of cell clicked
				var tdInfo = document.getElementsByTagName('td');
				for (var i=0; i<tdInfo.length; i++){
					tdInfo[i].onclick = function(){
						console.log(this.id);
						model.checkHitMiss(this.id,msg);
					}
				}
			}

};


