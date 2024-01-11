import alt from 'alt-server'

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
    player.vehicle.engineHealth = Math.max(player.vehicle.engineHealth - Math.pow(amount, 1.5), -1)
    //write it to DB or whatever
  }
}

alt.onClient('vehicleDamage:wheelBreak', breakWheel)
alt.onClient('vehicleDamage:crash', cash)
