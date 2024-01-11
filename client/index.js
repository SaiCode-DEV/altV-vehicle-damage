import alt from "alt-client";
import natives from "natives";

const VehClass = {
  Compact: 0,
  Sedan: 1,
  SUV: 2,
  Coupe: 3,
  Muscle: 4,
  SportsClassic: 5,
  Sport: 6,
  Super: 7,
  Motorcyle: 8,
  Offroad: 9,
  Industrial: 10,
  Utility: 11,
  Vans: 12,
  Cycle: 13,
  Boat: 14,
  Helicopter: 15,
  Plane: 16,
  Service: 17,
  Emergency: 18,
  Military: 19,
  Commercial: 20,
  Train: 21,
  OpenWheel: 22,
};
const excludeDamageClasses = [
  VehClass.Motorcyle,
  VehClass.Offroad,
  VehClass.Boat,
  VehClass.Helicopter,
  VehClass.Plane,
  VehClass.Cycle,
  VehClass.Train,
];
const excludeAirControlClasses = [
  VehClass.Boat,
  VehClass.Helicopter,
  VehClass.Plane,
  VehClass.Motorcyle,
  VehClass.Cycle,
  VehClass.Train,
];
let speedBuffer = [0, 0];

const ExcludeCollisionProps = [
  //small street signs
  alt.hash("prop_bumper_car_01"),
  alt.hash("prop_sign_road_01a"),
  alt.hash("prop_sign_road_01b"),
  alt.hash("prop_sign_road_01c"),
  alt.hash("prop_sign_road_02a"),
  alt.hash("prop_sign_road_03a"),
  alt.hash("prop_sign_road_03b"),
  alt.hash("prop_sign_road_03c"),
  alt.hash("prop_sign_road_03d"),
  alt.hash("prop_sign_road_03e"),
  alt.hash("prop_sign_road_03f"),
  alt.hash("prop_sign_road_03g"),
  alt.hash("prop_sign_road_03h"),
  alt.hash("prop_sign_road_03i"),
  alt.hash("prop_sign_road_03j"),
  alt.hash("prop_sign_road_03k"),
  alt.hash("prop_sign_road_03l"),
  alt.hash("prop_sign_road_03m"),
  alt.hash("prop_sign_road_03n"),
  alt.hash("prop_sign_road_03o"),
  alt.hash("prop_sign_road_03p"),
  alt.hash("prop_sign_road_03q"),
  alt.hash("prop_sign_road_03r"),
  alt.hash("prop_sign_road_03s"),
  alt.hash("prop_sign_road_03t"),
  alt.hash("prop_sign_road_03u"),
  alt.hash("prop_sign_road_03v"),
  alt.hash("prop_sign_road_03w"),
  alt.hash("prop_sign_road_03x"),
  alt.hash("prop_sign_road_03y"),
  alt.hash("prop_sign_road_03z"),
  alt.hash("prop_sign_road_04a"),
  alt.hash("prop_sign_road_04b"),
  alt.hash("prop_sign_road_04c"),
  alt.hash("prop_sign_road_04d"),
  alt.hash("prop_sign_road_04e"),
  alt.hash("prop_sign_road_04f"),
  alt.hash("prop_sign_road_04g"),
  alt.hash("prop_sign_road_04g_l1"),
  alt.hash("prop_sign_road_04h"),
  alt.hash("prop_sign_road_04i"),
  alt.hash("prop_sign_road_04j"),
  alt.hash("prop_sign_road_04k"),
  alt.hash("prop_sign_road_04l"),
  alt.hash("prop_sign_road_04m"),
  alt.hash("prop_sign_road_04n"),
  alt.hash("prop_sign_road_04o"),
  alt.hash("prop_sign_road_04p"),
  alt.hash("prop_sign_road_04q"),
  alt.hash("prop_sign_road_04r"),
  alt.hash("prop_sign_road_04s"),
  alt.hash("prop_sign_road_04t"),
  alt.hash("prop_sign_road_04u"),
  alt.hash("prop_sign_road_04v"),
  alt.hash("prop_sign_road_04w"),
  alt.hash("prop_sign_road_04x"),
  alt.hash("prop_sign_road_04y"),
  alt.hash("prop_sign_road_04z"),
  alt.hash("prop_sign_road_04za"),
  alt.hash("prop_sign_road_04zb"),
  alt.hash("prop_sign_road_05a"),
  alt.hash("prop_sign_road_05b"),
  alt.hash("prop_sign_road_05c"),
  alt.hash("prop_sign_road_05d"),
  alt.hash("prop_sign_road_05e"),
  alt.hash("prop_sign_road_05f"),
  alt.hash("prop_sign_road_05g"),
  alt.hash("prop_sign_road_05h"),
  alt.hash("prop_sign_road_05i"),
  alt.hash("prop_sign_road_05j"),
  alt.hash("prop_sign_road_05k"),
  alt.hash("prop_sign_road_05l"),
  alt.hash("prop_sign_road_05m"),
  alt.hash("prop_sign_road_05n"),
  alt.hash("prop_sign_road_05o"),
  alt.hash("prop_sign_road_05p"),
  alt.hash("prop_sign_road_05q"),
  alt.hash("prop_sign_road_05r"),
  alt.hash("prop_sign_road_05s"),
  alt.hash("prop_sign_road_05t"),
  alt.hash("prop_sign_road_05u"),
  alt.hash("prop_sign_road_05v"),
  alt.hash("prop_sign_road_05w"),
  alt.hash("prop_sign_road_05x"),
  alt.hash("prop_sign_road_05y"),
  alt.hash("prop_sign_road_05z"),
  alt.hash("prop_sign_road_05za"),
  alt.hash("prop_sign_road_06a"),
  alt.hash("prop_sign_road_06b"),
  alt.hash("prop_sign_road_06c"),
  alt.hash("prop_sign_road_06d"),
  alt.hash("prop_sign_road_06e"),
  alt.hash("prop_sign_road_06f"),
  alt.hash("prop_sign_road_06g"),
  alt.hash("prop_sign_road_06h"),
  alt.hash("prop_sign_road_06i"),
  alt.hash("prop_sign_road_06j"),
  alt.hash("prop_sign_road_06k"),
  alt.hash("prop_sign_road_06l"),
  alt.hash("prop_sign_road_06m"),
  alt.hash("prop_sign_road_06n"),
  alt.hash("prop_sign_road_06o"),
  alt.hash("prop_sign_road_06p"),
  alt.hash("prop_sign_road_06q"),
  alt.hash("prop_sign_road_06r"),
  alt.hash("prop_sign_road_07a"),
  alt.hash("prop_sign_road_07b"),
  alt.hash("prop_sign_road_08a"),
  alt.hash("prop_sign_road_08b"),
  alt.hash("prop_sign_road_09a"),
  alt.hash("prop_sign_road_09b"),
  alt.hash("prop_sign_road_09c"),
  alt.hash("prop_sign_road_09d"),
  alt.hash("prop_sign_road_09e"),
  alt.hash("prop_sign_road_09f"),
  alt.hash("prop_sign_road_callbox"),
  alt.hash("prop_beachflag_01"),
  alt.hash("prop_sign_interstate_01"),
  alt.hash("prop_sign_interstate_02"),
  alt.hash("prop_sign_interstate_03"),
  alt.hash("prop_sign_interstate_04"),
  alt.hash("prop_sign_interstate_05"),
  alt.hash("prop_rail_sign01"),
  alt.hash("prop_rail_sign02"),
  alt.hash("prop_rail_sign03"),
  alt.hash("prop_rail_sign04"),
  alt.hash("prop_rail_sign05"),
  alt.hash("prop_rail_sign06"),
  //bins
  alt.hash("prop_bin_01a"),
  alt.hash("prop_bin_02a"),
  alt.hash("prop_bin_03a"),
  alt.hash("prop_bin_04a"),
  alt.hash("prop_bin_05a"),
  alt.hash("prop_bin_06a"),
  alt.hash("prop_bin_07a"),
  alt.hash("prop_bin_07b"),
  alt.hash("prop_bin_07c"),
  alt.hash("prop_bin_07d"),
  alt.hash("prop_bin_08a"),
  alt.hash("prop_bin_08open"),
  alt.hash("prop_bin_10a"),
  alt.hash("prop_bin_10b"),
  alt.hash("prop_bin_11a"),
  alt.hash("prop_bin_11b"),
  alt.hash("prop_bin_12a"),
  alt.hash("prop_bin_beach_01a"),
  alt.hash("prop_bin_beach_01d"),
  alt.hash("zprop_bin_01a_old"),
  //parking meters
  alt.hash("prop_parknmeter_01"),
  alt.hash("prop_parknmeter_02"),
  //cardboard boxes
  alt.hash("prop_rub_boxpile_01"),
  alt.hash("prop_rub_boxpile_02"),
  alt.hash("prop_rub_boxpile_03"),
  alt.hash("prop_rub_boxpile_04"),
  alt.hash("prop_rub_boxpile_04b"),
  alt.hash("prop_rub_boxpile_05"),
  alt.hash("prop_rub_boxpile_06"),
  alt.hash("prop_rub_boxpile_07"),
  alt.hash("prop_rub_boxpile_08"),
  alt.hash("prop_rub_boxpile_09"),
  alt.hash("prop_rub_boxpile_10"),
  //binbags
  alt.hash("prop_rub_binbag_01"),
  alt.hash("prop_rub_binbag_01b"),
  alt.hash("prop_rub_binbag_03"),
  alt.hash("prop_rub_binbag_03b"),
  alt.hash("prop_rub_binbag_04"),
  alt.hash("prop_rub_binbag_05"),
  alt.hash("prop_rub_binbag_06"),
  alt.hash("prop_rub_binbag_08"),
  alt.hash("prop_rub_binbag_sd_01"),
  alt.hash("prop_rub_binbag_sd_02"),
  //barriers
  alt.hash("p_barier_test_s"),
  alt.hash("prop_sec_barier_01a"),
  alt.hash("prop_sec_barier_02a"),
  alt.hash("prop_sec_barier_02b"),
  alt.hash("prop_sec_barier_03a"),
  alt.hash("prop_sec_barier_03b"),
  alt.hash("prop_sec_barier_04a"),
  alt.hash("prop_sec_barier_04b"),
  //traffic cones
  alt.hash("prop_mk_cone"),
  alt.hash("prop_mp_cone_01"),
  alt.hash("prop_mp_cone_02"),
  alt.hash("prop_mp_cone_03"),
  alt.hash("prop_mp_cone_04"),
  alt.hash("prop_roadcone01a"),
  alt.hash("prop_roadcone01b"),
  alt.hash("prop_roadcone01c"),
  alt.hash("prop_roadcone02a"),
  alt.hash("prop_roadcone02b"),
  alt.hash("prop_roadcone02c"),
  alt.hash("prop_roadpole_01a"),
  alt.hash("prop_roadpole_01b"),
  alt.hash("prop_highway_paddle"),
  //other
  alt.hash("prop_bikerack_1a"),
  alt.hash("prop_sign_parking_1"),
];

