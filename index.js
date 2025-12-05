const prompt = require("prompt-sync")();

let taxis = [
  {
    id: 1,
    position: 5,
    available: true,
    timeRemaining: 0,
    totalRides: 0,
    traget: [],
    tempsTotal: 0,
  },
  {
    id: 2,
    position: 12,
    available: true,
    timeRemaining: 0,
    totalRides: 0,
    traget: [],
    tempsTotal: 0,
  },
  {
    id: 3,
    position: 20,
    available: true,
    timeRemaining: 0,
    totalRides: 0,
    traget: [],
    tempsTotal: 0,
  },
];
let Requests = [
  { reqId: 1, position: 10, duration: 3 },
  { reqId: 2, position: 3, duration: 4 },
  { reqId: 3, position: 18, duration: 2 },
  { reqId: 4, position: 7, duration: 3 },
];

let fileDattente = [];

const deleteRequest = (req) => {
  return (Requests = Requests.filter((el) => el.reqId !== req.reqId));
};

const emptyTaxi = (taxi, duration) => {
  setTimeout(() => {
    taxi.timeRemaining = 0;
    taxi.available = true;
    // taxi.totalRides++;
  }, duration * 1000);
};

const trouverTaxiProche = (position) => {
  const taxisDisponibles = taxis.filter((taxi) => taxi.available);

  if (!taxisDisponibles.length) {
    console.log("hta taxi machi disponible db ! ");
    return;
  }

  let procheTaxi = taxisDisponibles[0];
  let minimumDistance = Math.abs(procheTaxi.position - position);

  taxisDisponibles.map((taxi) => {
    const currentDist = Math.abs(taxi.position - position);

    if (minimumDistance > currentDist) {
      procheTaxi = taxi;
      minimumDistance = currentDist;
    }
  });

  return procheTaxi;
};

// Requests.forEach((req) =>
//   console.log(req, " ---> ", trouverTaxiProche(req.position))
// );

const asignTaxi = (request) => {
  const taxi = trouverTaxiProche(request.position);

  if (!taxi) {
    console.log("No taxi available right now. Request added to queue.");

    fileDattente.push(request);
    Requests = Requests.filter((item) => item.reqId !== request.reqId);

    return;
  }

  taxi.available = false;
  taxi.timeRemaining = request.duration;
  taxi.position = request.position;
  taxi.totalRides += 1;

  taxi.traget.push(request.position);
  taxi.tempsTotal += request.duration;

  console.log(request, " ---> ", taxi);
  deleteRequest(request);
  emptyTaxi(taxi, request.duration);
};

const asignTaxiToFileDattente = () => {
  console.log(fileDattente);
  while (fileDattente.length > 0) {
    console.table(fileDattente);

    fileDattente.forEach((req) => {
      asignTaxi(req);
      fileDattente = fileDattente.filter((el) => el.reqId !== req.reqId);
    });
  }
};
const simulation = () => {
  console.log(" Starting simulation...");

  Requests.forEach((req) => asignTaxi(req));
  asignTaxiToFileDattente();

  const interval = setInterval(() => {
    console.log(" Current Taxis State:");
    console.table(taxis);
    console.log("file d'attente :", fileDattente);

    const allFree = taxis.every((t) => t.available === true);
    if (allFree && fileDattente.length === 0 && Requests.length === 0) {
      console.log(" Simulation finished successfully!");
      clearInterval(interval);
    }
  }, 1000);
};

simulation();
