<script>
    import * as L from "leaflet";
    import "leaflet/dist/leaflet.css";
    import { Lat, Lng, Hdop, Kurs,Rawkurs, Kal , FastholdFlag,Fluxgate, rad, nrRays , fixedLat,fixedLng,WPoints, wpAktiv} from "../stores/store";
    //Erklæringer **********************************************
    let gps=[]
    $: $Lat, drawPos()
    let drawPos = ()=>{
        if(!$FastholdFlag){
            1.//fjerner alle gps-positioner

        gps.forEach(elm=>{
        
            elm.remove(map)
        })
        //2. tømmer array af GPS
        gps = [] 
        }
        if ($FastholdFlag) {
            //tegner en pos
            let dot = L.circle([$Lat, $Lng], {
                color: 'purple',
                // fillColor: 'purple',
                // fillColor: '#f03',
                fillOpacity: 0.0,
                radius: 0.005
            })
            dot.addTo(map);
            gps.push(dot)
        }
    }
    let map;
    let WP =[];
    let pos = { kurs: 0, kursRad: () => pos.kurs * toRad };
    $: $WPoints , sigtil($WPoints);
    let sigtil = (p)=>{
        // console.log('WP:',p);
        1.//fjerner de gamle cirkler
        WP.forEach(elm=>{
            // const oc = elm.shift()
            elm.remove(map)
        })
        //2. tømmer 

        if(p<1)return
        p.forEach((element, i) => {

            let circle = L.circle([element.lat, element.lng], {
                color: 'green',
                fillColor: 'yellow',
                // fillColor: '#f03',
                fillOpacity: 0.2,
                radius: 5
            })
            circle.addTo(map);
            let icon = L.marker([element.lat, element.lng], {
            icon: L.divIcon({
                className: 'my-custom-icon',
                html: `<p style='color:red,'><strong>${i+1}</strong></p>`
            })
            });
            icon.addTo(map);
            // wp.circleCenter=circle
            // console.log(wp);
            WP.push(circle)
            WP.push(icon)

        }    
    );}
    pos.lat = 54.850948;//54.856843; //Default val
    pos.lng = 10.510416;//10.517485;
    let r = 1;
    const toRad = Math.PI / 180;
    const toDeg = 1 / toRad;

    let i = 0;
    const kl = getLineObject(0); 
    const rkl = getLineObject(100);

    //Funktioner ************************************************
    $: $rad, update_r(); //1/60 = 1 nm
    $:updateKurs($Rawkurs,rkl,$Fluxgate,"blue", 1,0.95,0.2);
    $:updateKurs($Kurs,kl);
    $: $FastholdFlag, reset(100);
    $: $Fluxgate, reset(1);

    let update_r = ()=>{r=$rad / 60 / 60}

    function getLineObject(antal) {
        return{arr:[],antal}
    }

    let reset = (nr=100)=>{
        if ($Fluxgate){
            rkl.antal= 1;
            $FastholdFlag ? rkl.antal= nr : rkl.antal= 1;
        }
        else{rkl.antal=0;}
     }

    const updateKurs = (k,kl,draw=true, color="red",weight = 2,opacity=0.5) => {
        if ((typeof k === "string" || k instanceof String) ){//&& i < 10) {
            console.log("venter på kurs");
            // i++;
            return;
        }
        const nyLinje = line(k, color,weight, opacity);
        while (kl.arr.length>kl.antal) {
            const ol = kl.arr.shift()
            ol.remove(map);
        }
        if (draw){
            nyLinje.addTo(map);
            kl.arr.push(nyLinje)   
        }
    };

    // Definere linjer
    
    let line = (kurs, color,weight, opacity) => {
        pos.kurs = kurs;
        if ($Lat > 0) {
            pos.lat = $Lat;
        }
        if ($Lng > 0) {
            pos.lng = $Lng;
        }
        let pointA = new L.LatLng(pos.lat, pos.lng);
        let pointB = new L.LatLng( pos.lat + r * Math.cos(pos.kursRad()), pos.lng + (r / Math.cos(pos.lat * toRad)) * Math.sin(pos.kursRad()))
        if ($FastholdFlag) {
            pointA= new L.LatLng($fixedLat, $fixedLng)
            pointB = new L.LatLng($fixedLat/1 + r * Math.cos(pos.kursRad()), $fixedLng/1 + (r / Math.cos($fixedLat * toRad)) * Math.sin(pos.kursRad()))
        };
        let pointList = [pointA, pointB];
        return new L.Polyline(pointList, {
            color,
            weight,
            opacity,
            smoothFactor: 1,
        });
    };

    // function handleClick() {
    //     //driver
    //     //Tegner en linje på kortet
    // }

    function createMap(container) {
        let m = L.map(container).setView([pos.lat, pos.lng], 19);
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
            {
                //   attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
                // 	&copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
                //   subdomains: 'abcd',
                maxZoom: 25,
            }
        ).addTo(m);
        return m;
    }
    
    function mapAction(container) {
        map = createMap(container);
        map.on("click", function (e) {
            if($wpAktiv){
                var coord = e.latlng.toString().split(",");
                var lat = coord[0].split("(");
                var lng = coord[1].split(")");
                console.log("You clicked the map at pos: " + lat[1] + "," + lng[0]);
                const point={lat:lat[1].trim(),lng:lng[0].trim()}
                $WPoints=[...$WPoints,point]
            }
        });
        return {
            destroy: () => {map.remove();}
        };
    }
</script>


<div id="kort" style="height:600px;width:800px" use:mapAction />
<style>

</style>