let airtime = 0;
let interval = null;
let everyTick = null;
let breakCooldown = 0;
let wheels = [true, true, true, true];

function breakWheel() {
  const colision = natives
    .getCollisionNormalOfLastHitForEntity(alt.Player.local.vehicle)
    .mul(2);
  if (colision.z < -1.7) return;
  if (!wheels.includes(true)) return;
  // get the wheel positions
  const veh = alt.Player.local.vehicle;
  let obj = false;
  for (const prop of ExcludeCollisionProps) {
    if (
      natives.hasClosestObjectOfTypeBeenBroken(
        veh.pos.x,
        veh.pos.y,
        veh.pos.z,
        5,
        prop,
        0
      ) ||
      natives.getClosestObjectOfType(
        veh.pos.x,
        veh.pos.y,
        veh.pos.z,
        3,
        prop,
        false,
        false,
        false
      )
    ) {
      obj = true;
      break;
    }
  }
  if (obj && Math.ceil(natives.getEntitySpeed(veh) * 3.6) < 220) {
    return;
  }
  const wheelPositions = [
    natives.getEntityBonePostion(
      veh.scriptID,
      natives.getEntityBoneIndexByName(veh.scriptID, "wheel_lf")
    ),
    natives.getEntityBonePostion(
      veh.scriptID,
      natives.getEntityBoneIndexByName(veh.scriptID, "wheel_rf")
    ),
    natives.getEntityBonePostion(
      veh.scriptID,
      natives.getEntityBoneIndexByName(veh.scriptID, "wheel_lr")
    ),
    natives.getEntityBonePostion(
      veh.scriptID,
      natives.getEntityBoneIndexByName(veh.scriptID, "wheel_rr")
    ),
  ];
  // calculate the distance of the wheels to the collision normal
  const distances = wheelPositions.map((pos) => {
    return pos.sub(veh.pos.add(colision)).length;
  });
  // get the index of the closest wheel
  const hitWheel = distances.indexOf(Math.min(...distances));
  alt.emitServer("vehicleDamage:wheelBreak", hitWheel);
}

