import { writable } from 'svelte/store';

// export const mod = writable(0);
// export const msg = writable('msg');
// export const slng = writable(0);
// export const slon = writable(0);
// export const shdop = writable('hdop');
// export const skurs = writable("kurs");
// export const skal = writable('kal');
// export const sid = writable('id');
//Fra ESP
export const Lat = writable(' *** ');
export const Lng = writable(' *** ');
export const Hdop = writable(' *** ');
export const Sat = writable(' *** ');

export const Kurs = writable(' *** ');
export const Kal = writable(' *** ');
export const Rawkurs = writable(' *** ');
export const Roll = writable(' *** ');
export const Pitch = writable(' *** ');
export const dt = writable(' *** ');

export const FastholdFlag = writable(false);
export const Fluxgate = writable(false);
export const Vektor = writable(false);
export const nrRays= writable(100);//
export const fixedLat = writable(0);
export const fixedLng= writable(0);
export const rad = writable(1);//1 bue sek.
export const wpAktiv = writable(false);
export const WPoints = writable([]);//et arr af way points - kan man lytte til dem?
export const sp = writable([]);//et arr af way points - kan man lytte til dem?

// export const kursObj = writable([null,null,null]);//et arr af way points - kan man lytte til dem?





