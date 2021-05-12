<script>
    export let ws;
    
    import { Lat, Lng, Hdop, Kurs, Kal,Fluxgate,Vektor,rad, FastholdFlag, fixedLat,fixedLng ,WPoints,wpAktiv,sp} from "../stores/store";
    import { fly } from 'svelte/transition';
    $: udlg1 = ()=>{Math.max(Math.min(formatE($sp,$Kurs),40),-40)}
    $: meter = Math.round($rad*1852/60);
    function formatKurs(val) {
        const v =Math.round((val%360))
        return v<0?v+360:v
        
    }
    function formatE(sp,Kurs) {
        

        let e= Math.round( formatKurs(Kurs)-formatKurs(sp))
        if(e>180)e-=360
        if(e<-180)e+=360
        return Math.round(e)
    }
    let la=0;
    let lg=0;
    let visKinput = false;
    let visRor = false;

    $: $Kurs, spBeregning()
    // let roraktiv = false;
    // let rorudlg = 0;
    let rormode =2;
    let udlg = 0 ; //rorudlæg 0=neutral
    let K = 0.99;
    let visRate = false;
    let ms = 100;
    let setRor = ()=>{let m = JSON.stringify({name:'toESP', mssg: udlg, 'rate':ms,"k":K});
    //console.log(m);
        ws.send(m);
    }
    let fixPos = ()=> {
        la=(Math.round($Lat*100000)/100000).toFixed(5);
        lg=(Math.round($Lng*100000)/100000).toFixed(5);
        $fixedLat = la;
        $fixedLng = lg;
        
    }
    let updatePos = ()=>{
         $fixedLat = la;
         $fixedLng = lg;
    }

    let klik = ()=>{
        let m = JSON.stringify({name:'toESP', mssg: udlg, 'rate':ms,"k":K});
        ws.send(m);
    }
    let distKurs=(PosA,PosB)=>{//A: påkommende B: affarende
        const x = PosA.lat*60*1852-PosB.lat*60*1852
        const y = (PosA.lng*60*1852-PosB.lng*60*1852)*Math.cos((PosA.lat/1+PosB.lat/1)/2*Math.PI/180)
        const dist= Math.sqrt(x*x+y*y) //meter
        let spKurs =  Math.atan2(y, x) * 180 / Math.PI;
        
        // console.log('pos x,y: ', dist,spKurs);
        return{dist,spKurs}

    }
    
    let spBeregning = ()=>{
        let afs
        let stopF=0;
        $WPoints.forEach((wp,i)=>{
            if(stopF ==i) {
                // console.log(wp)
               //'næste WP der ikke er nået
               //distance og kursen udregnes
               afs = distKurs(wp,{lat:$Lat,lng:$Lng})
               if($FastholdFlag){
                   afs = distKurs(wp,{lat:$fixedLat,lng:$fixedLng})
                }
               if(afs.dist<5){
                   console.log(stopF,$WPoints.length,i)
                    stopF++
                }
               $sp = afs.spKurs
            }
            
        })
        return afs
    }
</script>
<h2>Kort indstillinger</h2>
<label> 
    <input on:change={fixPos} type="checkbox"  bind:checked={$Fluxgate}>
    Vis fluxgatekompas
</label>
<label> 
    <input on:change={fixPos} type="checkbox"  bind:checked={$Vektor}>
    Tilpas vektorlængde Fasthold