function checkVehicleDamage(vehicle) {
  if (
    !vehicle ||
    excludeDamageClasses.includes(natives.getVehicleClass(vehicle))
  )
    return;

  airtime = 0;
  wheels = [true, true, true, true, true, true];
  const speed = Math.ceil(natives.getEntitySpeed(vehicle) * 3.6);
  speedBuffer = [speed, speed];
  interval = alt.setInterval(() => {
    if (breakCooldown > 0) breakCooldown -= 1;
    const speed = Math.ceil(natives.getEntitySpeed(vehicle) * 3.6);
    speedBuffer.push(speed);
    speedBuffer.shift();
    if (Math.abs(speedBuffer[0] - speedBuffer[1]) > 15) {
      alt.emitServer(
        "vehicleDamage:crash",
        Math.abs(speedBuffer[0] - speedBuffer[1])
      );
    }
    if (
      (Math.abs(speedBuffer[0] - speedBuffer[1]) > 20 || speed > 120) &&
      natives.hasEntityCollidedWithAnything(vehicle)
    ) {
      // shofter collision
      breakWheel();
    } else if (Math.abs(speedBuffer[0] - speedBuffer[1]) > 40) {
      // hard collision
      breakWheel();
      breakWheel();
    } else if (Math.abs(speedBuffer[0] - speedBuffer[1]) > 80) {
      // hard collision
      breakWheel();
      breakWheel();
      breakWheel();
      breakWheel();
    }

    if (natives.isEntityInAir(vehicle)) {
      airtime += 1;
    } else {
      if (airtime > 100) {
        breakWheel();
        breakWheel();
        breakWheel();
      } else if (
        airtime > 20 &&
        natives.hasEntityCollidedWithAnything(vehicle)
      ) {
        // airtime collision
        breakWheel();
        airtime = 0;
      }
      airtime = 0;
    }
  }, 50);
}

