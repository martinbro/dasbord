<script>
  import {Lat,Lng,Hdop,Kurs,Sat,Kal,Rawkurs,Roll,Pitch,dt} from "../stores/store"

  let exp = 5;
  let formatKurs = (kurs)=>{
    while (kurs<0) {
      kurs += 360;
    }
    while (kurs>360){
      kurs -= 360;
    }
    return formatNr(kurs,1);//(Math.round(kurs*10)/10).toFixed(1);
  } 
  let formatNr=(tal,antalDecimal)=>{
    return (Math.round(tal*10)/Math.pow(10,antalDecimal)).toFixed(antalDecimal);
  }
</script>

<div class="gridcontainer">
  <div class="table">
    <h4>GPS </h4>
    <table>
      <tr>
        <th>Længde</th>
        <th>Bredde</th>
        <th>HDOP</th>
        <th>Sat</th>
        <!-- <th>Kurs</th>
        <th>Kalibrering</th> -->
      </tr>
      <tr>
        <td>{(Math.round($Lat*Math.pow(10,exp))/Math.pow(10,exp)).toFixed(exp)}</td>
        <td>{(Math.round($Lng*Math.pow(10,exp))/Math.pow(10,exp)).toFixed(exp)}</td>
        <td>{$Hdop}</td>
        <td>{$Sat}</td>
        <!-- <td>{formatKurs($Kurs)}</td>
        <td>{$Kal}</td> -->
      </tr>
    </table>
  </div>
  <div class="table">
    <h4>Gyrokompas </h4>
    <table>
      <tr>
        <!-- <th>Længde</th>
        <th>Bredde</th>
        <th>HDOP</th> -->
        <th>Kurs</th>
        <th>Kalibrering</th>
        <th>Fluxgate</th>
        <th>Roll</th>
        <th>Pitch</th>
        <th>dt</th>
      </tr>
      <tr>
        <!-- <td>{(Math.round($Lat*Math.pow(10,exp))/Math.pow(10,exp)).toFixed(exp)}</td>
        <td>{(Math.round($Lng*Math.pow(10,exp))/Math.pow(10,exp)).toFixed(exp)}</td>
        <td>{$Hdop}</td> -->
        <td>{formatKurs($Kurs)}</td>
        <td>{$Kal}</td>
        <td>{formatKurs($Rawkurs)}</td>
        <td>{formatNr($Roll,1)}</td>
        <td>{formatNr($Pitch,1)}</td>
        <td>{$dt}</td>
      </tr>
    </table>
  </div>
</div>
<style>
.gridcontainer{
    display: grid;
    grid-template-columns: auto  auto ;
    gap: 3em;
  }
th{
  text-align: left;
  
}
h4{
  margin: 0;
  text-align: left;
  display: flex;
  /* width: 140px; */
}
.table{
  display: flex;
  flex-direction: column;
}

  
</style>