</label>
{#if $Vektor}
    <div class="panel" transition:fly="{{ y: -5, duration: 200 }}">
        <label>
            <p>Længde af vektor i buesekunder:</p> 
            <input type=number bind:value={$rad} min=1 max=60>
            <input type=range bind:value={$rad} min=1 max=60>
        </label>
        <p>længden: {meter}m</p>
    </div>
{/if}
<label> 
    <input on:change={fixPos} type="checkbox"  bind:checked={$FastholdFlag}>
     Fasthold position
</label>
{#if $FastholdFlag}
    <div class="panel" transition:fly="{{ y: -5, duration: 200 }}">
        <label>
            <p>Bredde og Længde:</p>
            <span>Lat: </span> 
            <input type="number" on:change="{updatePos}" step=0.00001 bind:value={la}>
        </label>
        <label>
            <span>Lng:</span>     
            <input type="number" on:change="{updatePos}" step=0.00001  bind:value={lg}>
        </label>
    </div>
{/if}
<!-- ************************************************************************************* -->
<hr>
<h2>ESP/Arduino indstillinger</h2>
<label> 
    <input type="checkbox"  bind:checked={visKinput}>
    Ret K-værdi i comperatorfilteret
</label>
{#if visKinput}
    <div class="panel" transition:fly="{{ y: -5, duration: 200 }}">
        <label>
            <p>Ret vægtningen (K-værdien) i </p><p> fluxgatekompassets komplementærfilter. </p> 
            <p>K er vægten af gyroværdier i hvert loop</p> 
            <input type=number step=0.001 bind:value={K} min=0.9 max=1>
            <input type=range step=0.001 bind:value={K}  min=0.9 max=1>
        </label>
        <button on:click="{klik}">Send k={K} til controleren</button>
    </div>
{/if}
<label> 
    <input type="checkbox"  bind:checked={visRate}>
    Ret opdateringshastighed
</label>
{#if visRate}
    <div class="panel" transition:fly="{{ y: -5, duration: 200 }}">
        <label>
            <p>Opdateringstid i ms</p> 
            <input type=number bind:value={ms} min=100 max=1000>
            <input type=range bind:value={ms}  min=100 max=1000>
        </label>
        <button on:click="{klik}">Opdatering: {ms}ms</button>
    </div>
{/if}
<label> 
    <input type="checkbox" bind:checked={visRor}>
    Aktiver ror
</label>
{#if visRor}
    <div class="panel" transition:fly="{{ y: -5, duration: 200 }}">
        {#if $WPoints.length>0}
            
        <label>
            <input type=radio bind:group={rormode} value={1}>
            Automatisk
        </label>
        {:else}
        <input type=radio disabled value={1}>
        Automatisk
        {/if}
        <label>
            <input type=radio  bind:group={rormode} value={2}>
            Manuel
        </label>
        {#if rormode==1 && $WPoints.length>0}
        
            <p>SP={formatKurs($sp)}</p>
            <p>PV={Math.round(formatKurs($Kurs))}</p>
            <p> e={formatE($sp,$Kurs)}<p>
            <p>P = 1</p>
            <p>I = 0</p>
            <p>D = 0</p>
            <!-- <p>Rorudlæg={udlg1}</p>
            <input id="range" type="range" on:change="{setRor}" min="-40" bind:value="{udlg1}" max="40" step="5" list="ticks">
            <datalist id="ticks">
              
                <option>-40</option>
                <option>-30</option>
                <option>-20</option>
                <option>-10</option>
                <option>0</option>
                <option>10</option>
                <option>20</option>
                <option>30</option>
                <option>40</option>
              
            </datalist>
            <div id="box">{udlg1}</div> -->
      
        {/if}
        {#if rormode==2}
            
        <label>
            <p>Set rorudlæg.</p> 
            
            <input id="range" type="range" on:change="{setRor}" min="-40" bind:value="{udlg}" max="40" step="5" list="ticks">
            <datalist id="ticks">
                <!-- <option>-50</option> -->
                <option>-40</option>
                <option>-30</option>
                <option>-20</option>
                <option>-10</option>
                <option>0</option>
                <option>10</option>
                <option>20</option>
                <option>30</option>
                <option>40</option>
                <!-- <option>50</option> -->
            </datalist>
            <div id="box">{udlg}</div>
                
        </label>

        {/if}
        
    </div>
{/if}
<hr>
<!-- ************************************************************************************* -->

<h2>Waypoints</h2>
<label> 
    <input type="checkbox"  bind:checked={$wpAktiv}>
     Tilføj Waypoints
</label>
{#if $wpAktiv || $WPoints.length>0}
    <div class="panel" transition:fly="{{ y: -5, duration: 200 }}">

        <p>Bredde og Længde:</p>
        {#each $WPoints as p}
            
            <p class="wp"  >
                <input type="number"  step=0.00001 bind:value={p['lat']}>
                <input type="number"  step=0.00001  bind:value={p['lng']}>
            </p>        
        {/each}
    </div>
{/if}
<hr>
<!-- ************************************************************************************* -->
<style>
    #box{
        margin: 0px;
        display: inline-block;
        border-style:solid;
        border-width: 1px;
        padding: 5px 20px;
        background-color:lightgray;
        width: 30px;
        text-align: center;

    }
    h2{
        margin: 0;
        width:11em
    }

    span{
        display: inline-block;
        width:2em;  
    }
    hr {
        border: 1px solid white;
        border-top: 1px solid grey;
    }
    .panel{
        margin: 0;
        padding: 0 15px 15px 15px;
        background-color: wheat;
    }
    p{
        margin: 0;
        padding: 0;
    }
    .wp input{
        display: inline-block;
        width: 115px;
    }
    
</style>
