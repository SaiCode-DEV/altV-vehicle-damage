import alt from 'alt-client'
import natives from 'natives'

import { ExcludeCollisionProps, excludeWheelDamageClasses, allowAirControlClass } from './config.js'

let speedBuffer = [0, 0]
let airtime = 0
let interval = null
let everyTick = null
let breakCooldown = 0
let wheels = [true, true, true, true]

function breakWheel() {
  const colision = natives.getCollisionNormalOfLastHitForEntity(alt.Player.local.vehicle).mul(2)
  if (colision.z < -1.7) return
  if (!wheels.includes(true)) return
  // get the wheel positions
  const veh = alt.Player.local.vehicle
  if(excludeWheelDamageClasses.includes(natives.getVehicleClass(veh))) return
  let obj = false
  for (const prop of ExcludeCollisionProps) {
    if (
      natives.hasClosestObjectOfTypeBeenBroken(veh.pos.x, veh.pos.y, veh.pos.z, 5, prop, 0) ||
      natives.getClosestObjectOfType(veh.pos.x, veh.pos.y, veh.pos.z, 3, prop, false, false, false)
    ) {
      obj = true
      break
    }
  }
  if (obj && Math.ceil(natives.getEntitySpeed(veh) * 3.6) < 220) {
    return
  }
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
  console.log('wheel broke with speed ', Math.ceil(natives.getEntitySpeed(veh) * 3.6))
  // get the index of the closest wheel
  const hitWheel = distances.indexOf(Math.min(...distances))
  alt.emitServer('vehicleDamage:wheelBreak', hitWheel)
}

function checkVehicleDamage(vehicle) {
  if (!vehicle) return

  airtime = 0
  wheels = [true, true, true, true, true, true]
  const speed = Math.ceil(natives.getEntitySpeed(vehicle) * 3.6)
  speedBuffer = [speed, speed]
  interval = alt.setInterval(() => {
    if (breakCooldown > 0) breakCooldown -= 1
    const speed = Math.ceil(natives.getEntitySpeed(vehicle) * 3.6)
    speedBuffer.push(speed)
    speedBuffer.shift()
    if (Math.abs(speedBuffer[0] - speedBuffer[1]) > 15) {
      alt.emitServer('vehicleDamage:crash', Math.abs(speedBuffer[0] - speedBuffer[1]))
    }
    if (
      (Math.abs(speedBuffer[0] - speedBuffer[1]) > 20 || speed > 120) &&
      natives.hasEntityCollidedWithAnything(vehicle)
    ) {
      // shofter collision
      breakWheel()
    } else if (Math.abs(speedBuffer[0] - speedBuffer[1]) > 40) {
      // hard collision
      breakWheel()
      breakWheel()
    } else if (Math.abs(speedBuffer[0] - speedBuffer[1]) > 80) {
      // hard collision
      breakWheel()
      breakWheel()
      breakWheel()
      breakWheel()
    }

    if (natives.isEntityInAir(vehicle)) {
      airtime += 1
    } else {
      if (airtime > 100) {
        breakWheel()
        breakWheel()
        breakWheel()
      } else if (airtime > 20 && natives.hasEntityCollidedWithAnything(vehicle)) {
        // airtime collision
        breakWheel()
        airtime = 0
      }
      airtime = 0
    }
  }, 50)
}

function checkVehicleControl(vehicle) {
  if (!vehicle || allowAirControlClass.includes(natives.getVehicleClass(vehicle))) return

  everyTick = alt.everyTick(() => {
    if (!alt.Player.local.vehicle) alt.clearEveryTick(everyTick)
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
