<!-- <script>
   import {msg,mod,slon,slng,shdop,skurs,skal} from "./store"
   
   //let ws = new WebSocket('ws://192.168.8.220:8000/ws');//Marnav
   let ws = new WebSocket('ws://192.168.87.155:8000/ws');//Hjemme
   //let ws = new WebSocket('ws://192.168.43.170:8000/ws');//HUAWEI
   
   let mode = 1;
   
   // let current = 1;
   const modes= [1,2,3,4,5,6,7];
   
   // $:console.log(current);
   
   let klik = ()=>{
       //    console.log('klikket',mode);
       
       ws.send(JSON.stringify({name:'modePanel', mssg:mode}))
    }
    //output event to dom
    const outputMassage = ({data}) => {
        //ev får automatisk adgang til eventen der lyttes til
        //samt destructure ev.data til {data} i argumentet

        const {name,lon,lng,dhop,kurs} = JSON.parse(data); //destructure igen - men nu data elementet
        // out.update('dav')

        if(name == "navigation"){
            $slon = lon;
            $slng = lng;
            $shdop = dhop;
            $skurs = kurs;
            //console.log('her',lat,'der');

        }
        if(name == "bno"){
            $skurs = kurs;
           // console.log('her',kurs,'der');

        }

        if(name=='modePanel'){

            // console.assert(mssg<5,{mssg,errormsg:'tallet er bare for højt'})

        }else{
            // $msg=mssg
        }
    }
    //setup listner 
    ws.addEventListener('message', outputMassage)
    
</script>


<div class="grid-container">

    {#each modes as id}
        <div class="grid-item"
            class:selected="{mode === id}"
            on:click="{() => {mode = id; klik();}}"
        >Mode {id}</div>
    {/each}



  </div>



  <style>
      div.grid-container{
		display: inline-flex;
		justify-content: center;
  		align-content: center;
        /* grid-template-columns: repeat(7, 150px) ; */
        gap: 1em;
	}
	div.grid-item{
		background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid rgba(0, 0, 0, 0.8);
        padding: 20px;
        font-size: 30px;
        text-align: center;
        width: 4em;
        background-color: #ff3e00;
        color: white;
        opacity: 30%;
	}
    div.selected {
        opacity: 100%;
	}
  </style> -->