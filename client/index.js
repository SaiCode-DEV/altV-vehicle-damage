import alt from 'alt-client'
import natives from 'natives'

const wheelBreakSPeed = 100

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
}
const excludeDamageClasses = [
  VehClass.Motorcyle,
  VehClass.Offroad,
  VehClass.Boat,
  VehClass.Helicopter,
  VehClass.Plane,
  VehClass.Cycle,
  VehClass.Train,
]
const excludeAirControlClasses = [
  VehClass.Boat,
  VehClass.Helicopter,
  VehClass.Plane,
  VehClass.Motorcyle,
  VehClass.Cycle,
  VehClass.Train,
]

let airtime = 0
let interval = null
let everyTick = null
let breakCooldown = 0
let wheels = [true, true, true, true]

function breakWheel() {
  const colision = natives.getCollisionNormalOfLastHitForEntity(alt.Player.local.vehicle).mul(2)
  if (colision.z < -1.9) return
  if (!wheels.includes(true)) return
  // get the wheel positions
  const veh = alt.Player.local.vehicle
  const wheelPositions = [
    natives.getEntityBonePostion(veh.scriptID, natives.getEntityBoneIndexByName(veh.scriptID, 'wheel_lf')),
    natives.getEntityBonePostion(veh.scriptID, natives.getEntityBoneIndexByName(veh.scriptID, 'wheel_rf')),
    natives.getEntityBonePostion(veh.scriptID, natives.getEntityBoneIndexByName(veh.scriptID, 'wheel_lr')),
    natives.getEntityBonePostion(veh.scriptID, natives.getEntityBoneIndexByName(veh.scriptID, 'wheel_rr')),
  ]
  // calculate the distance of the wheels to the collision normal
  const distances = wheelPositions.map((pos) => {
    return pos.sub(veh.pos.add(colision)).length
  })
  // get the index of the closest wheel
  const hitWheel = distances.indexOf(Math.min(...distances))
  alt.emitServer('vehicleDamage:wheelBreak', hitWheel)
}

function checkVehicleDamage(vehicle) {
  if (!vehicle || excludeDamageClasses.includes(natives.getVehicleClass(vehicle))) return

  airtime = 0
  wheels = [true, true, true, true, true, true]
  interval = alt.setInterval(() => {
    if (breakCooldown > 0) breakCooldown -= 1
    const speed = Math.ceil(natives.getEntitySpeed(vehicle) * 3.6)
    if (speed > wheelBreakSPeed && natives.hasEntityCollidedWithAnything(vehicle)) {
      breakWheel()
    }

    // airtime check for wheel breaks
    else if (airtime > 20 && natives.hasEntityCollidedWithAnything(vehicle)) {
      breakWheel()
      airtime = 0
    }

    if (natives.isEntityInAir(vehicle)) {
      airtime += 1
    } else {
      if (airtime > 100) {
        breakWheel()
        breakWheel()
        breakWheel()
      }
      airtime = 0
    }
  }, 50)
}

function checkVehicleControl(vehicle) {
  if (!vehicle || excludeAirControlClasses.includes(natives.getVehicleClass(vehicle))) return

  everyTick = alt.everyTick(() => {
    if (natives.isEntityInAir(vehicle) || natives.isEntityUpsidedown(vehicle)) {
      natives.disableControlAction(0, 59, true) //INPUT_VEH_MOVE_LR
      natives.disableControlAction(0, 60, true) //INPUT_VEH_MOVE_UD
      natives.disableControlAction(0, 71, true) //INPUT_VEH_ACCELERATE
      natives.disableControlAction(0, 72, true) //INPUT_VEH_BRAKE
    }
  })
}

alt.on('enteredVehicle', (vehicle, seat) => {
  if (seat === 1) {
    checkVehicleDamage(vehicle)
    checkVehicleControl(vehicle)
  }
})

alt.on('leftVehicle', (vehicle, seat) => {
  if (interval) alt.clearInterval(interval)
  if (everyTick) alt.clearEveryTick(everyTick)
})

alt.on('resourceStart', () => {
  if (alt.Player.local.vehicle) {
    checkVehicleDamage(alt.Player.local.vehicle)
    checkVehicleControl(alt.Player.local.vehicle)
  }
})

alt.on('resourceStop', () => {
  if (interval) alt.clearInterval(interval)
  if (everyTick) alt.clearEveryTick(everyTick)
})