function checkVehicleControl(vehicle) {
  if (
    !vehicle ||
    excludeAirControlClasses.includes(natives.getVehicleClass(vehicle))
  )
    return;

  everyTick = alt.everyTick(() => {
    if (natives.isEntityInAir(vehicle) || natives.isEntityUpsidedown(vehicle)) {
      natives.disableControlAction(0, 59, true); //INPUT_VEH_MOVE_LR
      natives.disableControlAction(0, 60, true); //INPUT_VEH_MOVE_UD
      natives.disableControlAction(0, 71, true); //INPUT_VEH_ACCELERATE
      natives.disableControlAction(0, 72, true); //INPUT_VEH_BRAKE
    }
  });
}

alt.on("enteredVehicle", (vehicle, seat) => {
  if (seat === 1) {
    checkVehicleDamage(vehicle);
    checkVehicleControl(vehicle);
  }
});

alt.on("leftVehicle", (vehicle, seat) => {
  if (interval) alt.clearInterval(interval);
  if (everyTick) alt.clearEveryTick(everyTick);
});

alt.on("resourceStart", () => {
  if (alt.Player.local.vehicle) {
    checkVehicleDamage(alt.Player.local.vehicle);
    checkVehicleControl(alt.Player.local.vehicle);
  }
});

alt.on("resourceStop", () => {
  if (interval) alt.clearInterval(interval);
  if (everyTick) alt.clearEveryTick(everyTick);
});
