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

alt.onClient('vehicleDamage:wheelBreak', breakWheel)
