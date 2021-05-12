<script>
  import {Lat,Lng,Hdop,Kurs,Kal} from "../stores/store"

  let exp = 5;
  let formatKurs = (kurs)=>{
    while (kurs<0) {
      kurs += 360;
    }
    while (kurs>360){
      kurs -= 360;
    }
    return (Math.round(kurs*10)/10).toFixed(1);
  } 
</script>
<h1>Vis data</h1>

<table style="width:100%">
    <tr>
      <th>Længde</th>
      <th>Bredde</th>
      <th>HDOP</th>
      <th>Kurs</th>
      <th>kalibrering</th>
    </tr>
    <tr>
      <td>{(Math.round($Lat*Math.pow(10,exp))/Math.pow(10,exp)).toFixed(exp)}</td>
      <td>{(Math.round($Lng*Math.pow(10,exp))/Math.pow(10,exp)).toFixed(exp)}</td>
      <td>{$Hdop}</td>
      <td>{formatKurs($Kurs)}</td>
      <td>{$Kal}</td>
    </tr>
  </table>