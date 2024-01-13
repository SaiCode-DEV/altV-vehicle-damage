import alt from 'alt-server'

import { damageMultiplyer } from './config.js'

function breakWheel(player, wheelIndex) {
  if (player.vehicle) {
    //if player not in driver seat, return (or accuse of cheating)
    if (player.seat !== 1) return
    if (wheelIndex >= 0 && wheelIndex <= 3) {
      player.vehicle.setWheelDetached(wheelIndex, true)
      //write it to DB or whatever
    }
  }
}

function cash(player, amount) {
  if (player.vehicle) {
    //if player not in driver seat, return (or accuse of cheating)
    if (player.seat !== 1) return
    if (amount < 0) return // probably cheating

    //if engine is already broken (burning), dont add more damage
    if (player.vehicle.engineHealth < 0) return
    // damage multiplyer based on vehicle class
    let mult = 1
    if (player.vehicle.class in damageMultiplyer) {
      mult = damageMultiplyer[player.vehicle.class]
    }
    let damage = player.vehicle.engineHealth - Math.pow(amount, 1.5) * mult
    console.log(damage)
    if (player.vehicle.engineHealth < 300) {
      player.vehicle.engineHealth = Math.max(damage, -1)
    } else {
      player.vehicle.engineHealth = Math.max(damage, 280)
    }
    //write it to DB or whatever
  }
}

alt.onClient('vehicleDamage:wheelBreak', breakWheel)
alt.onClient('vehicleDamage:crash', cash)
