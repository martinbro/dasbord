<script>
	//export let name;
	import KortSetup from "./components/KortSetup.svelte";
	import Kort from "./components/Kort.svelte";
	// import Kort2 from "./components/Kort2.svelte";
	import VisData from "./components/VisData.svelte";
	import {Lat,Lng,Hdop,Sat,Kurs,Kal,Rawkurs,Roll,Pitch,dt} from "./stores/store"
	import * as L from 'leaflet';
	import { fade } from 'svelte/transition';
	import Graph from "./components/Graph.svelte";
	

	/* App.svelte ansvar: 
		Henter data fra server. 
		Distribuere data via props eller store
		Sætter componenterne op i meta setup
	*/
	
	//let ws = new WebSocket('ws://192.168.8.220:8000/ws');//Marnav
	//let ws = new WebSocket('ws://192.168.87.155:8000/ws');//Hjemme
   	//let ws = new WebSocket('ws://192.168.43.170:8000/ws');//HUAWEI
   	let ws = new WebSocket('ws://192.168.137.1:8000/ws');//Computer
	//setup listner 

	const inputMassage = ({data}) => {
        //ev får automatisk adgang til eventen, der lyttes til
        //samt destructure ev.data til {data} i argumentet
        
        // const {name,lat,lng,hdop,kurs,kal,rawkurs} = JSON.parse(data); //destructure igen - men nu data elementet'
        let dat = JSON.parse(data); //destructure igen - men nu data elementet'
		if(dat.name ==='navigation'){
			// console.log(lat,lng,dhop);
			$Lat = dat.lat/10000000;//Number.parseFloat(lat)/10000000;
			$Lng = dat.lng/10000000;//Number.parseFloat(lng)/10000000;
			$Hdop = dat.hdop;
			$Kurs = dat.kurs;
			$Kal = dat.kal; //BNO055's kalibrerings status
			$Sat = dat.sat;
			const d =[dat.lat/10000000, dat.lng/10000000, dat.kurs]

		}

        if(dat.name == "bno"){ //Fast update
            $Kurs = dat.kurs;
			$Kal = dat.kal //BNO055's kalibrerings status
			$Rawkurs = dat.rawkurs;
			$Roll  = dat.roll;
			$Pitch  = dat.pitch;
			$dt  = dat.dt;
        }
    }
	ws.addEventListener('message', inputMassage)
  </script>

  	<main>
		  
	
		
			<h1>Navigations app</h1>
		
		<div id="b">
			<VisData></VisData>
		</div>
		<div id="c">
			<Kort></Kort>
		</div>
		<div id="d">
			<KortSetup ws={ws}></KortSetup>
		</div>
		<div id="e">
			<Graph></Graph>
		</div>
			
	</main>

<style>
	main {
		display: grid;
		grid-template-columns: 1fr auto auto auto auto 1fr;	
		gap: 1em;
		/* text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 100px; */
	}
	h1 {
		grid-column: 2 / span 4;
		/* background-color: navy; */
		margin: auto 0 0 0;
	}
	#b {grid-column: 2 / span 1;
		/* background-color:red; */
	}
	#c {grid-area: 3/2/span 1/span 2;
	}


	#d {grid-area: 3/4/span 1/span 1;
		/* background-color: mediumturquoise; */
		/* width: 200px; */
		/* height: 200px; */
		margin: 0;
		padding: 0;

	}
	#e{grid-area: 4/2/span 1/span 1;
	margin-bottom: 5em;
	}
</style>
